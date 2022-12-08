import React from 'react';
import {act, create} from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import FuelQuoteForm from '../src/components/pages/fuelQuoteForm';

describe('Fuel Quote Form', () => {
  test('if render matches snapshot', async() => {
    let component;
    await act(async() => { 
      component = create(<MemoryRouter><FuelQuoteForm /></MemoryRouter>);
    });
    let snap = component.toJSON();
    expect(snap).toMatchSnapshot();
  });
});
