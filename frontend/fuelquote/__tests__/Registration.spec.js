import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Registration from '../src/components/pages/registration';

describe('Registration', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><Registration /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
