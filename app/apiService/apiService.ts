import { Configuration, ParticipantsApi, RolesApi, User, UsersApi } from "../../services/api-client";
import { getToken } from "../components/oidcIntegration";

interface ApiError extends Error {
  response?: {
    status: number;
  };
}
class ApiService {
  private configuration: Configuration;
  private participantsApi: ParticipantsApi;
  private usersApi: UsersApi;
  private rolesApi: RolesApi;
  private redirectToLogin: () => void;

  constructor(redirectToLogin: () => void) {
    this.configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
    this.participantsApi = new ParticipantsApi(this.configuration);
    this.usersApi = new UsersApi(this.configuration);
    this.rolesApi = new RolesApi(this.configuration);
    this.redirectToLogin = redirectToLogin;
  }

  private async fetchTokenIfNeeded() {
    if (!this.configuration.accessToken) {
      const token = await getToken();
      if (token) {
        this.configuration.accessToken = token;
      } else {
        throw new Error("Unauthorized");
      }
    }
  }

  async getParticipants() {
    await this.fetchTokenIfNeeded();
    try {
      return await this.participantsApi.getParticipants();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  async createParticipant(body: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.participantsApi.addParticipant(body);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }





  /**
   * User management api services
   */
  async getUsers() {
    await this.fetchTokenIfNeeded();
    try {
      return await this.usersApi.getUsers();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  async createUser(body: User) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.usersApi.addUser(body);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  async updateUser(userId: string, body: User) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.usersApi.updateUser(userId, body);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  async deleteUser(userId: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.usersApi.deleteUser(userId);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  async getRoles() {
    await this.fetchTokenIfNeeded();
    try {
      return await this.rolesApi.getAllRoles();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }
}

export default ApiService;
