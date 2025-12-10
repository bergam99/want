package co.want.controllers;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;


import co.want.BaseIT;

public class ReviewControllerIT extends BaseIT{
	
    @Test
    void should_return_all_reviews() throws Exception {
	final var builder = newGetRequestBuilder("/review/read/123456789");
	api.perform(builder).andExpect(status().isOk())
		.andExpect(jsonPath("$.length()", is(2)))
		  .andExpect(jsonPath("$[0].osmId", is(123456789)))
	       .andExpect(jsonPath("$[0].userEmail", is("user1@example.com")))
	       .andExpect(jsonPath("$[0].comment", is("comment1")))
	       .andExpect(jsonPath("$[0].rating", is(5)))
	       .andExpect(jsonPath("$[0].amenity", is("toilet")))
	       .andExpect(jsonPath("$[0].timeStamp", is("2025-12-07T13:05:52.414513Z")))
	       .andExpect(jsonPath("$[1].osmId", is(123456789)))
	       .andExpect(jsonPath("$[1].userEmail", is("user2@example.com")))
	       .andExpect(jsonPath("$[1].comment", is("comment3")))
	       .andExpect(jsonPath("$[1].rating", is(4)))
	       .andExpect(jsonPath("$[1].amenity", is("toilet")))
	       .andExpect(jsonPath("$[1].timeStamp", is("2025-12-07T13:08:10.971359Z")));
    }
}

