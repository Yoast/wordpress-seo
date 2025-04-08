import { defaultsDeep } from "lodash";
import { DataTracker } from "../../../src/dashboard/services/data-tracker";
import { MockRemoteDataProvider } from "./remote-data-provider";

/**
 * Mock data provider.
 */
export class MockDataTracker extends DataTracker {
	/**
	 * Creates an instance of MockDataTracker.
	 *
	 * @param {Object} [options] The options to initialize the data provider. See {@link DataTracker}.
	 */
	constructor( options = {} ) {
		super( defaultsDeep( options, {
			data: {
				setupWidgetTemporarilyDismissed: "yes",
				setupWidgetPermanentlyDismissed: "no",
				setupWidgetLoaded: "yes",
				firstInteractionStage: "install",
				lastInteractionStage: "setup",
			},
			endpoint: "dummyEndpoint",
		} ), new MockRemoteDataProvider() );
		this.getTrackingElement = jest.fn();
		this.track = jest.fn();
	}
}

