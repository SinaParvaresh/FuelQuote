import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Login from '../src/components/pages/login';

describe('Login', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><Login /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
