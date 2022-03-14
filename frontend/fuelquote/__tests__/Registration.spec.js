import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Registration from '../src/components/pages/registration';

describe('Registration', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<MemoryRouter><Registration /></MemoryRouter>);
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
