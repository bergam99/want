package co.want.dtos;

import jakarta.validation.constraints.NotBlank;

public record UserAuthenticate(

		@NotBlank(message = "Email is required.") String email,

		@NotBlank(message = "Password is required.") String password

) {

	@Override
	public String toString() {
		return "UserAuthenticate [email=" + email + ", password=PROTECTED";
	}
}
