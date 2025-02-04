package com.Supplify.Supplify.security;

import com.Supplify.Supplify.auth.ApplicationUserService;
import com.Supplify.Supplify.jwt.JwtAuthFilter;
import com.Supplify.Supplify.jwt.JwtUtils;
import com.Supplify.Supplify.repositories.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class ApplicationSecurityConfig {

    private final ApplicationUserService applicationUserService;
    private AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter ) throws Exception {
        CustomUsernameAndPasswordAuthenticationFilter filter = new CustomUsernameAndPasswordAuthenticationFilter(authenticationManager, userRepo, jwtUtils);
        return http
                .authorizeHttpRequests(
                        authorizeHttp -> {
                            authorizeHttp.requestMatchers("/").permitAll();
                            authorizeHttp.requestMatchers("/login").permitAll();
                            authorizeHttp.anyRequest().authenticated();
                        }
                )
                .addFilterBefore(jwtAuthFilter, CustomUsernameAndPasswordAuthenticationFilter.class)
                .addFilterBefore(filter, AuthorizationFilter.class)
                .authenticationManager(authenticationManager)
                .build();
    }


    @Bean
    AuthenticationManager authenticationManager(AuthenticationManagerBuilder auth) throws Exception {
        return auth.authenticationProvider(UsernamePasswordAuthenticationProvider()).build();
    }

    @Bean
    public AuthenticationProvider UsernamePasswordAuthenticationProvider() {
        final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(applicationUserService);
        return provider;
    }
}
