package io.github.sskorol.model;

import lombok.Data;

@Data
public class User {

    private final String username;
    private final String password;

    public static User dummy() {
        return new User("skorol", "123456");
    }
}
