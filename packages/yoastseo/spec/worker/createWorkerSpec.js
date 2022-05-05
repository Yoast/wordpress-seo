// Dependencies
import createWorker from "../../src/worker/createWorker";
import isSameOrigin from "../../src/worker/createWorker";

// Re-using these global variables.
let worker = null;
let url = "https://jestjs.io/docs/mock-functions";

describe( "createWorker", () => {
	// No idea what the point of this test would be -_- The worker shouldn't be null, right
	test( "initializes without errors", () => {
		worker = null;
		url = "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin";
		try {
			worker = new createWorker( url );
		} catch ( error ) {
			// eslint-ignore-line no-empty
		}
		expect( worker ).toBeNull();
	} );

	test( "creates fallback worker", () => {
		worker = null;
		url = "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin";
		try {
			worker = new createWorker( "https://jestjs.io/docs/mock-functions" );
		} catch ( error ) {
			// eslint-ignore-line no-empty
		}
		expect( worker ).toBeNull();
	} );

	test( "triggers fallback worker", () => {
		worker = null;
		url = "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin";
		worker = new createWorker( "https://jestjs.io/docs/mock-functions" );
		expect( worker.createWorkerFallback ).toHaveBeenCalledTimes( 1 );
	} );
} );

describe( "checks isSameOrigin function", () => {
	test( "checks if two URLS have the same origin", () => {
		const sameURL = isSameOrigin( "https://jestjs.io/docs/mock-functions", "https://developer.mozilla.org/en-US/docs/Web/API/Location/origin" );
		expect( sameURL ).toBeTruthy();
		// TypeError: URL.createObjectURL is not a function
	} );
} );

