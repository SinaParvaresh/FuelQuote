import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FuelQuoteHistory from '../src/components/pages/fuelQuoteHistory';

describe('Fuel Quote History', () => {
  test('snapshot renders', () => {
    const component = renderer.create(<MemoryRouter><FuelQuoteHistory /></MemoryRouter>);
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
