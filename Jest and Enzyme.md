# React testing using Jest and Enzyme

## Jest

Jest — a testing framework maintained by **Facebook** — to test our ReactJS components.

**Test-driven development**, where developers are expected to write the tests first, before writing 
the code to fix the test. The idea behind this is that, by writing the test first, you have to think 
about the API that you’re writing, and it can lead to a better design.

The only resemblance of Jest compared to the initial open-source release is the name and the logo. 
Everything else has been changed and rewritten.

- It automatically runs tests in parallel, and its watch mode is able to run only tests relevant 
to the changed file, which is invaluable when you have a large suite of tests.

- It comes with JSDom configured, meaning you can write browser tests but run them through Node, 
can deal with asynchronous tests and has advanced features such as mocking, spies and stubs built in.

Jest expects to find our tests in a `__tests__` folder, which has become a popular convention in 
the JavaScript community. 

If you’re not a fan of the `__tests__` setup, out of the box Jest also supports finding any 
`.test.js` and `.spec.js` files too.

For example-

```javascript
const startState = {
  todos: [{ id: 1, done: false, name: 'Buy Milk' }]
};

const finState = toggleDone(startState, 1);

expect(finState.todos).toEqual([
  { id: 1, done: true, name: 'Buy Milk' }
]);
```
> You should use `toBe` on **primitive values**, such as _strings and numbers_, but `toEqual` on **objects and arrays**. `toEqual` is built to deal with arrays and objects, and will **recursively check** each field or item within the object given to ensure that it matches.

> Don't write too many tests on your React component. Anything that you want to test very thoroughly, such as business logic, should be pulled out of your components and sit in standalone functions, just like the state functions that we tested above.

> It is useful at times to test some React interactions (making sure a **specific function is called** with the **right arguments** when the user clicks a button, for example).

<br>

### Rerunning Tests on Changes

To run it in **watch mode**, you can run `npm test -- --watch`. Anything you pass to npm test after the first `--` will be passed straight through to the underlying command. This means that these two commands are effectively equivalent:

```bash
npm test -- --watch
jest --watch
```

<br>

## Enzyme

It is a **wrapper library** written by **AirBnB** that makes testing React components much easier.

`Enzyme` is a fantastic library, and the React team even recommend it as the way to test React 
components.

Enzyme is a JavaScript Testing utility for React that makes it easier to assert, manipulate, and 
traverse your React Components' output.

Enzyme's API is meant to be intuitive and flexible by **mimicking jQuery's API** for DOM manipulation 
and traversal.

We’ll need to make use of `react-addons-test-utils`, a library that provides functions for testing 
React.

```bash
npm install --save-dev react-addons-test-utils enzyme
```

We also import `mount` from Enzyme. The `mount` function is used to **render our component** and 
then allow us to inspect the output and make assertions on it. 

Even though we’re running our tests in **Node**, we can still write tests that require a DOM. 
This is because `Jest` configures **jsdom**, a library that implements the **DOM in Node**. 
This is great because we can write DOM based tests without having to fire up a browser each time 
to test them.

We can use `mount` to create our **Todo**:

```javascript
const todo = { id: 1, done: false, name: 'Buy Milk' };
const wrapper = mount(
  <Todo todo={todo} />
);
```

And then we can call `wrapper.find`, giving it a **CSS selector**, to find the paragraph that we’re expecting to contain the text of the Todo.

```javascript
const p = wrapper.find('.toggle-todo');
```

And finally, we can assert that the text within it is **Buy Milk**:

```javascript
expect(p.text()).toBe('Buy Milk');
```

### Code Snippet:

```javascript
import Todo from '../app/todo';
import React from 'react';
import { mount } from 'enzyme';

test('TodoComponent renders the text inside it', () => {
  const todo = { id: 1, done: false, name: 'Buy Milk' };
  const wrapper = mount(
    <Todo todo={todo} />
  );
  const p = wrapper.find('.toggle-todo');
  expect(p.text()).toBe('Buy Milk');
});
```

> `Mounting` requires Enzyme to render the **full DOM**, while `shallow` rendering requires only the 
component to be rendered.

We can check that when the user clicks an element, the associated function is called and also 
called with the _correct arguments_. Thankfully, Jest provides this out of the box with **spies**.

A spy is a function whose implementation you don’t care about, you just care about when and how 
it’s called. Think of it as you spying on the function. To create one, we call `jest.fn()`.

```javascript
test('TodoComponent calls doneChange when todo is clicked', () => {
  const todo = { id: 1, done: false, name: 'Buy Milk' };
  const doneChange = jest.fn();
  const wrapper = mount(
    <Todo todo={todo} doneChange={doneChange} />
  );

  const p = wrapper.find('.toggle-todo');
  p.simulate('click');
  expect(doneChange).toBeCalledWith(1);
});
```

Full DOM rendering is ideal for use cases where you have components that may interact with **DOM APIs**, or may require the **full lifecycle** in order to fully test the component (i.e., componentDidMount etc.)

> `mount` depends on a library called **jsdom** which is essentially a **headless browser** implemented completely in JS.

> Unlike shallow or static rendering, full rendering actually mounts the component in the DOM, which means that tests can affect each other if they are all using the **same DOM**. Keep that in mind while writing your tests and, if necessary, use `.unmount()` or something similar as cleanup.

<br>

### Shallow Rendering

Shallow rendering renders only **component itself without its children**. So if you change something in a child component it won’t change shallow output of your component. Or a bug, introduced to a child component, won’t break your component’s test. 

It also **doesn’t require DOM**.

For example this component:

```javascript
const ButtonWithIcon = ({icon, children}) => (
    <button><Icon icon={icon} />{children}</button>
);
```

Will be rendered by React like this:

```html
<button>
    <i class="icon icon_coffee"></i>
    Hello Jest!
</button>
```

But like this with shallow rendering:

```html
<button>
    <Icon icon="coffee" />
    Hello Jest!
</button>
```

> Note that the Icon component was not rendered.

<br>

## Better Component Testing with Snapshots

Rather than make a **large amount of assertions** on React components, Jest lets you run snapshot tests. These are **not** so useful for **interactions** (in which case I still prefer a test like we just wrote above), but for testing that the output of your component is correct, they’re much easier.

When you run a snapshot test, Jest **renders** the React component under test and stores the result in a **JSON file**. Every time the test runs, Jest will check that the React component still renders the same output as the snapshot.

> You should pick components with some functionality that you really need to ensure is working. Snapshotting all your components will just lead to slow tests that aren’t useful.

To get started with snapshot testing, we need one more Node package. `react-test-renderer` is a package that’s able to take a React component and render it as a **pure JavaScript object**. This means it can then be **saved to a file**, and this is what Jest uses to keep track of our snapshots.

```bash
npm install --save-dev react-test-renderer
```

The first thing you need to do is import the `react-test-renderer`, and also remove the import for `mount`. They can’t both be used; you either have to use one or the other. 

```javascript
describe('Todo component renders the todo correctly', () => {
  it('renders correctly', () => {
    const todo = { id: 1, done: false, name: 'Buy Milk' };
    const rendered = renderer.create(
      <Todo todo={todo} />
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });
});
```

The **first time** you run this, Jest is clever enough to realize that there’s **no snapshot** for this component, so it creates it. Let’s take a look at **__tests__/__snapshots__/todo.test.js.snap**:

```jsx
exports[`Todo component renders the todo correctly renders correctly 1`] = `
<div
  className="todo  todo-1">
  <p
    className="toggle-todo"
    onClick={[Function]}>
    Buy Milk
  </p>
  <a
    className="delete-todo"
    href="#"
    onClick={[Function]}>
    Delete
  </a>
</div>
`;
```

>  Once the test fails, Jest will tell us that the current changes do not match the saved snapshot. If we think this change is correct, we can run jest with the `-u flag`, which will **update the snapshot**.

> We can’t actually test our Todo component **interactions** through Jest snapshots, because they don’t control their own state but call the callback props they are given. What we should do is to move the snapshot test into a new file, `todo.snapshot.test.js`, and leave our toggling test in `todo.test.js`. I’ve found it useful to separate the snapshot tests into a different file; it also means that you don’t get conflicts between `react-test-renderer` and `react-addons-test-utils`.

> `enzyme-to-json` library can also be used to convert **Enzyme wrappers** for **Jest snapshot matcher**.

<br>

## Setting up

First install all the dependencies including peer dependencies:

```bash
npm install --save-dev jest react-test-renderer enzyme enzyme-adapter-react-16 enzyme-to-json
```

You’ll also need `babel-jest` for Babel and `ts-jest` for TypeScript.

### Update your package.json:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
},
"jest": {
  "setupFiles": ["./test/jestsetup.js"],
  "snapshotSerializers": ["enzyme-to-json/serializer"]
}
```

`snapshotSerializers` allows you to pass Enzyme wrappers directly to Jest’s snapshot matcher, without converting them manually by calling enzyme-to-json’s `toJson` function.

<br>

### Testing props

```javascript
test('render a document title', () => {
  const wrapper = shallow(
    <DocumentTitle title="Events" />
  );
  expect(wrapper.prop('title')).toEqual('Events');
});
```

<br>

### Testing event handlers

```javascript
test('pass a selected value to the onChange handler', () => {
    const value = '2';
    const onChange = jest.fn();
    const wrapper = shallow(
      <Select items={ITEMS} onChange={onChange} />
    );

    expect(wrapper).toMatchSnapshot();

    wrapper.find('select').simulate('change', {
      target: { value },
    });

    expect(onChange).toBeCalledWith(value);
});
```

```javascript
// within the Login components describe function
describe('Email input', () => {
  
  it('should respond to change event and change the state of the Login Component', () => {
   
    const wrapper = shallow(<Login />);
    wrapper.find('#email').simulate('change', {target: {name: 'email', value: 'blah@gmail.com'}});
    
    expect(wrapper.state('email')).toEqual('blah@gmail.com');
  });
  
 });
```

<br>

### Debugging and troubleshooting

Use Enzyme’s `debug` method to print shallow **renderer’s output**:

```javascript
console.log(wrapper.debug());
```

<br>

## Faking method calls using spies, stubs and mocks

### Spies

Spies sound like what they do – they **watch your functions** and report back on how they are called.

They don’t change the functionality of your application. They **simply report what they see**.

```javascript
describe("#fight", function () {
  it("calls prayForStrength for fight success", function () {
    sinon.spy(subject.strengthDep, "prayForStrength");
    subject.fight();
    subject.strengthDep.called.should.be.true;
    subject.strengthDep.restore();
  });
});
```

Finally, we call `restore` on the function we spied on so that all spies are called off.

### Stubs

With a stub, you will actually change **how functions are called** in your test, and let us **define their functionality** as well as **return value**.

```javascript
describe("#fight", function () {
  it("always wins when prayForStrength is true", function () {
    sinon.stub(subject.strengthDep, "prayForStrength", function () { return true; });
    subject.fight().should.be.true;
    subject.strengthDep.restore();
  });
});
```

### Mocks 

Mocks take the attributes of spies and stubs, smashes them together and changes the style a bit. A mock will both **observe the calling** of functions and **verify** that they were **called in some specific way**.

```javascript
describe("#fight", function () {
  it("always wins when prayForStrength is true", function () {
    var mock = sinon.mock(subject.strengthDep)
    mock.expects("prayForStrength").returns(true);
    subject.fight().should.be.true;
    mock.verify();
    mock.restore();
  });
});
```
The `expects` and `returns` line is where the combo magic happens. `expects` is verifying a call (like spies can), and `returns` is specifying functionality (like stubs can). The `verify` call is the line that will fail (essentially the mock assertion) if things in the subject didn’t go exactly according to plan.

<br>

## Tesing React components connected to a Redux store

### 1. Testing component with mock store

We can explicitly create a store and pass it to our connected Login component, or we can wrap the Login component in a Redux Provider that holds the store. I would suggest using the first approach, because then there is no need to mount our component and we can instead shallow render it.

One way that we can integrate the store is by using `redux-mock-store` to create it.

```bash
npm install redux-mock-store --save-dev
```

This will allow us to create a store to pass to our connected component. This is how we could create a mock store:

```javascript
import configureStore from 'redux-mock-store';

// create any initial state needed
const initialState = {}; 

const mockStore = configureStore();

//creates the store with any initial state or middleware needed  
store = mockStore(initialState);

```

And the two ways of passing it to our component are like this,

```javascript
wrapper = shallow(<Login store={store}/>);
                OR
// not suggested
wrapper = mount(<Provider store={store}><Login /></Provider>)
```

If you look at the Redux Mock Store docs, the reason the library was created was to test action 
creators and middleware. Already this seems like a red flag when we are using the library in a 
way it wasn’t originally designed for.

With this mock store, we can test our actions that are sent to our store through action creators, 
and see if they match the expected actions. This is more of an integration test, and testing the 
whole flow of our component. It is more complex and unnecessary, than if you test all parts of the 
application separately.

### 2. Testing component without Redux store

If we test the component when it is not connected to the Redux store, we do not have to worry about 
the extra work of creating a mock store. Instead we just test the functionality of our component, 
and see if it behaves how we expect. To do this we can simply **export our unconnected component**, as well as our **default export of the connected component**.

Now when we import the component into our test we have to write it like this,

```javascript
import { Login } from '../Login';
```

This imports the unconnected component rather than the default connected component.

Because we do not have a store, our `mapDispatchToProps` function for logging in is not supplied to our component. We can easily fix this by creating a mock function with Jest. This function will hold the place of our action creator, and we will be able to test whether it gets called.

```javascript
describe('Login Component', () => {
  let wrapper;
  // our mock login function to replace the one provided by mapDispatchToProps
  const mockLoginfn = jest.fn();
 
  beforeEach(() => {
    // pass the mock function as the login prop 
    wrapper = shallow(<Login login={mockLoginfn}/>);
  });

  it('should call the mock login function', () => {
    wrapper.find('#loginForm').simulate(
      'submit', 
      {preventDefault() {}}
    );
   expect(mockLoginfn.mock.calls.length).toBe(1);
  });

  it('should be called with the email and password in the state as arguments', () => {

    // fill in email field with blah@gmail.com     
    wrapper.find('#email').simulate(
      'change', 
      {target: 
        {name: 'email', value: 'blah@gmail.com'}
      }
    );

    // fill in password field with cats  
    wrapper.find('#password').simulate(
      'change', 
      {target: 
          {name: 'password', value: 'cats'}
      }
    );

    // simulate form submission   
    wrapper.find('#loginForm').simulate(
      'submit', 
      {preventDefault() {}}
    );

    // test to see arguments used after its been submitted 
    expect(mockLoginfn.mock.calls[1][0]).toEqual(
      {email: 'blah@gmail.com', password: 'cats'}
    );

  });
});
```

> Calls[1] gives us an array of the arguments passed in. We only used one object, so we test the first index in the array.

> When we simulate the submission of our form, we need to pass the `preventDefault` function in our event object or we will get an error.

### Hybrid Approach for testing connected components having a dependency on lifecycle methods

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';
import i18n from '../test/i18Tests';
import DashboardComponentRedux, { DashboardComponent } from './dashboard';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);           // add middlewares here
const store = mockStore({ auth: { user: { email: 'admin@gmail.com', role: 'admin' }, isLoggedIn: true } });

describe('Dashboard Component Test Suite', () => {

  let wrapper;
  let logoutStub;

  beforeAll(() => {

    sinon.stub(DashboardComponent.prototype, 'componentWillMount').returns(true);

    logoutStub = sinon.stub(DashboardComponent.prototype, 'onLogout').returns(true);
    // or stub(obj, 'meth').callsFake(fn)

    wrapper = mount(
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <DashboardComponentRedux />
            </I18nextProvider>
        </Provider>
    );

    // console.log(wrapper.debug());

  });

  it('Dashboard component renders correctly', () => {

    const headingTag = wrapper.find('h1');
    expect(headingTag.text()).toBe('Dashboard Component');

  });

  it('Role of the logged in user is "admin"', () => {

    // console.log(wrapper.instance().store.getState().auth.user.role);
    expect(wrapper.instance().store.getState().auth.user.role).toBe('admin');

  });

  it('onLogout() called when Logout button is clicked', () => {

    const logoutBtn = wrapper.find('.logoutBtn');
    logoutBtn.simulate('click');

    expect(logoutStub.calledOnce).toBe(true);

  });
});
```

<br>

## Testing Asynchronous Code

```javascript
test(`using async/await`, async () => {
  const responseJson = await fetchResponseJson(`http://foo.bar`);
  expect(responseJson).toHaveProperty(`Rick`, `I turned myself into a pickle, Morty!`);
});

test(`on a React component that loads data into state in componentDidMount`, async () => {
  const wrapper = shallow(<SimpleComponent />);

  await wrapper.instance().componentDidMount();
  // Much less robust, you need to ensure that the sleeping time is greater than the time it takes to resolve the fetch

  // State can be tested here, but not DOM properties, because setState happens in... the future!
  expect(wrapper.state(`data`)).toHaveProperty(`Rick`, `I turned myself into a pickle, Morty!`);
  expect(wrapper.text()).not.toEqual(JSON.stringify({Rick: `I turned myself into a pickle, Morty!`}));

  // Force update to sync component with state
  wrapper.update();
  expect(wrapper.text()).toBe(`{"Rick":"I turned myself into a pickle, Morty!"}`);
});
```

<br>

## Testing method calls on component classes by making spies

```javascript
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Button from '../Button';
describe('Button component', () => {
  it('should call handleClick() when clicked', () => {
    const spy = sinon.spy(Button.prototype, 'handleClick');
    const wrapper = shallow(<Button />);
    wrapper.find('div').simulate('click')     ; 
    expect(spy.calledOnce).to.equal(true);
  });
});
```

<br>

## Mocking a component

When we test the `Library` component we don’t want to also test the `Book` component and its functionality, we can leave that for another test. All we want to do is test that Library contains a Book.

To do this we can use **Rewire**, a Babel plugin that allows you to mock components. After installing Rewire via npm you can add the plugin to your `.babelrc` file like so…

```javascript
...
"plugins": ["rewire"],
...
```

```javascript
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Library from '../Library';

const FakeBook = React.createClass({
  render: () => <div>Fake Book</div>,
});

Library.__Rewire__('Book', FakeBook);

describe('Library component', () => {
  it('should contain 1 Book', () => {
    const wrapper = shallow(<Library />);
    expect(wrapper.find(FakeBook)).to.have.length(1);
  });
});
```

> Rewire replaces the `Book` component with `FakeBook` which simply renders a div and you don’t have to worry about any props or logic that happens in the Book component.

<br>

## Faking Time 

`Sinon` offers a really cool API to fake time…

```javascript
var clock = sinon.useFakeTimers();
```

> Causes Sinon to replace the global `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` and `Date` with a custom implementation which is bound to the returned `clock` object.

```javascript
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Button from '../Button';
describe('Button component', () => {
  it('should call handleClick() when clicked', () => {
    const spy = sinon.spy(Button.prototype, 'handleClick');
    const wrapper = shallow(<Button />);
    wrapper.find('div').simulate('click');    
    expect(spy.calledOnce).to.equal(true);
  });
});
```
<br>

## Testing component under Internationalization using i18next library

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import ContactTable from './ContactTable';
import actionTypes from '../constants';
import i18n from '../i18nForTests';

const mockStore = configureStore([]);
const store = mockStore({ contacts: [ ] });

it('dispatches SORT_TABLE', () => {
  const enzymeWrapper = mount(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ContactTable />
      </I18nextProvider>
    </Provider>
  );
  enzymeWrapper.find('.sort').simulate('click');
  const actions = store.getActions();
  expect(actions).toEqual([{ type: actionTypes.SORT_TABLE }]);
});
```


