import { mastraApiSpec } from './index';

// Mock API implementation for testing
export class MastraAPI {
  // System endpoints
  async getApiStatus() {
    return { status: 'ok' };
  }

  // Agent endpoints
  async getAgents() {
    return { agents: [] };
  }

  async getAgentById(agentId: string) {
    return { id: agentId, name: 'Test Agent' };
  }

  async generateAgentResponse(agentId: string, messages: any[]) {
    return { response: 'This is a test response', agentId };
  }

  // Network endpoints
  async getNetworks() {
    return { networks: [] };
  }

  async getNetworkById(networkId: string) {
    return { id: networkId, name: 'Test Network' };
  }

  // Vector endpoints
  async queryVector(vectorName: string, indexName: string, queryVector: number[]) {
    return { results: [] };
  }
}
