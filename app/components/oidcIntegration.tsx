import { useSearchParams } from "next/navigation";
import {
  OidcClientSettings,
  UserManager,
  WebStorageStateStore,
} from "oidc-client-ts";

// Helper to check if we're running in a browser
const isBrowser = typeof window !== "undefined";

// OIDC Configuration
export const oidcConfig = {
  authority: "https://dataspace4health.local/iam/realms/gaia-x",
  client_id: "federated-catalogue",
  client_secret: "cf|J{G3z7a,@su5j(EJzq^G$a6)4D9",
  grant_type: "authorization_code",
  redirect_uri: `http://localhost:3000/redirect`,
  //   response_type: "code",
  scope: "openid", // Customize scopes
  userStore: isBrowser
    ? new WebStorageStateStore({ store: window.localStorage })
    : undefined, // Avoid using window.localStorage on the server
  loadUserInfo: true,
  post_logout_redirect_uri: "http://localhost:3000/",
};

// Initialize UserManager
const userManager = new UserManager({
  ...oidcConfig,
  //   metadataUrl: `${oidcConfig.authority}/.well-known/openid-configuration`,
  //   fetch: customFetch, // Use the custom fetch here
});

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
  console.log("user", user);
  return user?.access_token;
};
