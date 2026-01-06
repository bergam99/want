package co.want.controllers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import co.want.BaseMvcTests;
import co.want.dtos.ReviewCreate;

@ActiveProfiles("test")
public class ReviewControllerUT extends BaseMvcTests {
	  @Test
	  void createReview_ValidationFailure() throws Exception {
	        ReviewCreate invalidInput = new ReviewCreate(3454L, 1L, "ex", 4, Instant.now(), 0);

	        api.perform(newPostRequestBuilder("/review/create", invalidInput))
	                .andExpect(status().isBadRequest()); // 400
	    }
}
