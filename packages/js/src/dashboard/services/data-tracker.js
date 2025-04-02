import {useCallback} from "@wordpress/element";
import {noop} from "lodash";

/**
 * @typedef {Object} SetupStepsTrackingData The setup steps tracking data.
 * @property {string} [setupWidgetLoaded] Whether Site Kit setup widget is loaded.
 * @property {string} [firstInteractionStage] The first stage of the Site Kit setup widget the user interacted with.
 * @property {string} [lastInteractionStage] The last stage of the Site Kit setup widget the user interacted with.
 * @property {string} [setupWidgetTemporarilyDismissed] Stores if the Site Kit setup widget has been temporarily dismissed.
 * @property {string} [setupWidgetPermanentlyDismissed] Stores if the Site Kit setup widget has been temporarily dismissed.
 */

/**
 * Represents data that we want to track.
 */
export class DataTracker {
	#setupStepsTracking;
	#dataProvider;
	#remoteDataProvider;

	/**
	 * @param {SetupStepsTrackingData} setupStepsTrackingData The setup steps racking data.
	 * @param {import("./data-provider").DataProvider} dataProvider The data provider.
	 * @param {import("./remote-data-provider").RemoteDataProvider} remoteDataProvider The remote data provider.
	 */
	constructor( { setupStepsTrackingData, dataProvider, remoteDataProvider } ) {
		this.#setupStepsTracking = {
			setupWidgetLoaded: setupStepsTrackingData.setupWidgetLoaded,
			firstInteractionStage: setupStepsTrackingData.firstInteractionStage,
			lastInteractionStage: setupStepsTrackingData.lastInteractionStage,
			setupWidgetTemporarilyDismissed: setupStepsTrackingData.setupWidgetTemporarilyDismissed,
			setupWidgetPermanentlyDismissed: setupStepsTrackingData.setupWidgetPermanentlyDismissed,

		};
		this.#dataProvider = dataProvider;
		this.#remoteDataProvider = remoteDataProvider;
	}

	/**
	 * @param {string} element
	 * @returns {string} the value of the element.
	 */
	getSetupStepsTrackingElement( element ) {
		return this.#setupStepsTracking?.[ element ];
	}

	/**
	 *
	 * @param {SetupStepsTrackingData} values
	 */
	track( values ) {
		const trackingData = {
			setupWidgetLoaded: this.#setupStepsTracking.setupWidgetLoaded,
			firstInteractionStage: this.#setupStepsTracking.firstInteractionStage,
			lastInteractionStage: this.#setupStepsTracking.lastInteractionStage,
			setupWidgetTemporarilyDismissed: this.#setupStepsTracking.setupWidgetTemporarilyDismissed,
			setupWidgetPermanentlyDismissed: this.#setupStepsTracking.setupWidgetPermanentlyDismissed,
		};

		let hasDataChanged = false;
		/* eslint-disable no-undefined */
		Object.entries( values ).forEach( ( [ key, value ] ) => {
			if ( trackingData[ key ] !== undefined && trackingData[ key ] !== value ) {
				trackingData[ key ] = value;
				hasDataChanged = true;
			}
		} );

		// We update the object in memory and perform a REST request only if the data has changed.
		if ( hasDataChanged ) {
			this.#setupStepsTracking = trackingData;
			this.storeData(trackingData);
		}
	}

	/**
	 * Store the setup steps tracking data.
	 *
	 * @param {SetupStepsTrackingData} data The setup steps tracking data.
	 * @param {Object} [options] The HTTP options.
	 */
	storeData( data, options  ) {
		this.#remoteDataProvider.fetchJson(
			this.#dataProvider.getEndpoint( "setupStepsTracking" ),
			data,
			{ ...options, method: "POST" }
		).catch( noop );
	}

	getData() {
		return this.#setupStepsTracking;
	}
}
