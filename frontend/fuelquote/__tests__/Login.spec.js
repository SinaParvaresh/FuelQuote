import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Login from '../src/components/pages/login';

describe('Login', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<MemoryRouter><Login /></MemoryRouter>);
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
