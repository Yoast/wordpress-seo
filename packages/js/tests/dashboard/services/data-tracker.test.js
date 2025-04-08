import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { DataTracker } from "../../../src/dashboard/services/data-tracker";

describe( "DataTracker", () => {
	let remoteDataProvider;
	let trackingRoute;
	let stepsData;
	let dataTracker;
	beforeAll( () => {
		remoteDataProvider = new MockRemoteDataProvider( {} );
		stepsData = {
			setupWidgetLoaded: "yes",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};
		trackingRoute = {
			data: {
				setupWidgetLoaded: "yes",
				firstInteractionStage: "install",
				lastInteractionStage: "setup",
				setupWidgetTemporarilyDismissed: "yes",
				setupWidgetPermanentlyDismissed: "no",
			},
			endpoint: "dummyEndpoint",
		};
		dataTracker = new DataTracker( trackingRoute, remoteDataProvider );
	} );


	test( "should update internal state when tracked data is different than the current one", () => {
		const newStepsData = {
			setupWidgetLoaded: "no",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};
		dataTracker = new DataTracker( trackingRoute, remoteDataProvider );
		dataTracker.track( newStepsData );
		expect( dataTracker.getTrackingElement( "setupWidgetLoaded" ) ).toBe( "no" );
	} );


	test( "should perform a REST call when tracked data is updated", () => {
		const newStepsData = {
			setupWidgetLoaded: "no",
			firstInteractionStage: "install",
			lastInteractionStage: "setup",
			setupWidgetTemporarilyDismissed: "yes",
			setupWidgetPermanentlyDismissed: "no",
		};

		dataTracker = new DataTracker( trackingRoute, remoteDataProvider );
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

		dataTracker = new DataTracker( trackingRoute, remoteDataProvider );
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
		dataTracker = new DataTracker( trackingRoute, remoteDataProvider );

		expect( dataTracker.getTrackingElement( element ) ).toBe( expected );
	} );
} );
