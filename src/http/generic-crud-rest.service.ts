import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import {
  PaginationArgs, PaginationSortArgs,
  PaginationPage, paginationSortOrderTypeToString
} from './pagination.args';

/**
 * This class provides CRUD methods
 * for a http service
 *
 * @export
 * @class GenericCRUDRestService
 * @template T type of entity
 * @template G type of the id of the entity
 * @author Joumen HARZLI
 */
export class GenericCRUDRestService<T, G> {
  protected apiUrl: string = '';
  protected idProperty: string;
  protected http: Http;

  constructor(http: Http, apiUrl: string, idProperty?: string) {
    this.http = http;
    this.apiUrl = apiUrl;
    this.idProperty = idProperty ? idProperty : 'id';
  }

  public add(entity: T): Observable<T> {
    return this.http.post(this.apiUrl, entity).map((response: Response) => response.json());
  }

  public update(entity: T): Observable<T> {
    return this.http.put(this.apiUrl, entity).map((response: Response) => response.json());
  }

  public remove(id: G): Observable<T> {
    return this.http.delete(this.apiUrl + '/' + id).map((response: Response) => response.json());
  }

  public getOneById(id: G): Observable<T> {
    return this.http.get(this.apiUrl + '/' + id).map((response: Response) => response.json());
  }

  public getAll(): Observable<T[]> {
    return this.http.get(this.apiUrl).map((response: Response) => response.json());
  }

  public getAllWithPagination(paginationArgs: PaginationArgs): Observable<PaginationPage<T>> {
    const params = new URLSearchParams();
    params.set('size', `${paginationArgs.pageSize}`);
    params.set('page', `${paginationArgs.pageNumber}`);
    if (paginationArgs.sorts !== null) {
      if (paginationArgs.sorts.length > 0) {
        paginationArgs.sorts.forEach((sort: PaginationSortArgs) =>
          params.set('sort', `${sort.property},${paginationSortOrderTypeToString(sort.direction)}`)
        );
      }
    }
    return this.http.get(this.apiUrl, { search: params })
      .map((response: Response) => response.json());
  }
}
