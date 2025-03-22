import { describe, it, expect } from 'vitest';
import { mastraApiSpec } from '../index';

describe('Mastra API Specification', () => {
  it('should have valid OpenAPI structure', () => {
    // Check basic OpenAPI structure
    expect(mastraApiSpec).toBeDefined();
    expect(mastraApiSpec.openapi).toBe('3.1.0');
    expect(mastraApiSpec.info).toBeDefined();
    expect(mastraApiSpec.info.title).toBe('Mastra API');
    expect(mastraApiSpec.paths).toBeDefined();
    expect(mastraApiSpec.components).toBeDefined();
  });

  it('should contain all required API sections', () => {
    const paths = mastraApiSpec.paths;
    
    // Check system endpoints
    expect(paths['/api']).toBeDefined();
    
    // Check agent endpoints
    expect(paths['/api/agents']).toBeDefined();
    expect(paths['/api/agents/{agentId}']).toBeDefined();
    expect(paths['/api/agents/{agentId}/generate']).toBeDefined();
    expect(paths['/api/agents/{agentId}/stream']).toBeDefined();
    
    // Check network endpoints
    expect(paths['/api/networks']).toBeDefined();
    expect(paths['/api/networks/{networkId}']).toBeDefined();
    expect(paths['/api/networks/{networkId}/generate']).toBeDefined();
    
    // Check memory endpoints
    expect(paths['/api/memory/threads']).toBeDefined();
    expect(paths['/api/memory/threads/{threadId}']).toBeDefined();
    
    // Check vector endpoints
    expect(paths['/api/vector/{vectorName}/upsert']).toBeDefined();
    expect(paths['/api/vector/{vectorName}/query']).toBeDefined();
  });

  it('should have proper request and response structures', () => {
    // Test agent generate endpoint
    const agentGenerateEndpoint = mastraApiSpec.paths['/api/agents/{agentId}/generate'].post;
    expect(agentGenerateEndpoint).toBeDefined();
    expect(agentGenerateEndpoint.requestBody).toBeDefined();
    expect(agentGenerateEndpoint.responses['200']).toBeDefined();
    expect(agentGenerateEndpoint.responses['404']).toBeDefined();
    
    // Test vector query endpoint
    const vectorQueryEndpoint = mastraApiSpec.paths['/api/vector/{vectorName}/query'].post;
    expect(vectorQueryEndpoint).toBeDefined();
    expect(vectorQueryEndpoint.requestBody).toBeDefined();
    expect(vectorQueryEndpoint.responses['200']).toBeDefined();
    
    // Test memory thread creation
    const memoryThreadsEndpoint = mastraApiSpec.paths['/api/memory/threads'].post;
    expect(memoryThreadsEndpoint).toBeDefined();
    expect(memoryThreadsEndpoint.requestBody).toBeDefined();
    expect(memoryThreadsEndpoint.responses['200']).toBeDefined();
  });
});
