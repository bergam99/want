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

class EditReviewTest {

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

  
}