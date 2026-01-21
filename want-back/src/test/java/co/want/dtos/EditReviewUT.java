package co.want.dtos;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.ConstraintViolation;

import java.time.Instant;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class EditReviewUT {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should create valid EditReview")
    void testValidEditReview() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a great product!",
            5,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertTrue(violations.isEmpty(), "Should have no violations");
        assertEquals(1L, review.id());
        assertEquals("This is a great product!", review.comment());
        assertEquals(5, review.rating());
        assertNotNull(review.timeStamp());
    }

    @Test
    @DisplayName("Should fail when id is null")
    void testIdNull() {
        // Arrange & Act
        EditReview review = new EditReview(
            null,
            "This is a comment",
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("id is required.", violation.getMessage());
        assertEquals("id", violation.getPropertyPath().toString());
    }

    @Test
    @DisplayName("Should fail when comment is null")
    void testCommentNull() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            null,
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("comment is required.", violation.getMessage());
    }

    @Test
    @DisplayName("Should fail when comment is blank")
    void testCommentBlank() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "   ",
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
            .anyMatch(v -> v.getMessage().equals("comment is required.")));
    }

    @Test
    @DisplayName("Should fail when comment is too short (less than 5 characters)")
    void testCommentTooShort() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "Bad",
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("comment must be at least 5 characters and max 500 characters.", violation.getMessage());
    }

    @Test
    @DisplayName("Should fail when comment is too long (more than 500 characters)")
    void testCommentTooLong() {
        // Arrange & Act
        String longComment = "a".repeat(501);
        EditReview review = new EditReview(
            1L,
            longComment,
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("comment must be at least 5 characters and max 500 characters.", violation.getMessage());
    }

    @Test
    @DisplayName("Should accept comment at minimum length (5 characters)")
    void testCommentMinimumLength() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "Good!",
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should accept comment at maximum length (500 characters)")
    void testCommentMaximumLength() {
        // Arrange & Act
        String maxComment = "a".repeat(500);
        EditReview review = new EditReview(
            1L,
            maxComment,
            3,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should fail when rating is null")
    void testRatingNull() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            null,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("rating is required.", violation.getMessage());
    }

    @Test
    @DisplayName("Should fail when rating is less than 1")
    void testRatingTooLow() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            0,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("rating must be at least 1.", violation.getMessage());
    }

    @Test
    @DisplayName("Should fail when rating is greater than 5")
    void testRatingTooHigh() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            6,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("rating must be at most 5.", violation.getMessage());
    }

    @Test
    @DisplayName("Should accept rating = 1 (minimum value)")
    void testRatingMinimumValue() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            1,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should accept rating = 5 (maximum value)")
    void testRatingMaximumValue() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            5,
            Instant.now()
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should fail when timestamp is null")
    void testTimestampNull() {
        // Arrange & Act
        EditReview review = new EditReview(
            1L,
            "This is a comment",
            3,
            null
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<EditReview> violation = violations.iterator().next();
        assertEquals("timestamp is required.", violation.getMessage());
    }

    @Test
    @DisplayName("Should have multiple violations when multiple fields are invalid")
    void testMultipleViolations() {
        // Arrange & Act
        EditReview review = new EditReview(
            null,
            "bad",
            0,
            null
        );

        Set<ConstraintViolation<EditReview>> violations = validator.validate(review);

        // Assert
        assertEquals(4, violations.size());
        
        Set<String> messages = violations.stream()
            .map(ConstraintViolation::getMessage)
            .collect(java.util.stream.Collectors.toSet());
        
        assertTrue(messages.contains("id is required."));
        assertTrue(messages.contains("comment must be at least 5 characters and max 500 characters."));
        assertTrue(messages.contains("rating must be at least 1."));
        assertTrue(messages.contains("timestamp is required."));
    }

    @Test
    @DisplayName("Should verify equality of two identical EditReview records")
    void testRecordEquality() {
        // Arrange
        Instant timestamp = Instant.now();
        EditReview review1 = new EditReview(1L, "Great product", 5, timestamp);
        EditReview review2 = new EditReview(1L, "Great product", 5, timestamp);

        // Assert
        assertEquals(review1, review2);
        assertEquals(review1.hashCode(), review2.hashCode());
    }

    @Test
    @DisplayName("Should verify inequality of two different EditReview records")
    void testRecordInequality() {
        // Arrange
        Instant timestamp = Instant.now();
        EditReview review1 = new EditReview(1L, "Great product", 5, timestamp);
        EditReview review2 = new EditReview(2L, "Great product", 5, timestamp);

        // Assert
        assertNotEquals(review1, review2);
    }

    @Test
    @DisplayName("Should verify toString contains the values")
    void testRecordToString() {
        // Arrange
        Instant timestamp = Instant.now();
        EditReview review = new EditReview(1L, "Great product", 5, timestamp);

        // Act
        String toString = review.toString();

        // Assert
        assertTrue(toString.contains("1"));
        assertTrue(toString.contains("Great product"));
        assertTrue(toString.contains("5"));
    }
}