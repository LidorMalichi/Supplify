package com.Supplify.Supplify.services;

import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {
    private final UserRepo userRepo;

    public void createUser(User user) {
        userRepo.save(user);
    }

    public Optional<User> findUserByID(int id) {
        return userRepo.findById(id);
    }

    public List<User> findUserByFirstNameAndLastName(String firstName, String lastName) {
        return userRepo.findUsersByFirstNameAndLastName(firstName, lastName);
    }
}
