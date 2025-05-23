import axios from "axios";
import { Configuration, ParticipantsApi, RolesApi, SelfDescriptionsApi, User, UsersApi } from "../../services/api-client";
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
  private usersApi: UsersApi;
  private rolesApi: RolesApi;
  private redirectToLogin: () => void;

  constructor(redirectToLogin: () => void) {
    this.configuration = new Configuration({
      basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
    });
    this.participantsApi = new ParticipantsApi(this.configuration);
    this.selfDescriptionsApi = new SelfDescriptionsApi(this.configuration);
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

  async deleteParticipant(participantId: string) {
    await this.fetchTokenIfNeeded();
    try {
      return await this.participantsApi.deleteParticipant(participantId);
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

  /**
   * 
   * @param dataLink string
   * @description This function is used to access data from a given link.
   * It uses axios to make a GET request to the provided link.
   * If the request fails, it logs an error message to the console.
   * @returns {Promise<void>}
   * @throws {Error} If the request fails, an error is logged to the console.
   * 
  */
  async accessTermsAndConditions(link: string): Promise<void> {
    try {
      return await axios.get(link);
    } catch (error) {
      console.error(error, "Data cannot be accessed");
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

  // Api call of register contract and needs to be changed later on when it it defined in the backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async makeContract(signedContractVp: any) {
    try {
      await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
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

  // Api call for accessing data and needs to be checked later on when it it defined in the backend
  async accessData(dataLink: string) {
    try {
      return await axios.get(dataLink);
    } catch (error) {
      console.error(error, "Data cannot be accessed");
    }
  }
}

export default ApiService;
