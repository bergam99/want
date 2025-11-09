package co.want.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreate(

		@NotBlank(message = "Email is required.") @Email(message = "Not a valid email format") String email,

		@NotBlank(message = "Password is required.") @Size(min = 10, max = 20, message = "Password must be at least 10 characters and max 20 characters.") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+<>?]).+$", message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.") String password

) {

	@Override
	public String toString() {
		return "UserCreate [email=" + email + ", password=PROTECTED]";
	}
}
