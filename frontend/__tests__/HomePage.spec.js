// // const filterByTerm = require("../src/filterByTerm");


// // describe("Profile Management", () => {

// //     test("it should handle valid login info", () => { 

// //     });

// //     test("it should handle invalid login info", () => { 

// //     });

// //   });

// //   <ProfileManagement />



// import React from 'react';
// import renderer from 'react-test-renderer';

// import ProfileManagement from 'C:/Users/Ankur/Desktop/Computer Science/COSC 4353 - Singh/Fuel Quote Project/Project_Files/frontend/fuelquote/src/components/pages/profileManagement';
// // import { Counter } from './App';

// describe('Profile Management', () => {
//   test('snapshot renders', () => {
//     const component = renderer.create(<ProfileManagement />);
//     let snap = component.toJSON();
//     expect(snap).toMatchSnapshot();
//   });
// });





import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import HomePage from '../src/components/pages/homePage';
// import { Counter } from './App';

describe('Home page', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><HomePage /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});