import handleWorkerError from "../../src/analysis/handleWorkerError";


describe( "handleWorkerError", () => {
	test( "dispatches a recalibration-specific warning", done => {
		window.wpseoPostScraperL10n = {
			recalibrationBetaActive: "1",
		};
		window.YoastSEO = {
			store: {
				dispatch: ( arg ) => {
					expect( arg ).toBeDefined();
					expect( arg.type ).toBe( "SET_WARNING_MESSAGE" );
					expect( arg.message ).toBeDefined();
					expect( arg.message.length ).toBe( 3 );

					expect( arg.message[ 0 ] ).toEqual(
						"We're sorry! Unfortunately, the recalibrated analysis beta doesn't work as intended with your current setup ",
					);

					expect( arg.message[ 1 ].type ).toEqual( "b" );
					expect( arg.message[ 1 ].props.children ).toEqual( "yet" );

					expect( arg.message[ 2 ] ).toEqual(
						". Please deactivate the recalibration beta under \"SEO - General - Features\" and please try again later. " +
						"We value your input! If you can't access the feature page, please contact your administrator. ",
					);

					done();
				},
			},
		};

		handleWorkerError();
	} );

	test( "does not do anything when the recalibrated analysis beta is inactive", () => {
		window.wpseoPostScraperL10n = {
			recalibrationBetaActive: "",
		};
		window.YoastSEO = {
			store: {
				dispatch: jest.fn(),
			},
		};

		handleWorkerError();

		expect( window.YoastSEO.store.dispatch ).toHaveBeenCalledTimes( 0 );
	} );
} );

