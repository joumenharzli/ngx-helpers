export default {
  entry: './compiled/index.js',
  dest: './release/ngx-helpers.umd.js',
  format: 'umd',
  moduleName: 'ngx.helpers',
  globals: {
    '@angular/core': 'ng.core',
    '@ngrx/store': 'ngrx.store',
    'rxjs/Observable': 'Rx',
    'rxjs/Subscription': 'Rx',
    'rxjs/operator/filter': 'Rx.Observable.prototype',
    'rxjs/operator/ignoreElements': 'Rx.Observable.prototype',
    'rxjs/observable/merge': 'Rx.Observable'
  }
}
