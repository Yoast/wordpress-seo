import React from "react";
import handleWorkerError from "../../src/analysis/handleWorkerError";

describe( "handleWorkerError for the Recalibrated version", () => {
	beforeEach( () => {
		window.wpseoPostScraperL10n = {
			recalibrationBetaActive: "1",
		};
	} );

	test( "dispatches a recalibration-specific warning", () => {
		window.YoastSEO = {
			store: {
				dispatch: jest.fn(),
			},
		};

		handleWorkerError();

		expect( YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 1 );
		expect( YoastSEO.store.dispatch ).toHaveBeenCalledWith( {
			type: "SET_WARNING_MESSAGE",
			message: [
				"Sorry! Something went wrong while loading the recalibrated analysis beta! ",
				<a href="/wp-admin/admin.php?page=wpseo_dashboard#top#features" target="_blank">Please deactivate the recalibration beta in your features.</a>
			]
		} );
	} );
} );

describe( "handleWorkerError for the non-Recalibrated version", () => {
	beforeEach( () => {
		window.wpseoPostScraperL10n = {
			recalibrationBetaActive: "",
		};
	} );

	test( "dispatches a non-recalibration specific warning", () => {
		window.YoastSEO = {
			store: {
				dispatch: jest.fn(),
			},
		};

		handleWorkerError();

		expect( YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 1 );
		expect( YoastSEO.store.dispatch ).toHaveBeenCalledWith( {
			type: "SET_WARNING_MESSAGE",
			message: ["Sorry! Something went wrong while loading the analysis! If the problem persists please inform us about this error."],
		} );
	} );
} );
