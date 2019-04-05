import { enabledFeatures, enableFeatures, isFeatureEnabled } from "../src";

describe( "enableFeatures", () => {
	it( "enables a list of given features", () => {
		const previousFeatures = enabledFeatures().slice();
		const featuresToEnable = [ "feature-1", "feature-2" ];
		enableFeatures( featuresToEnable );
		const newFeatures = enabledFeatures();

		expect( newFeatures ).toEqual( [ ...featuresToEnable, ...previousFeatures ] );
	} );

	it( "does not add features that have already been enabled", () => {
		const previousFeatures = enabledFeatures().slice();
		const featuresToEnable = [ "feature-1", "feature-2" ];
		enableFeatures( featuresToEnable );
		enableFeatures( featuresToEnable );
		const newFeatures = enabledFeatures();

		const expected = new Set( [ ...previousFeatures, ...featuresToEnable ] );

		expect( new Set( newFeatures ) ).toEqual( expected );
	} );

	it( "sets features on a namespace", () => {
		const previousFeatures1 = enabledFeatures( "namespace-1" ).slice();
		const previousFeatures2 = enabledFeatures( "namespace-2" ).slice();

		const featuresToEnable1 = [ "feature-1", "feature-3" ];
		const featuresToEnable2 = [ "feature-1", "feature-2" ];

		enableFeatures( featuresToEnable1, "namespace-1" );
		enableFeatures( featuresToEnable2, "namespace-2" );

		const expected1 = new Set( [ ...previousFeatures1, ...featuresToEnable1 ] );
		const expected2 = new Set( [ ...previousFeatures2, ...featuresToEnable2 ] );

		const newFeatures1 = enabledFeatures( "namespace-1" );
		const newFeatures2 = enabledFeatures( "namespace-2" );

		expect( new Set( newFeatures1 ) ).toEqual( expected1 );
		expect( new Set( newFeatures2 ) ).toEqual( expected2 );
	} );
} );

describe( "isFeatureEnabled", () => {
	it( "returns true when a particular feature is enabled", () => {
		const featureName = "feature-1";
		enableFeatures( [ featureName ] );

		const featureIsEnabled = isFeatureEnabled( featureName );

		expect( featureIsEnabled ).toEqual( true );
	} );
} );
