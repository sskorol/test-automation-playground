package io.github.sskorol.playground.payload;

import lombok.Data;

@Data
public class ApiResponse {

    private final Boolean success;
    private final String message;
}
