import { UserManager, WebStorageStateStore } from "oidc-client-ts";

// Helper to check if we're running in a browser
const isBrowser = typeof window !== "undefined";

// OIDC Configuration
export const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_OIDC_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
  client_secret: process.env.NEXT_PUBLIC_OIDC_CLIENT_SECRET!,
  grant_type: process.env.NEXT_PUBLIC_OIDC_GRANT_TYPE!,
  redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI!,
  response_type: process.env.NEXT_PUBLIC_OIDC_RESPONSE_TYPE!,
  scope: process.env.NEXT_PUBLIC_OIDC_SCOPE!, // Customize scopes
  userStore: isBrowser
    ? new WebStorageStateStore({ store: window.localStorage })
    : undefined, // Avoid using window.localStorage on the server
  loadUserInfo: true,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI!,
};


// Initialize UserManager
const userManager = new UserManager(oidcConfig);

// Login Function
export const login = async () => {
  await userManager.signinRedirect();
};

// Logout Function
export const logout = async () => {
  await userManager.signoutRedirect();
};

// Get Token Function
export const getToken = async () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("code") && urlParams.get("state")) {
      await userManager.signinRedirectCallback();
    }
  }
  const user = await userManager.getUser();
  return user?.access_token;
};
