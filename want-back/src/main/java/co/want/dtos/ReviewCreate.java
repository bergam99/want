package co.want.dtos;

import java.time.Instant;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewCreate(

		@NotNull(message = "osmId is required.") Long osmId,

		@NotNull(message = "userId is required.") Long userId,

		@NotBlank(message = "comment is required.") @Size(min = 5, max = 500, message = "comment must be at least 5 characters and max 500 characters.") String comment,

		@NotNull(message = "rating is required.") @Min(value = 1, message = "rating must be at least 1.") @Max(value = 5, message = "rating must be at most 5.") Integer rating,

		@NotBlank(message = "amenity is required.") @Size(max = 7, message = "amenity must be max 7 characters.") String amenity,

		@NotNull(message = "timestamp is required.") Instant timeStamp,

		@NotNull(message = "likeCount is required.") Integer likeCount) {
}
