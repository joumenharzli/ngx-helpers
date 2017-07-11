/**
 * This decorator auto unsubscribe your component
 * to release the allocated memory and prevent memory leaks.
 * It will loops over the properties of the component and executes
 * the funtion `unsubscribe` if the property have it
 *
 * ### Example
 *
 * ```typescript
 * import { Subscription } from 'rxjs/Subscription';
 *
 * @AutoUnsubscribe()
 * @Component({
 *   selector: 'my-component',
 *   template: '<div></div>'
 * })
 * class PeopleComponent {
 *  s: Subscription;
 *  getPeoples(){
 *   this.s = this.peopleService.subscribe( (data) => console.log(data) );
 *  }
 * }
 *
 *
 * ```
 * @export
 * @param {string[]} [exceptions=[]] names of subscriptions to exclude
 * @returns {Function}
 * @author Joumen HARZLI
 */
export function AutoUnsubscribe(exceptions: string[] = []): Function {
  /* tslint:disable:no-invalid-this no-unused-expression no-duplicate-parameter-names
  no-reserved-keywords */
  return (constructor: Function) => {
    /**
     * We should save the original implementation of ngOnDestroy
     */
    const original = constructor.prototype.ngOnDestroy;
    /**
     * Change the original implementation of ngOnDestroy
     */
    constructor.prototype.ngOnDestroy = function () {
      /**
       * Loop for every property in the component
       */
      Object.keys(this).map((key) => {
        /**
         * The property should not be blacklisted
         */
        if (exceptions.indexOf(key) === -1) {
          /**
           * if the property have the function unsubscribe it will be executed
           */
          const property = this[key];
          if (property && (typeof property.unsubscribe === 'function')) {
            property.unsubscribe();
          }
        }
      });
      /**
       * Execute the old ngOnDestroy if it's implemented
       */
      original && typeof original === 'function' && original.apply(this, arguments);
    };
  };
}
