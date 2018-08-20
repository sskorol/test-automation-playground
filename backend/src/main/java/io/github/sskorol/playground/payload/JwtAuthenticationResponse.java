package io.github.sskorol.playground.payload;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {

    private final String accessToken;
    private String tokenType = "Bearer";
}
