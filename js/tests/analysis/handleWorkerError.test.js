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
					expect( arg.message.length ).toBe( 5 );

					expect( arg.message[ 0 ] ).toEqual(
						"We're sorry! Unfortunately, the recalibrated analysis beta doesn't work as intended with your current setup ",
					);

					expect( arg.message[ 1 ].type ).toEqual( "b" );
					expect( arg.message[ 1 ].props.children ).toEqual( "yet" );

					expect( arg.message[ 2 ] ).toEqual(
						". Please ",
					);

					expect( arg.message[ 3 ].type ).toEqual( "a" );
					expect( arg.message[ 3 ].props.href ).toEqual( "/wp-admin/admin.php?page=wpseo_dashboard#top#features" );
					expect( arg.message[ 3 ].props.children ).toEqual( "deactivate the recalibration beta in your features" );
					expect( arg.message[ 3 ].props.rel ).toEqual( "noopener noreferrer" );

					expect( arg.message[ 4 ] ).toEqual(
						" and please try again later. We value your input!",
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

