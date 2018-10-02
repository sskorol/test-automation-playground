package io.github.sskorol.playground.controller;

import io.github.sskorol.playground.exception.ApplicationException;
import io.github.sskorol.playground.model.RoleName;
import io.github.sskorol.playground.model.User;
import io.github.sskorol.playground.payload.ApiResponse;
import io.github.sskorol.playground.payload.JwtAuthenticationResponse;
import io.github.sskorol.playground.payload.LoginRequest;
import io.github.sskorol.playground.payload.SignUpRequest;
import io.github.sskorol.playground.repository.RoleRepository;
import io.github.sskorol.playground.repository.UserRepository;
import io.github.sskorol.playground.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;

import static java.lang.Double.parseDouble;
import static java.util.Collections.singleton;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor(onConstructor = @__( {@Autowired}))
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        val authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsernameOrEmail(),
                loginRequest.getPassword()
            )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        val jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Email address already in use!"));
        }

        val savedUser = userRepository.save(new User(
            signUpRequest.getName(),
            signUpRequest.getAge(),
            parseDouble(signUpRequest.getSalary()),
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword()),
            singleton(roleRepository.findByName(RoleName.USER).orElseThrow(() -> new ApplicationException("[USER] role doesn't exist!")))));
        val location = ServletUriComponentsBuilder
            .fromCurrentContextPath().path("/api/users/{username}")
            .buildAndExpand(savedUser.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User has been successfully registered!"));
    }
}
