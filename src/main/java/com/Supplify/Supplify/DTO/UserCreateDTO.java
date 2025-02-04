package com.Supplify.Supplify.DTO;

import lombok.Data;

@Data
public class UserCreateDTO {
    private String firstName;
    private String lastName;
    private String businessName;
    private String username;
    private String password;
    private String email;
    private String phone;
}
