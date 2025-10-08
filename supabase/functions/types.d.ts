// Deno Types
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;

  export function serve(handler: (request: Request) => Promise<Response>): void;
}

// Web API Types
interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
}

interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

declare const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
declare const Request: {
  prototype: Request;
  new(input: RequestInfo, init?: RequestInit): Request;
};
declare const Response: {
  prototype: Response;
  new(body?: BodyInit | null, init?: ResponseInit): Response;
};
declare const URL: {
  prototype: URL;
  new(url: string, base?: string | URL): URL;
};

// SendGrid Types
declare module 'npm:@sendgrid/mail' {
  interface EmailData {
    to: string;
    from: string;
    subject: string;
    text?: string;
    html?: string;
    templateId?: string;
    dynamicTemplateData?: Record<string, any>;
  }

  export function setApiKey(key: string): void;
  export function send(data: EmailData | EmailData[]): Promise<[Response, {}]>;
}