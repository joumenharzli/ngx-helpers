/**
 * AuthorizedHttp Tests
 */
import { Injectable, Injector, ReflectiveInjector } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TestBed, getTestBed, inject, async, fakeAsync, tick
} from '@angular/core/testing';
import {
  Http, RequestOptions,
  Headers, BaseRequestOptions, Response,
  HttpModule, XHRBackend,
  RequestMethod, ResponseOptions,
  ConnectionBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { GenericCRUDRestService, AuthorizedHttp, AUTHORIZED_HTTP_PROVIDER_TEST } from '../src/http';

@Injectable()
class TestService extends GenericCRUDRestService<any, string> {
  constructor(http: Http) {
    super(http, '/test', 'id');
  }
  public testMe() {
    return this.http.delete('/test/123');
  }
}

describe('Authorized Service & GenericCrud Spec', () => {
  const obj = { success: true };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        TestService,
        MockBackend,
        BaseRequestOptions,
        AUTHORIZED_HTTP_PROVIDER_TEST
      ]
    });
    const token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      + '.eyJuYW1lIjoiSm91bWVuIEhhcnpsaSIsImV4cCI6NzYzMzQwNDAwfQ'
      + '.Nv4vJN1Ye8JKeizWPUG3Hj8o2R6KtekJiVdpqQ--uiU';
    localStorage.setItem('id_token', token);
  });

  it('should subscribe to add', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify(obj),
              status: 200
            }
            )));
        });
      testService.add({}).subscribe((res: any) => {
        expect(res.success).toBeTruthy();
      });
      tick();
    })));

  it('should subscribe to update', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify(obj),
              status: 200
            }
            )));
        });
      testService.update({}).subscribe((res: any) => {
        expect(res.success).toBeTruthy();
      });
      tick();
    })));

  it('should subscribe to remove', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify(obj),
              status: 200
            }
            )));
        });
      testService.remove('id').subscribe((res: any) => {
        expect(res.success).toBeTruthy();
      });
      tick();
    })));

  it('should subscribe to getAll', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify(obj),
              status: 200
            }
            )));
        });
      testService.getAll().subscribe((res: any) => {
        expect(res.success).toBeTruthy();
      });
      tick();
    })));

  it('should subscribe to getOneById', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: JSON.stringify(obj),
              status: 200
            }
            )));
        });
      testService.getOneById('aaa').subscribe((res: any) => {
        expect(res.success).toBeTruthy();
      });
      tick();
    })));

  it('should show error when server is down', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockError(new Error());
        });
      testService.getAll().subscribe(
        (res: any) => true,
        (err) => {
          expect(err).toBeDefined();
          expect(err.down).toBeTruthy();
        });
      tick();
    })));

  it('should send the authorisation for custom methodes', inject([MockBackend, TestService],
    fakeAsync((mockBackend: MockBackend, testService: TestService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          expect(connection.request.headers.get('Authorization')).
            toEqual('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
            + 'eyJuYW1lIjoiSm91bWVuIEhhcnpsaSIsImV4cCI6NzYzMzQwNDAwfQ' +
            '.Nv4vJN1Ye8JKeizWPUG3Hj8o2R6KtekJiVdpqQ--uiU');
        });
      testService.testMe().subscribe(
        (res: any) => true);
      tick();
    })));
});
