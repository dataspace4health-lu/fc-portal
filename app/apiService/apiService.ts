import { Configuration, ParticipantsApi } from "../../services/api-client";
import { getToken } from "../components/oidcIntegration";

interface ApiError extends Error {
  response?: {
    status: number;
  };
}
class ApiService {
  private configuration: Configuration;
  private participantsApi: ParticipantsApi;
  private redirectToLogin: () => void;

  constructor(redirectToLogin: () => void) {
    this.configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
    this.participantsApi = new ParticipantsApi(this.configuration);
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
}

export default ApiService;
