// // const filterByTerm = require("../src/filterByTerm");


// // describe("Profile Management", () => {

// //     test("it should handle valid login info", () => { 

// //     });

// //     test("it should handle invalid login info", () => { 

// //     });

// //   });

// //   <ProfileManagement />



import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import ProfileManagement from '../src/components/pages/profileManagement';

describe('Profile Management', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><ProfileManagement /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});





// import React from 'react';
// import renderer from 'react-test-renderer';

// import HomePage from '../src/components/pages/homePage';
// // import { Counter } from './App';

// describe('Home page', () => {
//   test('snapshot renders', () => {
//     const component = renderer.create(<HomePage />);
//     let snap = component.toJSON();
//     expect(snap).toMatchSnapshot();
//   });
// });