import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FuelQuoteHistory from '../src/components/pages/fuelQuoteHistory';

describe('Fuel Quote History', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><FuelQuoteHistory /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
