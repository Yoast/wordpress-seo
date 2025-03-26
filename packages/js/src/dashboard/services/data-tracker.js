/**
 * @typedef {Object} SetupStepsTrackingData The setup steps racking data.
 * @property {string} setupWidgetDismissed Stores if the Site Kit setup widget has been (permanently) dismissed.
 * @property {string} setupWidgetLoaded Whether Site Kit setup widget is loaded.
 * @property {string} firstInteractionStage The first stage of the Site Kit setup widget the user interacted with.
 * @property {string} lastInteractionStage The last stage of the Site Kit setup widget the user interacted with.
 */


/**
 * Represents data that we want to track.
 */
export class DataTracker {
	#setupStepsTracking;

	/**
	 * @param {SetupStepsTrackingData} setupStepsTrackingData The setup steps racking data.
	 */
	constructor( { setupStepsTrackingData } ) {
		this.#setupStepsTracking = {
			setupWidgetDismissed: setupStepsTrackingData.setupWidgetDismissed,
			setupWidgetLoaded: setupStepsTrackingData.setupWidgetLoaded,
			firstInteractionStage: setupStepsTrackingData.firstInteractionStage,
			lastInteractionStage: setupStepsTrackingData.lastInteractionStage,
		};
	}

	/**
	 * @param {string} element
	 * @returns {string} the value of the element.
	 */
	getSetupStepsTrackingElement( element ) {
		return this.#setupStepsTracking?.[ element ];
	}
}
