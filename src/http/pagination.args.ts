/* tslint:disable:max-line-length no-reserved-keywords*/

/**
 * Argument to specify for pagination
 *
 * @export
 * @interface PaginationArgs
 * @author Joumen HARZLI
 * @see http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Pageable.html
 */
export interface PaginationArgs {
  pageNumber?: number;
  pageSize?: number;
  sorts?: PaginationSortArgs[];
}

/**
 * Property to sort with and her order
 *
 * @export
 * @interface PaginationSortArgs
 * @author Joumen HARZLI
 * @see http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Sort.html
 */
export interface PaginationSortArgs {
  property: string;
  direction: PaginationSortOrderType;
}

/**
 * The sort order of the pagination
 *
 * @export
 * @enum
 * @author Joumen HARZLI
 * @see http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Sort.Direction.html
 */
export enum PaginationSortOrderType {
  ASC,
  DESC
}

/**
 * Convert Order Type to String
 *
 * @param sortType type of sort
 * @return a string value of type
 * @author Joumen HARZLI
 */
export function paginationSortOrderTypeToString(sortType: PaginationSortOrderType): string {
  return (sortType === PaginationSortOrderType.ASC) ? 'ASC' : 'DESC';
}

/**
 * Paginated page format
 *
 * @export
 * @interface PaginationPage
 * @template T type of the entity in the page
 * @author Joumen HARZLI
 * @see https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Page.html
 */
export interface PaginationPage<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  sort?: PaginationSortArgs[];
}
