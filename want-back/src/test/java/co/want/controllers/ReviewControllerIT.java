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
        
        api.perform(builder)
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()", is(2)))
           
           .andExpect(jsonPath("$[0].osmId", is(123456789)))
           .andExpect(jsonPath("$[0].userEmail", is("alice@example.com"))) 
           .andExpect(jsonPath("$[0].comment", is("content1")))           
           .andExpect(jsonPath("$[0].rating", is(5)))
           .andExpect(jsonPath("$[0].timeStamp").value(org.hamcrest.Matchers.containsString("2025-12-07T13:05:52")))
           
           .andExpect(jsonPath("$[1].osmId", is(123456789)))
           .andExpect(jsonPath("$[1].userEmail", is("bob@example.com")))  
           .andExpect(jsonPath("$[1].comment", is("content2")))          
           .andExpect(jsonPath("$[1].rating", is(4)))
           .andExpect(jsonPath("$[1].timeStamp").value(org.hamcrest.Matchers.containsString("2025-12-07T13:08:10")));
    }
}