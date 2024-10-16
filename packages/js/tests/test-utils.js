import { jest } from "@jest/globals";

export * from "@testing-library/react";

/**
 * Mocks the window to override specific data.
 * @param {Object} data The data to set on the window.
 * @returns {jest.SpyInstance} The spy. Be sure to restore at the end of the test.
 */
export const mockWindow = ( data ) => {
	const original = { ...window };
	const spy = jest.spyOn( global, "window", "get" );
	spy.mockImplementation( () => ( {
		...original,
		...data,
	} ) );

	return spy;
};

/**
 * Mocks the window to override specific data, cleaning up after the tests.
 * @param {Object} data The data to set on the window.
 * @param {function} runTests The callback to run with the mocked window, passing the spy.
 * @returns {void}
 */
export function withWindowMock( data, runTests ) {
	const spy = mockWindow( data );
	try {
		runTests( spy );
	} finally {
		spy.mockRestore();
	}
}
