package com.Supplify.Supplify.controllers;


import com.Supplify.Supplify.DTO.UserCreateDTO;
import com.Supplify.Supplify.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("register")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("createNewAccount")
    ResponseEntity<?> createNewAccount(@RequestBody UserCreateDTO userCreateDTO) {
        userService.createUser(userCreateDTO);
        return ResponseEntity.ok("User created successfully.");
    }
}
