/**
 *
 */
import { AutoUnsubscribe } from '../src/auto.unsubscribe';
import { Component } from '@angular/core';
import {
  TestBed
} from '@angular/core/testing';

let x = 0;
class ShouldBeUnsubscribed {
  public unsubscribe() {
    x = x + 1;
  }
}

class ShouldBePreserved {
  public subscribe() {
    x = x + 1;
  }
}

class ShouldNotBeUnsubscribed {
  public nounsubscribe() {
    x = x + 1;
  }
}

@AutoUnsubscribe()
@Component({
  template: ''
})
class MyComponent {
  public t: ShouldBeUnsubscribed = new ShouldBeUnsubscribed();
  public y: ShouldNotBeUnsubscribed = new ShouldNotBeUnsubscribed();
  public ngOnDestroy() {
    x = x + 1;
  }
}

@AutoUnsubscribe(['z'])
@Component({
  template: ''
})
class MyComponent2 {
  public z: ShouldBePreserved = new ShouldBePreserved();
  public ngOnDestroy() {
    x = x + 1;
  }
}

describe('AutoUnsubscribe Spec', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyComponent, MyComponent2]
    });
  });
  it('Sould auto unsubsribre properties of the component', () => {
    TestBed.createComponent(MyComponent).destroy();
    expect(x).toEqual(2);
  });
  it('Sould not unsubscribe properties of the component', () => {
    TestBed.createComponent(MyComponent2).destroy();
    expect(x).toEqual(3);
  });
});
