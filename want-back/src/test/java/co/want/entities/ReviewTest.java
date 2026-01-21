package co.want.entities;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class ReviewTest {

    private Review review;

    @BeforeEach
    void setUp() {
        review = new Review();
    }

    @Test
    @DisplayName("Should create Review with no-arg constructor")
    void testNoArgConstructor() {
        // Act
        Review newReview = new Review();

        // Assert
        assertNotNull(newReview);
        assertNull(newReview.getId());
        assertNull(newReview.getOsmId());
        assertNull(newReview.getUserId());
        assertNull(newReview.getComment());
        assertNull(newReview.getRating());
        assertNull(newReview.getTimeStamp());
        assertNull(newReview.getLikeCount());
    }

    @Test
    @DisplayName("Should set and get id")
    void testSetAndGetId() {
        // Arrange
        Long expectedId = 1L;

        // Act
        review.setId(expectedId);

        // Assert
        assertEquals(expectedId, review.getId());
    }

    @Test
    @DisplayName("Should set and get osmId")
    void testSetAndGetOsmId() {
        // Arrange
        Long expectedOsmId = 12345L;

        // Act
        review.setOsmId(expectedOsmId);

        // Assert
        assertEquals(expectedOsmId, review.getOsmId());
    }

    @Test
    @DisplayName("Should set and get userId")
    void testSetAndGetUserId() {
        // Arrange
        Long expectedUserId = 100L;

        // Act
        review.setUserId(expectedUserId);

        // Assert
        assertEquals(expectedUserId, review.getUserId());
    }

    @Test
    @DisplayName("Should set and get comment")
    void testSetAndGetComment() {
        // Arrange
        String expectedComment = "This is a great place!";

        // Act
        review.setComment(expectedComment);

        // Assert
        assertEquals(expectedComment, review.getComment());
    }

    @Test
    @DisplayName("Should set and get rating")
    void testSetAndGetRating() {
        // Arrange
        Integer expectedRating = 5;

        // Act
        review.setRating(expectedRating);

        // Assert
        assertEquals(expectedRating, review.getRating());
    }

    @Test
    @DisplayName("Should set and get timeStamp")
    void testSetAndGetTimeStamp() {
        // Arrange
        Instant expectedTimeStamp = Instant.now();

        // Act
        review.setTimeStamp(expectedTimeStamp);

        // Assert
        assertEquals(expectedTimeStamp, review.getTimeStamp());
    }

    @Test
    @DisplayName("Should set and get likeCount")
    void testSetAndGetLikeCount() {
        // Arrange
        Integer expectedLikeCount = 42;

        // Act
        review.setLikeCount(expectedLikeCount);

        // Assert
        assertEquals(expectedLikeCount, review.getLikeCount());
    }

    @Test
    @DisplayName("Should handle null values for all fields")
    void testNullValues() {
        // Act
        review.setId(null);
        review.setOsmId(null);
        review.setUserId(null);
        review.setComment(null);
        review.setRating(null);
        review.setTimeStamp(null);
        review.setLikeCount(null);

        // Assert
        assertNull(review.getId());
        assertNull(review.getOsmId());
        assertNull(review.getUserId());
        assertNull(review.getComment());
        assertNull(review.getRating());
        assertNull(review.getTimeStamp());
        assertNull(review.getLikeCount());
    }

    @Test
    @DisplayName("Should handle empty string for comment")
    void testEmptyComment() {
        // Arrange
        String emptyComment = "";

        // Act
        review.setComment(emptyComment);

        // Assert
        assertEquals(emptyComment, review.getComment());
    }

    @Test
    @DisplayName("Should handle zero values for numeric fields")
    void testZeroValues() {
        // Act
        review.setId(0L);
        review.setOsmId(0L);
        review.setUserId(0L);
        review.setRating(0);
        review.setLikeCount(0);

        // Assert
        assertEquals(0L, review.getId());
        assertEquals(0L, review.getOsmId());
        assertEquals(0L, review.getUserId());
        assertEquals(0, review.getRating());
        assertEquals(0, review.getLikeCount());
    }

    @Test
    @DisplayName("Should handle negative values for numeric fields")
    void testNegativeValues() {
        // Act
        review.setId(-1L);
        review.setOsmId(-1L);
        review.setUserId(-1L);
        review.setRating(-5);
        review.setLikeCount(-10);

        // Assert
        assertEquals(-1L, review.getId());
        assertEquals(-1L, review.getOsmId());
        assertEquals(-1L, review.getUserId());
        assertEquals(-5, review.getRating());
        assertEquals(-10, review.getLikeCount());
    }

    @Test
    @DisplayName("Should return correct toString representation")
    void testToString() {
        // Arrange
        review.setId(1L);
        review.setOsmId(12345L);
        review.setUserId(100L);
        review.setComment("Great place!");
        review.setRating(5);
        review.setTimeStamp(Instant.parse("2024-01-15T10:30:00Z"));
        review.setLikeCount(42);

        // Act
        String result = review.toString();

        // Assert
        assertTrue(result.contains("id=1"));
        assertTrue(result.contains("osmId=12345"));
        assertTrue(result.contains("userId=100"));
        assertTrue(result.contains("comment=Great place!"));
        assertTrue(result.contains("rating=5"));
        assertTrue(result.contains("2024-01-15T10:30:00Z"));
        assertTrue(result.contains("likeCount=42"));
    }

    @Test
    @DisplayName("Should return toString with null values")
    void testToStringWithNulls() {
        // Act
        String result = review.toString();

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("Review"));
        assertTrue(result.contains("null"));
    }

    @Test
    @DisplayName("Should set all fields correctly")
    void testSetAllFields() {
        // Arrange
        Long id = 1L;
        Long osmId = 12345L;
        Long userId = 100L;
        String comment = "Excellent service!";
        Integer rating = 5;
        Instant timeStamp = Instant.now();
        Integer likeCount = 15;

        // Act
        review.setId(id);
        review.setOsmId(osmId);
        review.setUserId(userId);
        review.setComment(comment);
        review.setRating(rating);
        review.setTimeStamp(timeStamp);
        review.setLikeCount(likeCount);

        // Assert
        assertEquals(id, review.getId());
        assertEquals(osmId, review.getOsmId());
        assertEquals(userId, review.getUserId());
        assertEquals(comment, review.getComment());
        assertEquals(rating, review.getRating());
        assertEquals(timeStamp, review.getTimeStamp());
        assertEquals(likeCount, review.getLikeCount());
    }

    @Test
    @DisplayName("Should allow updating existing values")
    void testUpdateValues() {
        // Arrange
        review.setComment("Initial comment");
        review.setRating(3);
        review.setLikeCount(5);

        // Act
        review.setComment("Updated comment");
        review.setRating(5);
        review.setLikeCount(10);

        // Assert
        assertEquals("Updated comment", review.getComment());
        assertEquals(5, review.getRating());
        assertEquals(10, review.getLikeCount());
    }

    @Test
    @DisplayName("Should handle very long comment strings")
    void testLongComment() {
        // Arrange
        String longComment = "a".repeat(1000);

        // Act
        review.setComment(longComment);

        // Assert
        assertEquals(longComment, review.getComment());
        assertEquals(1000, review.getComment().length());
    }

    @Test
    @DisplayName("Should handle large numeric values")
    void testLargeNumericValues() {
        // Arrange
        Long largeId = Long.MAX_VALUE;
        Integer largeRating = Integer.MAX_VALUE;
        Integer largeLikeCount = Integer.MAX_VALUE;

        // Act
        review.setId(largeId);
        review.setRating(largeRating);
        review.setLikeCount(largeLikeCount);

        // Assert
        assertEquals(largeId, review.getId());
        assertEquals(largeRating, review.getRating());
        assertEquals(largeLikeCount, review.getLikeCount());
    }

    @Test
    @DisplayName("Should handle instant timestamps correctly")
    void testInstantTimeStamp() {
        // Arrange
        Instant past = Instant.parse("2020-01-01T00:00:00Z");
        Instant now = Instant.now();
        Instant future = Instant.parse("2030-12-31T23:59:59Z");

        // Act & Assert - Past
        review.setTimeStamp(past);
        assertEquals(past, review.getTimeStamp());

        // Act & Assert - Now
        review.setTimeStamp(now);
        assertEquals(now, review.getTimeStamp());

        // Act & Assert - Future
        review.setTimeStamp(future);
        assertEquals(future, review.getTimeStamp());
    }
}