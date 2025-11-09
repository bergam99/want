package co.want.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
	@Bean
	WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // about all endpoints
						.allowedOrigins("http://localhost:5173") // allow only "http://localhost:5173"
						.allowedMethods("GET", "POST", "PUT", "DELETE") // allow only these HTTP methods
						.allowCredentials(true); // allow origin contain Authorization header or cookie
			}
		};
	}

}
