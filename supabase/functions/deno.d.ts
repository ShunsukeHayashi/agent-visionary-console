declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }
  
  export const env: Env;
  
  export interface ConnInfo {
    localAddr: string;
    remoteAddr: string;
  }
  
  export interface RequestEvent {
    request: Request;
    respondWith(response: Response | Promise<Response>): Promise<void>;
  }
  
  export function serve(
    handler: (request: Request, connInfo: ConnInfo) => Response | Promise<Response>
  ): void;
}
