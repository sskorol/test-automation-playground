package io.github.sskorol.playground.payload;

import lombok.Data;

@Data
public class UserSummary {

    private final Long id;
    private final String name;
    private final String username;
    private final String email;
}
