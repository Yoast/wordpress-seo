Object.defineProperty( window, "IntersectionObserver", {
	writable: true,
	value: jest.fn( () => ( {
		observe: jest.fn(),
		disconnect: jest.fn(),
	} ) ),
} );
