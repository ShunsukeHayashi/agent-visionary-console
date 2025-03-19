/**
 * Mastra API OpenAPI Specification
 * This file contains the OpenAPI 3.1.0 specification for the Mastra API.
 */

export const mastraApiSpec = {
  "openapi": "3.1.0",
  "info": {
    "title": "Mastra API",
    "description": "Mastra API",
    "version": "1.0.0"
  },
  "paths": {
    "/api": {
      "get": {
        "responses": {
          "200": {
            "description": "Success"
          }
        },
        "operationId": "getApi",
        "tags": ["system"],
        "parameters": [],
        "description": "Get API status"
      }
    },
    "/api/agents": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all agents"
          }
        },
        "operationId": "getApiAgents",
        "tags": ["agents"],
        "parameters": [],
        "description": "Get all available agents"
      }
    },
    "/api/networks": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all networks"
          }
        },
        "operationId": "getApiNetworks",
        "tags": ["networks"],
        "parameters": [],
        "description": "Get all available networks"
      }
    },
    "/api/networks/{networkId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Network details"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "getApiNetworksByNetworkId",
        "tags": ["networks"],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get network by ID"
      }
    },
    "/api/networks/{networkId}/generate": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated response"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "postApiNetworksByNetworkIdGenerate",
        "tags": ["networks"],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generate a response from a network",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "input": {
                    "oneOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      }
                    ],
                    "description": "Input for the network, can be a string or an array of CoreMessage objects"
                  }
                },
                "required": ["input"]
              }
            }
          }
        }
      }
    },
    "/api/networks/{networkId}/stream": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated response"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "postApiNetworksByNetworkIdStream",
        "tags": ["networks"],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generate a response from a network",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "input": {
                    "oneOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      }
                    ],
                    "description": "Input for the network, can be a string or an array of CoreMessage objects"
                  }
                },
                "required": ["input"]
              }
            }
          }
        }
      }
    },
    "/api/agents/{agentId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Agent details"
          },
          "404": {
            "description": "Agent not found"
          }
        },
        "operationId": "getApiAgentsByAgentId",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get agent by ID"
      }
    },
    "/api/agents/{agentId}/evals/ci": {
      "get": {
        "responses": {
          "200": {
            "description": "List of evals"
          }
        },
        "operationId": "getApiAgentsByAgentIdEvalsCi",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get CI evals by agent ID"
      }
    },
    "/api/agents/{agentId}/evals/live": {
      "get": {
        "responses": {
          "200": {
            "description": "List of evals"
          }
        },
        "operationId": "getApiAgentsByAgentIdEvalsLive",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get live evals by agent ID"
      }
    },
    "/api/agents/{agentId}/generate": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated response"
          },
          "404": {
            "description": "Agent not found"
          }
        },
        "operationId": "postApiAgentsByAgentIdGenerate",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generate a response from an agent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "messages": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "threadId": {
                    "type": "string"
                  },
                  "resourceId": {
                    "type": "string",
                    "description": "The resource ID for the conversation"
                  },
                  "resourceid": {
                    "type": "string",
                    "description": "The resource ID for the conversation (deprecated, use resourceId instead)",
                    "deprecated": true
                  },
                  "runId": {
                    "type": "string"
                  },
                  "output": {
                    "type": "object"
                  }
                },
                "required": ["messages"]
              }
            }
          }
        }
      }
    },
    "/api/agents/{agentId}/stream": {
      "post": {
        "responses": {
          "200": {
            "description": "Streamed response"
          },
          "404": {
            "description": "Agent not found"
          }
        },
        "operationId": "postApiAgentsByAgentIdStream",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Stream a response from an agent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "messages": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "threadId": {
                    "type": "string"
                  },
                  "resourceId": {
                    "type": "string",
                    "description": "The resource ID for the conversation"
                  },
                  "resourceid": {
                    "type": "string",
                    "description": "The resource ID for the conversation (deprecated, use resourceId instead)",
                    "deprecated": true
                  },
                  "runId": {
                    "type": "string"
                  },
                  "output": {
                    "type": "object"
                  }
                },
                "required": ["messages"]
              }
            }
          }
        }
      }
    },
    "/api/agents/{agentId}/instructions": {
      "post": {
        "responses": {
          "200": {
            "description": "Instructions updated successfully"
          },
          "403": {
            "description": "Not allowed in non-playground environment"
          },
          "404": {
            "description": "Agent not found"
          }
        },
        "operationId": "postApiAgentsByAgentIdInstructions",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update an agent's instructions",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "instructions": {
                    "type": "string",
                    "description": "New instructions for the agent"
                  }
                },
                "required": ["instructions"]
              }
            }
          }
        }
      }
    },
    "/api/agents/{agentId}/instructions/enhance": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated system prompt and analysis",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "explanation": {
                      "type": "string",
                      "description": "Detailed analysis of the instructions"
                    },
                    "new_prompt": {
                      "type": "string",
                      "description": "The enhanced system prompt"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Missing or invalid request parameters"
          },
          "404": {
            "description": "Agent not found"
          },
          "500": {
            "description": "Internal server error or model response parsing error"
          }
        },
        "operationId": "postApiAgentsByAgentIdInstructionsEnhance",
        "tags": ["agents"],
        "parameters": [
          {
            "name": "agentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID of the agent whose model will be used for prompt generation"
          }
        ],
        "description": "Generate an improved system prompt from instructions",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "instructions": {
                    "type": "string",
                    "description": "Instructions to generate a system prompt from"
                  },
                  "comment": {
                    "type": "string",
                    "description": "Optional comment for the enhanced prompt"
                  }
                },
                "required": ["instructions"]
              }
            }
          }
        }
      }
    },
    "/api/memory/status": {
      "get": {
        "responses": {
          "200": {
            "description": "Memory status"
          }
        },
        "operationId": "getApiMemoryStatus",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get memory status"
      }
    },
    "/api/memory/threads": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all threads"
          }
        },
        "operationId": "getApiMemoryThreads",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "resourceid",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get all threads"
      },
      "post": {
        "responses": {
          "200": {
            "description": "Created thread"
          }
        },
        "operationId": "postApiMemoryThreads",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create a new thread",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string"
                  },
                  "metadata": {
                    "type": "object"
                  },
                  "resourceid": {
                    "type": "string"
                  },
                  "threadId": {
                    "type": "string"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/memory/threads/{threadId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Thread details"
          },
          "404": {
            "description": "Thread not found"
          }
        },
        "operationId": "getApiMemoryThreadsByThreadId",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "threadId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get thread by ID"
      },
      "patch": {
        "responses": {
          "200": {
            "description": "Updated thread"
          },
          "404": {
            "description": "Thread not found"
          }
        },
        "operationId": "patchApiMemoryThreadsByThreadId",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "threadId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update a thread",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object"
              }
            }
          }
        }
      },
      "delete": {
        "responses": {
          "200": {
            "description": "Thread deleted"
          },
          "404": {
            "description": "Thread not found"
          }
        },
        "operationId": "deleteApiMemoryThreadsByThreadId",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "threadId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete a thread"
      }
    },
    "/api/memory/threads/{threadId}/messages": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all messages in a thread"
          },
          "404": {
            "description": "Thread not found"
          }
        },
        "operationId": "getApiMemoryThreadsByThreadIdMessages",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "threadId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get all messages in a thread"
      },
      "post": {
        "responses": {
          "200": {
            "description": "Created message"
          },
          "404": {
            "description": "Thread not found"
          }
        },
        "operationId": "postApiMemoryThreadsByThreadIdMessages",
        "tags": ["memory"],
        "parameters": [
          {
            "name": "threadId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "agentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create a new message in a thread",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "role": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string"
                  },
                  "metadata": {
                    "type": "object"
                  }
                },
                "required": ["role", "content"]
              }
            }
          }
        }
      }
    },
    "/api/telemetry/events": {
      "post": {
        "responses": {
          "200": {
            "description": "Event recorded"
          }
        },
        "operationId": "postApiTelemetryEvents",
        "tags": ["telemetry"],
        "parameters": [],
        "description": "Record a telemetry event",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "event": {
                    "type": "string"
                  },
                  "properties": {
                    "type": "object"
                  }
                },
                "required": ["event"]
              }
            }
          }
        }
      }
    },
    "/api/workflows": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all workflows"
          }
        },
        "operationId": "getApiWorkflows",
        "tags": ["workflows"],
        "parameters": [],
        "description": "Get all workflows"
      }
    },
    "/api/workflows/{workflowId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Workflow details"
          },
          "404": {
            "description": "Workflow not found"
          }
        },
        "operationId": "getApiWorkflowsByWorkflowId",
        "tags": ["workflows"],
        "parameters": [
          {
            "name": "workflowId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get workflow by ID"
      }
    },
    "/api/workflows/{workflowId}/run": {
      "post": {
        "responses": {
          "200": {
            "description": "Workflow run started"
          },
          "404": {
            "description": "Workflow not found"
          }
        },
        "operationId": "postApiWorkflowsByWorkflowIdRun",
        "tags": ["workflows"],
        "parameters": [
          {
            "name": "workflowId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "query",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create and start a new workflow run"
      }
    },
    "/api/workflows/{workflowId}/watch": {
      "get": {
        "responses": {
          "200": {
            "description": "Workflow transitions in real-time"
          }
        },
        "operationId": "getApiWorkflowsByWorkflowIdWatch",
        "tags": ["workflows"],
        "parameters": [
          {
            "name": "workflowId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "runId",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Watch workflow transitions in real-time"
      }
    },
    "/api/logs": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all logs"
          }
        },
        "operationId": "getApiLogs",
        "tags": ["logs"],
        "parameters": [
          {
            "name": "transportId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get all logs"
      }
    },
    "/api/logs/transports": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all log transports"
          }
        },
        "operationId": "getApiLogsTransports",
        "tags": ["logs"],
        "parameters": [],
        "description": "List of all log transports"
      }
    },
    "/api/logs/{runId}": {
      "get": {
        "responses": {
          "200": {
            "description": "List of logs for run ID"
          }
        },
        "operationId": "getApiLogsByRunId",
        "tags": ["logs"],
        "parameters": [
          {
            "name": "runId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "transportId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get logs by run ID"
      }
    },
    "/api/tools": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all tools"
          }
        },
        "operationId": "getApiTools",
        "tags": ["tools"],
        "parameters": [],
        "description": "Get all tools"
      }
    },
    "/api/tools/{toolId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Tool details"
          },
          "404": {
            "description": "Tool not found"
          }
        },
        "operationId": "getApiToolsByToolId",
        "tags": ["tools"],
        "parameters": [
          {
            "name": "toolId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get tool by ID"
      }
    },
    "/api/tools/{toolId}/execute": {
      "post": {
        "responses": {
          "200": {
            "description": "Tool execution result"
          },
          "404": {
            "description": "Tool not found"
          }
        },
        "operationId": "postApiToolsByToolIdExecute",
        "tags": ["tools"],
        "parameters": [
          {
            "name": "toolId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Execute a tool",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "data": {
                    "type": "object"
                  }
                },
                "required": ["data"]
              }
            }
          }
        }
      }
    },
    "/api/vector/{vectorName}/upsert": {
      "post": {
        "responses": {
          "200": {
            "description": "Vectors upserted successfully"
          }
        },
        "operationId": "postApiVectorByVectorNameUpsert",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Upsert vectors into an index",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "indexName": {
                    "type": "string"
                  },
                  "vectors": {
                    "type": "array",
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "number"
                      }
                    }
                  },
                  "metadata": {
                    "type": "array",
                    "items": {
                      "type": "object"
                    }
                  },
                  "ids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": ["indexName", "vectors"]
              }
            }
          }
        }
      }
    },
    "/api/vector/{vectorName}/create-index": {
      "post": {
        "responses": {
          "200": {
            "description": "Index created successfully"
          }
        },
        "operationId": "postApiVectorByVectorNameCreate-index",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create a new vector index",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "indexName": {
                    "type": "string"
                  },
                  "dimension": {
                    "type": "number"
                  },
                  "metric": {
                    "type": "string",
                    "enum": ["cosine", "euclidean", "dotproduct"]
                  }
                },
                "required": ["indexName", "dimension"]
              }
            }
          }
        }
      }
    },
    "/api/vector/{vectorName}/query": {
      "post": {
        "responses": {
          "200": {
            "description": "Query results"
          }
        },
        "operationId": "postApiVectorByVectorNameQuery",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Query vectors from an index",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "indexName": {
                    "type": "string"
                  },
                  "queryVector": {
                    "type": "array",
                    "items": {
                      "type": "number"
                    }
                  },
                  "topK": {
                    "type": "number"
                  },
                  "filter": {
                    "type": "object"
                  },
                  "includeVector": {
                    "type": "boolean"
                  }
                },
                "required": ["indexName", "queryVector"]
              }
            }
          }
        }
      }
    },
    "/api/vector/{vectorName}/indexes": {
      "get": {
        "responses": {
          "200": {
            "description": "List of indexes"
          }
        },
        "operationId": "getApiVectorByVectorNameIndexes",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "List all indexes for a vector store"
      }
    },
    "/api/vector/{vectorName}/indexes/{indexName}": {
      "get": {
        "responses": {
          "200": {
            "description": "Index details"
          }
        },
        "operationId": "getApiVectorByVectorNameIndexesByIndexName",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "indexName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get details about a specific index"
      },
      "delete": {
        "responses": {
          "200": {
            "description": "Index deleted successfully"
          }
        },
        "operationId": "deleteApiVectorByVectorNameIndexesByIndexName",
        "tags": ["vector"],
        "parameters": [
          {
            "name": "vectorName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "indexName",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete a specific index"
      }
    }
  },
  "components": {
    "schemas": {}
  }
};
