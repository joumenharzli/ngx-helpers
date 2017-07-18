import {
  Http, RequestOptions, Response, Request,
  ConnectionBackend, RequestOptionsArgs, Headers, XHRBackend, BaseRequestOptions
} from '@angular/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { JWTHelper } from '../jwt.helper';

/**
 * Performs http requests using `XMLHttpRequest`
 * This class provides an Http instance that
 * catches errors and add tokens to headers
 *
 * @export
 * @class AuthorizedHttp
 * @extends {Http}
 * @author Joumen HARZLI
 */
export class AuthorizedHttp extends Http {

  private router: Router;
  private jwtHelper: JWTHelper;

  /* tslint:disable:no-reserved-keywords */
  constructor(
    private backend: ConnectionBackend,
    private defaultOptions: RequestOptions,
    private injector: Injector) {
    super(backend, defaultOptions);
    this.jwtHelper = new JWTHelper();
  }

  /**
   * Performs any type of http request. First argument is required, and can either be a url or
   * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
   * object can be provided as the 2nd argument. The options object will be merged with the values
   * of {@link BaseRequestOptions} before performing the request.
   */
  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.request(url, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `get` http method.
   */
  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.get(url, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `post` http method.
   */
  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.post(url, body, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `put` http method.
   */
  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.put(url, body, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `delete` http method.
   */
  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.delete(url, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `patch` http method.
   */
  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.patch(url, body, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `head` http method.
   */
  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.head(url, this.customizeHeaders(options)));
  }

  /**
   * Performs a request with `options` http method.
   */
  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.handleError(super.options(url, this.customizeHeaders(options)));
  }

  /**
   * Add authorization and content type if not setted
   *
   * @protected
   * @param {RequestOptionsArgs} [options] options to edit
   * @returns {RequestOptionsArgs} customized options
   * @memberof AuthorizedHttp
   */
  protected customizeHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers({
        'Content-Type': 'application/json'
      });
    }
    const token = this.jwtHelper.extractToken();
    if (token) {
      options.headers.append('Authorization', `Bearer ${token}`);
    }
    return options;
  }

  /**
   * catch errors thrown by http and redirect to login when unauthorized
   *
   * @protected
   * @param {Observable<Response>} observable observable of the request
   * @returns {(Observable<String | { down: boolean }>)} error message or down = true
   * @memberof AuthorizedHttp
   */
  protected handleError(observable: Observable<Response>):
    Observable<Response> {
    return observable.catch((error: Response, source: Observable<Response>) => {
      /**
       * User is unauthorized
       */
      if (error.status === 401) {
        /**
         * Tokens are no more valid
         */
        this.jwtHelper.clearToken();
        /**
         * Get a router instances
         */
        if (this.router === null) {
          this.router = this.injector.get(Router);
        }
        /**
         * Navigate to login page
         */
        this.router.navigate(['login']);
      }
      try {
        /**
         * the api throwed an error
         */
        const errorContent: Object = error.json();
        return Observable.throw(errorContent);
      } catch (e) {
        /**
         * server is down
         */
        return Observable.throw({ down: true });
      }
    });
  }
}

/**
 * A Provider to add in @NgModule
 */
export const AUTHORIZED_HTTP_PROVIDER: Object = {
  provide: Http,
  useFactory: (backend: XHRBackend,
    options: BaseRequestOptions,
    injector: Injector) => {
    return new AuthorizedHttp(backend, options, injector);
  },
  deps: [XHRBackend, BaseRequestOptions, Injector]
};

/**
 * Provider to add for Testing
 */
export const AUTHORIZED_HTTP_PROVIDER_TEST: Object = {
  provide: Http,
  useFactory: (backend: MockBackend,
    options: BaseRequestOptions,
    injector: Injector) => {
    return new AuthorizedHttp(backend, options, injector);
  },
  deps: [MockBackend, BaseRequestOptions, Injector]
};
