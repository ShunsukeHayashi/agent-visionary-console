import { describe, it, expect } from 'vitest';
import { MastraAPI } from '../api';

describe('Mastra API Behavior', () => {
  const api = new MastraAPI();

  describe('System Endpoints', () => {
    it('should return API status', async () => {
      const result = await api.getApiStatus();
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('ok');
    });
  });

  describe('Agent Endpoints', () => {
    it('should return list of agents', async () => {
      const result = await api.getAgents();
      expect(result).toHaveProperty('agents');
      expect(Array.isArray(result.agents)).toBe(true);
    });

    it('should return agent by ID', async () => {
      const agentId = 'test-agent-id';
      const result = await api.getAgentById(agentId);
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(agentId);
    });

    it('should generate agent response', async () => {
      const agentId = 'test-agent-id';
      const messages = [{ role: 'user', content: 'Hello' }];
      const result = await api.generateAgentResponse(agentId, messages);
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('agentId');
      expect(result.agentId).toBe(agentId);
    });
  });

  describe('Network Endpoints', () => {
    it('should return list of networks', async () => {
      const result = await api.getNetworks();
      expect(result).toHaveProperty('networks');
      expect(Array.isArray(result.networks)).toBe(true);
    });

    it('should return network by ID', async () => {
      const networkId = 'test-network-id';
      const result = await api.getNetworkById(networkId);
      expect(result).toHaveProperty('id');
      expect(result.id).toBe(networkId);
    });
  });

  describe('Vector Endpoints', () => {
    it('should query vector', async () => {
      const vectorName = 'test-vector';
      const indexName = 'test-index';
      const queryVector = [0.1, 0.2, 0.3];
      const result = await api.queryVector(vectorName, indexName, queryVector);
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });
  });
});
