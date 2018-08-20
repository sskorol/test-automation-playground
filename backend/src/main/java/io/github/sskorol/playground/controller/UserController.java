package io.github.sskorol.playground.controller;

import io.github.sskorol.playground.exception.ResourceNotFoundException;
import io.github.sskorol.playground.model.User;
import io.github.sskorol.playground.payload.UserIdentityAvailability;
import io.github.sskorol.playground.payload.UserProfile;
import io.github.sskorol.playground.payload.UserSummary;
import io.github.sskorol.playground.repository.UserRepository;
import io.github.sskorol.playground.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor(onConstructor = @__( {@Autowired}))
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser(@CurrentUser User currentUser) {
        return new UserSummary(currentUser.getId(), currentUser.getName(), currentUser.getAge(),
            currentUser.getSalary(), currentUser.getUsername(), currentUser.getEmail());
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        return new UserIdentityAvailability(!userRepository.existsByUsername(username));
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        return new UserIdentityAvailability(!userRepository.existsByEmail(email));
    }

    @GetMapping("/users/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        val user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return new UserProfile(user.getId(), user.getUsername(), user.getName());
    }

    @GetMapping("/users")
    public List<UserSummary> getAllUsers(@RequestParam("limit") long limit) {
        return userRepository.findAll().stream()
            .limit(limit)
            .map(user -> new UserSummary(user.getId(), user.getName(), user.getAge(), user.getSalary(),
                user.getUsername(), user.getEmail()))
            .collect(toList());
    }
}
