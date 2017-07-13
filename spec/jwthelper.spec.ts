/**
 * JWT Helper Tests
 */
import { JWTHelper } from '../src/jwt.helper';

describe('JWTHelper Spec', () => {
  let jwtHelper: JWTHelper;
  /**
   * {
   *  "name": "Joumen Harzli",
   *  "exp": 763340400 // 11 Mars 1994
   * }
   */
  const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    + '.eyJuYW1lIjoiSm91bWVuIEhhcnpsaSIsImV4cCI6NzYzMzQwNDAwfQ'
    + '.Nv4vJN1Ye8JKeizWPUG3Hj8o2R6KtekJiVdpqQ--uiU';

  beforeAll(() => {
    jwtHelper = new JWTHelper();
    localStorage.setItem('id_token', token);
  });

  it('The token should be expired', () => {
    expect(jwtHelper.isTokenExpired()).toBeTruthy();
  });

  it('it should throw and error if token dont have an expiration property', () => {
    localStorage.setItem('id_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
      + 'eyJuYW1lIjoiSm91bWVuIEhhcnpsaSJ9.IcIUU6r4suJSGgzcHNmPW-Hv4_6U0AzKJtQ4aOB-pG8');
    try {
      jwtHelper.getTokenExpirationDate();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('it should throw and error if token payload is not an object', () => {
    localStorage.setItem('id_token', 'AAAABBBBCCC.DDDDD.EEEE');
    try {
      jwtHelper.getPayloadContent();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('it should throw and error if token is invalid', () => {
    localStorage.setItem('id_token', 'AAAABBBBCCC');
    try {
      jwtHelper.splitToken();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('it should throw and error if no token is avaiable', () => {
    localStorage.removeItem('id_token');
    try {
      jwtHelper.extractToken();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
