package co.want.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import co.want.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);
}