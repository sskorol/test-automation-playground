package io.github.sskorol.playground.repository;

import io.github.sskorol.playground.model.Role;
import io.github.sskorol.playground.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName roleName);
}
