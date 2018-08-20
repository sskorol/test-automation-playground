package io.github.sskorol.playground.payload;

import lombok.Data;

@Data
public class UserProfile {

    private final Long id;
    private final String username;
    private final String name;
}
