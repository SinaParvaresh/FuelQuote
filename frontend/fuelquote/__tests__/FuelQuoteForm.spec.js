import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FuelQuoteForm from '../src/components/pages/fuelQuoteForm';

describe('Fuel Quote Form', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<MemoryRouter><FuelQuoteForm /></MemoryRouter>);
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
