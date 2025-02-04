package com.Supplify.Supplify.security;

import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.jwt.JwtUtils;
import com.Supplify.Supplify.repositories.UserRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;


import java.io.IOException;

@RequiredArgsConstructor
public class CustomUsernameAndPasswordAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final JwtUtils jwtUtils;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            UsernameAndPasswordAuthenticationRequest authenticationRequest = new ObjectMapper()
                    .readValue(request.getInputStream(), UsernameAndPasswordAuthenticationRequest.class);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), // principal
                    authenticationRequest.getPassword()  // credentials
            );

            authentication.setDetails(authenticationDetailsSource.buildDetails(request));

            return authenticationManager.authenticate(authentication);
        } catch (IOException error) {
            throw new RuntimeException(error);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        User user = userRepo.findByUsername(authResult.getName()).get(0);
        String token = jwtUtils.generateToken((UserDetails) authResult.getDetails(), null);

        response.addHeader("Authorization", "Bearer " + token);


    }
}
