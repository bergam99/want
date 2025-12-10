package co.want;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(classes = WantBackApplication.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles(value = "test")
public abstract class BaseMvcTests {

    @Autowired
    protected MockMvc api;

    @Autowired
    private ObjectMapper objectMapper;

    protected MockHttpServletRequestBuilder newPostRequestBuilder(
	    final String uri, final Object body)
	    throws JsonProcessingException {
	final var json = objectMapper.writeValueAsString(body);
	return MockMvcRequestBuilders.post(uri)
		.contentType(MediaType.APPLICATION_JSON).content(json);
    }

    protected MockHttpServletRequestBuilder newGetRequestBuilder(
	    final String uri) {
	return MockMvcRequestBuilders.get(uri);
    }

}