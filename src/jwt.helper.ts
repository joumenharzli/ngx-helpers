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

  /**
   * Extract the token from the localStorage
   *
   * @returns {string} the available token
   * @memberof JWTHelper
   */
  public extractToken(): string {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token === null) {
      throw new Error('No token available');
    }
    return token;
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
   *
   * @returns {any} the payload
   * @memberof JWTHelper
   */
  public getPayloadContent(): any {
    const splittedToken = this.splitToken();
    const encodedPayload = splittedToken[1];
    const decodedPayload = atob(encodedPayload);
    try {
      return JSON.parse(decodedPayload);
    } catch (e) {
      throw new Error('Invalid token payload');
    }
  }

  /**
   * Get the date of the expiration of the token
   *
   * @returns {Date} expiration date
   * @memberof JWTHelper
   */
  public getTokenExpirationDate(): Date {
    const payload = this.getPayloadContent();
    if (payload.hasOwnProperty(this.EXPIRATION_PROPERTY)) {
      const date = new Date(0);
      date.setUTCSeconds(payload[this.EXPIRATION_PROPERTY]);
      return date;
    } else {
      throw new Error('no expiration information available');
    }
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
}
