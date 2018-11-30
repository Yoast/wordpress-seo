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

		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 1 );
		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledWith( {
			type: "SET_WARNING_MESSAGE",
			message: [
				"We're sorry! Unfortunately, the recalibrated analysis beta doesn't work as intended with your " +
				"current setup ", <b key="1">yet</b>,
				". Please ",
				<a href="/wp-admin/admin.php?page=wpseo_dashboard#top#features" target="_blank" rel="noopener noreferrer" key="1">deactivate the
					recalibration beta in your features</a>,
				" and please try again later. We value your input!" ],
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

		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 1 );
		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledWith( {
			type: "SET_WARNING_MESSAGE",
			message: [
				"Sorry! Something went wrong while loading the analysis! If the problem persists please ",
				<a href="https://github.com/Yoast/wordpress-seo/issues/new/choose" target="_blank"rel="noopener noreferrer" key="1">inform us
					about this error</a>,
				". Thanks!",
			],
		} );
	} );
} );
