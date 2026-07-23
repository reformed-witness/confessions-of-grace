package net.reformedwitness.cog.web;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;

/** Public site: an authenticated (Authentik) user is treated as an admin. */
@Component
public class CurrentUser {

    public boolean isAuthenticated() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        return a != null && a.isAuthenticated() && !(a instanceof AnonymousAuthenticationToken);
    }

    public String owner() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticated() || a == null) {
            return null;
        }
        if (a.getPrincipal() instanceof OidcUser user) {
            return user.getPreferredUsername() != null ? user.getPreferredUsername() : user.getSubject();
        }
        return a.getName();
    }
}
