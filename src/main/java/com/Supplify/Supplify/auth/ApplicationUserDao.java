package com.Supplify.Supplify.auth;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Optional;

public interface ApplicationUserDao {

    Optional<ApplicationUser> selectApplicationUserByUsername(String username) throws Exception;

    default Optional<ApplicationUser> getNotFoundUserResult(PasswordEncoder passwordEncoder) {
        ApplicationUser applicationUser = new ApplicationUser(
                "No user found",
                passwordEncoder.encode("jakdjnlad4%$##%3$s,jfn>sjka" + new Date().getTime()),
                new LinkedHashSet<>(),
                true,
                true,
                true,
                true);
        return Optional.of(applicationUser);
    }

}
