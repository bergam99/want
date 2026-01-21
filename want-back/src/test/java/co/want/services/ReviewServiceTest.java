package co.want.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import co.want.entities.LikeReview;
import co.want.entities.Review;
import co.want.repositories.LikeReviewRepository;
import co.want.repositories.ReviewRepository;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private LikeReviewRepository likeReviewRepository;

    @Mock
    private SseService sse;

    @InjectMocks
    private ReviewService reviewService;

    private Review testReview;
    private final Long userId = 1L;
    private final Long reviewId = 100L;

    @BeforeEach
    void setUp() {
        testReview = new Review();
        testReview.setId(reviewId);
        testReview.setUserId(userId);
        testReview.setLikeCount(0);
    }

    @Test
    @DisplayName("Should increment likes and notify author when like is added")
    void testLikeToggle_AddLike() {
        // Arrange
        Long likerId = 2L; // Different user
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(testReview));
        when(likeReviewRepository.findByReviewIdAndUserId(reviewId, likerId)).thenReturn(Optional.empty());

        // Act
        reviewService.like(reviewId, likerId);

        // Assert
        assertEquals(1, testReview.getLikeCount());
        verify(likeReviewRepository, times(1)).save(any(LikeReview.class));
        verify(sse, times(1)).sendNotification(userId, likerId);
        verify(reviewRepository).save(testReview);
    }

    @Test
    @DisplayName("Should decrement likes and NOT notify when unliking")
    void testLikeToggle_RemoveLike() {
        // Arrange
        testReview.setLikeCount(1);
        LikeReview existingLike = new LikeReview();
        
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(testReview));
        when(likeReviewRepository.findByReviewIdAndUserId(reviewId, userId)).thenReturn(Optional.of(existingLike));

        // Act
        reviewService.like(reviewId, userId);

        // Assert
        assertEquals(0, testReview.getLikeCount());
        verify(likeReviewRepository, times(1)).delete(existingLike);
        verify(sse, never()).sendNotification(anyLong(), anyLong());
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when deleting someone else's review")
    void testDelete_AccessDenied() {
        // Arrange
        Long unauthorizedUserId = 999L;
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(testReview));

        // Act & Assert
        assertThrows(AccessDeniedException.class, () -> {
            reviewService.delete(reviewId, unauthorizedUserId);
        });
        
        verify(reviewRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should successfully delete own review")
    void testDelete_Success() {
        // Arrange
        when(reviewRepository.findById(reviewId)).thenReturn(Optional.of(testReview));

        // Act
        reviewService.delete(reviewId, userId);

        // Assert
        verify(reviewRepository, times(1)).delete(testReview);
    }
}