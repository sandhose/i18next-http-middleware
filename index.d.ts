/// <reference types="node" />

// import * as fastify from 'fastify';
import * as http from 'http'; 
import * as http2 from "http2";
import * as i18next from 'i18next';


type HttpRequest = http.IncomingMessage | http2.Http2ServerRequest;

interface I18nextRequest {
  language: string;
  languages: string[];
  i18n: i18next.i18n;
  t: i18next.TFunction;
}

declare global {
  namespace Express {
    export interface Request extends I18nextRequest {}
  }
}

// declare module 'fastify' {
//   interface FastifyRequest<HttpRequest> extends I18nextRequest {}
// }

declare namespace i18nextHttpMiddleware {

  type Request = http.IncomingMessage;
  type Response = http.ServerResponse;

  type Handler = (req: Request, res: Response) => any;

  type I18next = i18next.i18n;
  type IgnoreRoutesFunction = (req: Request, res: Response, options: HandleOptions, i18next: I18next) => boolean;

  type App<T extends string = 'get'> = {
    [fn in T]: (handler: Handler) => any;
  }

  interface HandleOptions {
    ignoredRoutes?: string[] | IgnoreRoutesFunction;
    removeLngFromUrl?: boolean;
  }
  interface GetResourcesHandlerOptions {
    maxAge?: number;
    cache?: boolean;
    lngParam?: string;
    nsParam?: string;
  }
  interface MissingKeyHandlerOptions {
    lngParam?: string;
    nsParam?: string;
  }

  // export const plugin: fastify.Plugin<http.Server, http.IncomingMessage, http.ServerResponse, HandleOptions>;

  export function handle(i18next: I18next, options?: HandleOptions): Handler;
  export function getResourcesHandler(i18next: I18next, options?: GetResourcesHandlerOptions): Handler;
  export function missingKeyHandler(i18next: I18next, options?: MissingKeyHandlerOptions): Handler;
  export function addRoute(i18next: I18next, route: string, lngs: string[], app: App, verb: string, fc: Handler): void;
  export function addRoute(i18next: I18next, route: string, lngs: string[], app: App, fc: Handler): void;

  // LanguageDetector
  type LanguageDetectorServices = any;
  type LanguageDetectorOrder = string[];
  type LanguageDetectorCaches = boolean | string[];
  interface LanguageDetectorOptions {
    order?: LanguageDetectorOrder;
    lookupQuerystring?: string;
    lookupCookie?: string;
    lookupSession?: string;
    lookupFromPathIndex?: number;
    caches?: LanguageDetectorCaches;
    cookieExpirationDate?: Date;
    cookieDomain?: string;
  }
  interface LanguageDetectorAllOptions {
    fallbackLng: boolean | string | string[];
  }
  interface LanguageDetectorInterfaceOptions {
    [name: string]: any;
  }
  interface LanguageDetectorInterface {
    name: string;
    lookup: (req: Request, res: Response, options?: LanguageDetectorInterfaceOptions) => string | string[];

    cacheUserLanguage?: (req: Request, res: Response, lng: string, options?: object) => void;
  }

  export class LanguageDetector implements i18next.Module {
    type: "languageDetector";

    constructor(services: LanguageDetectorServices, options?: LanguageDetectorOptions, allOptions?: LanguageDetectorAllOptions);
    constructor(options?: LanguageDetectorOptions, allOptions?: LanguageDetectorAllOptions);

    init(services: LanguageDetectorServices, options?: LanguageDetectorOptions, allOptions?: LanguageDetectorAllOptions): void;
    init(options?: LanguageDetectorOptions, allOptions?: LanguageDetectorAllOptions): void;
    addDetector(detector: LanguageDetectorInterface): void;
    detect(req: Request, res: Response, detectionOrder: LanguageDetectorOrder): void;
    cacheUserLanguage(req: Request, res: Response, lng: string, caches: LanguageDetectorCaches): void;
  }
}

export = i18nextHttpMiddleware;
