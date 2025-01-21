import { Configuration, ParticipantsApi } from "../../services/api-client";
import { getToken } from "../components/oidcIntegration";

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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw error;
    }
  }

}

export default ApiService;
