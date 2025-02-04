package com.Supplify.Supplify.jwt;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "application.jwt")
@Configuration
@Getter
@Setter
@NoArgsConstructor
public class JwtConfig {
    private String secretKey;
}
