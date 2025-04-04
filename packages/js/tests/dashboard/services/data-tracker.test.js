import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { DataTracker } from "../../../src/dashboard/services/data-tracker";

describe( "DataTracker", () => {
	let dataProvider;
	let remoteDataProvider;
	let stepsData;
	let dataTracker;
	beforeAll( () => {
		dataProvider = new MockDataProvider( {
			siteKitConfiguration: {
				isFeatureEnabled: true,
				connectionStepsStatuses: {
					isInstalled: true,
					isActive: true,
					isSetupCompleted: true,
				},
			},
		} );
		remoteDataProvider = new MockRemoteDataProvider( {} );
		stepsData = {
			setupWidgetLoaded: "yes",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};
		dataTracker = new DataTracker( stepsData, dataProvider, remoteDataProvider );
	} );


	test( "should update internal state when tracked data is different than the current one", () => {
		const newStepsData = {
			setupWidgetLoaded: "no",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};
		dataTracker = new DataTracker( stepsData, dataProvider, remoteDataProvider );
		dataTracker.track( newStepsData );
		expect( dataTracker.getSetupStepsTrackingElement( "setupWidgetLoaded" ) ).toBe( "no" );
	} );


	test( "should perform a REST call when tracked data is updated", () => {
		const newStepsData = {
			setupWidgetLoaded: "no",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};

		dataTracker = new DataTracker( stepsData, dataProvider, remoteDataProvider );
		const storeDataSpy = jest.spyOn( dataTracker, "storeData" );

		dataTracker.track( newStepsData );

		expect( storeDataSpy ).toHaveBeenCalled();
		storeDataSpy.mockRestore();
	} );

	test( "should not perform a REST call when tracked data is unchanged", () => {
		const newStepsData = {
			setupWidgetLoaded: "yes",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};

		dataTracker = new DataTracker( stepsData, dataProvider, remoteDataProvider );
		const storeDataSpy = jest.spyOn( dataTracker, "storeData" );

		dataTracker.track( newStepsData );

		expect( storeDataSpy ).toHaveBeenCalledTimes( 0 );
		storeDataSpy.mockRestore();
	} );

	test.each( [
		[ "setupWidgetLoaded", "yes" ],
		[ "firstInteractionStage", "install" ],
		[ "lastInteractionStage", "setup" ],
		[ "setupWidgetTemporarilyDismissed", "yes" ],
		[ "setupWidgetPermanentlyDismissed", "no" ],
	] )( "should correctly retrieve %s", ( element, expected ) => {
		dataTracker = new DataTracker( stepsData, dataProvider, remoteDataProvider );

		expect( dataTracker.getSetupStepsTrackingElement( element ) ).toBe( expected );
	} );
} );
