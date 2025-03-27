import { defaultsDeep } from "lodash";
import { DataTracker } from "../../../src/dashboard/services/data-tracker";

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
			setupStepsTrackingData: {
				setupWidgetDismissed: "yes",
				setupWidgetLoaded: "yes",
				firstInteractionStage: "INSTALL",
				lastInteractionStage: "SET UP",
			},
		} ) );
		this.getSetupStepsTrackingElement = jest.fn();
	}
}

