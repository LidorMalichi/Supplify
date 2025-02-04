package com.Supplify.Supplify.auth;

import com.Supplify.Supplify.entities.User;
import com.Supplify.Supplify.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository("MYSQL")
@RequiredArgsConstructor
public class ApplicationUserDaoService implements ApplicationUserDao {

    private final UserRepo userRepo;
    //private final UserRoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<ApplicationUser> selectApplicationUserByUsername(String username) throws Exception {
        List<User> userResult = userRepo.findByUsername(username);
        if (userResult.isEmpty()) {
            return getNotFoundUserResult(passwordEncoder);
        } else {
            User user = userResult.get(0);
            //UserRole role = roleRepo.findByKeyNum(userRepo.getUserRoleId(user.getKeyNum()).intValue());


            Set<SimpleGrantedAuthority> permissions = Set.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
            //Set<SimpleGrantedAuthority> permissions = role.getUserPrivileges().stream()
            //.map(permission -> new SimpleGrantedAuthority(permission.getSecurityId()))
            //.collect(Collectors.toSet());
            //permissions.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));

            ApplicationUser applicationUser = new ApplicationUser(
                    user.getUsername(),
                    (user.getPassword() == null || user.getPassword().isEmpty()) ? "" :
                            passwordEncoder.encode(user.getPassword()),
                    permissions,
                    true,
                    true,
                    true,
                    true);
            return Optional.of(applicationUser);
        }
    }

}
