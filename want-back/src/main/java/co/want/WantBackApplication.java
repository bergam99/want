package co.want;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class WantBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(WantBackApplication.class, args);
	}

    @GetMapping("/test")
    String ping() {
	return "ok";
    }
}
