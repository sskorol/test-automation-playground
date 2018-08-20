package io.github.sskorol.playground.service;

import io.github.sskorol.playground.model.User;
import io.github.sskorol.playground.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor(onConstructor = @__({@Autowired}))
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User with " + usernameOrEmail + " username or email is not found"));
    }

    public UserDetails loadUserById(final Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User with id = " + id + " not found"));
    }

    public UserDetails saveUser(final User user) {
        return userRepository.save(user);
    }

    public List<UserDetails> findAll() {
        return userRepository.findAll().stream().map(UserDetails.class::cast).collect(toList());
    }

    public Optional<User> findById(final Long id) {
        return userRepository.findById(id);
    }

    public void delete(final User user) {
        userRepository.delete(user);
    }
}
