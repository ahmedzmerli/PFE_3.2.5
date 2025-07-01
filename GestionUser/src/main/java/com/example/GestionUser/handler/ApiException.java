package com.example.GestionUser.handler;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final int code;
    private final HttpStatus status;

    public ApiException(BusinessErrorCodes errorCode) {
        super(errorCode.getDescription());
        this.code = errorCode.getCode();
        this.status = errorCode.getHttpStatus();
    }
}
