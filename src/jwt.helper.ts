/**
 * This class provides operations for JWT token manipulation
 *
 * @export
 * @class JWTHelper
 * @author Joumen HARZLI
 */
export class JWTHelper {

  private TOKEN_KEY: string = 'id_token';
  private EXPIRATION_PROPERTY: string = 'exp';
  private cachedPayload: Object = {};
  private cachedToken: string = '';

  /**
   * Load Payload In Memory
   */
  constructor() {
    this.getPayloadContent();
  }

  /**
   * Extract the token from the localStorage
   *
   * @returns {string} the available token
   * @memberof JWTHelper
   */
  public extractToken(): string {
    if (this.cachedToken.length > 0) {
      return this.cachedToken;
    }
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token === null) {
      throw new Error('No token available');
    }
    this.cachedToken = token;
    return this.cachedToken;
  }

  /**
   * Get the three parts of the token
   *
   * @returns {string[]} parts of the token
   * @memberof JWTHelper
   */
  public splitToken(): string[] {
    const encodedToken = this.extractToken();
    const splittedToken = encodedToken.split('.');
    if (!(splittedToken.length === 3)) {
      throw new Error('Invalid token');
    }
    return splittedToken;
  }

  /**
   * Get the content of the payload
   * Cache the parsed content in the memory to retrive it
   * the next time
   *
   * @returns {any} the payload
   * @memberof JWTHelper
   */
  public getPayloadContent(): any {
    if (Object.keys(this.cachedPayload).length > 0) {
      return this.cachedPayload;
    }
    const splittedToken = this.splitToken();
    const encodedPayload = splittedToken[1];
    const decodedPayload = atob(encodedPayload);
    try {
      this.cachedPayload = JSON.parse(decodedPayload);
      return this.cachedPayload;
    } catch (e) {
      throw new Error('Invalid token payload');
    }
  }

  /**
   * Access a property in the payload
   *
   * @param {string} item to load
   * @returns {*} content of the item
   * @memberof JWTHelper
   */
  public getPayloadItem(item: string): any {
    const payload = this.getPayloadContent();
    if (payload.hasOwnProperty(item)) {
      return payload[item];
    } else {
      throw new Error(`No property named '${item}' found in the payload`);
    }
  }

  /**
   * Get the date of the expiration of the token
   *
   * @returns {Date} expiration date
   * @memberof JWTHelper
   */
  public getTokenExpirationDate(): Date {
    const expiration = this.getPayloadItem(this.EXPIRATION_PROPERTY);
    const date = new Date(0);
    date.setUTCSeconds(expiration);
    return date;
  }

  /**
   * Detect if the token is expired
   *
   * @returns {boolean} true if token is expired
   * @memberof JWTHelper
   */
  public isTokenExpired(): boolean {
    return (new Date().valueOf() > this.getTokenExpirationDate().valueOf());
  }

  /**
   * Remove token
   *
   * @memberof JWTHelper
   */
  public clearToken(): void {
    this.cachedPayload = {};
    this.cachedToken = '';
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
