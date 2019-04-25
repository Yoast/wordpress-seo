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
} );

describe( "isFeatureEnabled", () => {
	it( "returns true when a particular feature is enabled", () => {
		const featureName = "feature-1";
		enableFeatures( [ featureName ] );

		const featureIsEnabled = isFeatureEnabled( featureName );

		expect( featureIsEnabled ).toEqual( true );
	} );

	it( "returns false when a particular feature is disabled", () => {
		const featureName = "feature-1";
		enableFeatures( [ featureName ] );

		const featureIsEnabled = isFeatureEnabled( "disabled-feature" );

		expect( featureIsEnabled ).toEqual( false );
	} );
} );
