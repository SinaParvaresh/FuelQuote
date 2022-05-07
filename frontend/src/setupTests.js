// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-fetch-mock';
import 'regenerator-runtime/runtime';

global.console = {
    log: jest.fn(), // console.log are ignored in tests
    error: jest.fn(),
    warn: jest.fn(),
    // Keep native behaviour for other methods, use those to print out stuff from tests, not 'console.log' || 'console.error' || 'console.warn'.
    info: console.info,
    debug: console.debug,
};