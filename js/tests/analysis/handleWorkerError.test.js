import handleWorkerError from "../../src/analysis/handle-worker-error";


describe( "handleWorkerError", () => {
	it( "does not do anything yet", () => {
		/*
		 * Note: this test suite should be properly implemented when `handleWorkerError`
		 * has been implemented as well.
		 */
		window.YoastSEO = {
			store: {
				dispatch: jest.fn(),
			},
		};

		handleWorkerError();

		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 0 );
	} );
} );
