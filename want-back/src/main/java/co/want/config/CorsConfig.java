package co.want.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
	

    @Value("${want.cors.allowedOrigins}")
    private String allowedOrigins;
    
	@Bean
	WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // about all endpoints
						.allowedOrigins(allowedOrigins)
						.allowedMethods("GET", "POST", "PUT", "DELETE") // allow only these HTTP methods
						.allowCredentials(true); // allow origin contain Authorization header or cookie
			}
		};
	}

}
