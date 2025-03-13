import axios from "axios";
import { Configuration, ParticipantsApi, SelfDescriptionsApi } from "../../services/api-client";
import { getToken } from "../components/oidcIntegration";

interface ApiError extends Error {
  response?: {
    status: number;
  };
}
class ApiService {
  private configuration: Configuration;
  private participantsApi: ParticipantsApi;
  private selfDescriptionsApi: SelfDescriptionsApi;
  private redirectToLogin: () => void;

  constructor(redirectToLogin: () => void) {
    this.configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
    this.participantsApi = new ParticipantsApi(this.configuration);
    this.selfDescriptionsApi = new SelfDescriptionsApi(this.configuration);
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

  async getServiceOfferings(withContent: boolean) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.selfDescriptionsApi.readSelfDescriptions(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, withContent, undefined, undefined, undefined);
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

  async getServiceOfferingDetails(selfDescriptionHash: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.selfDescriptionsApi.readSelfDescriptionByHash(selfDescriptionHash);
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

  async createServiceOffering(body: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.selfDescriptionsApi.addSelfDescription(body);
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

  async deleteServiceOffering(selfDescriptionHash: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.selfDescriptionsApi.deleteSelfDescription(selfDescriptionHash);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async checkServiceOfferingCompliance(serviceOfferingVp: any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GAIAX_COMPLIANCE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceOfferingVp),
      });

      let responseData = null;

      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.warn("Failed to parse response JSON:", jsonError);
      }

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: responseData?.message || response.statusText || "Unknown error from server",
          details: responseData || null
        };
      }

      return { success: true, data: responseData };
    } catch (error: unknown) {
      return { success: false, status: 500, message: (error as Error).message || "Unknown error" };
    }
  }
  
  // Api call of register contract and needs to be changed later on when it it defined in the backend
  async registerContract(contractVp: any) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register-contract`, {
        ...contractVp
      });
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response && apiError.response.status === 401) {
        console.log("redirect to login");
        this.redirectToLogin(); // Handle redirection here
        return;
      }
      throw apiError;
    }
  }

  // Api call of make contract and needs to be changed later on when it it defined in the backend
  async makeContract(signedContractVp: any) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/make-contract`, {
        ...signedContractVp
      });
    } catch (error) {
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
