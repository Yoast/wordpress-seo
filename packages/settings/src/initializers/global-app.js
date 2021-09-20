export const customDataCallbacks = [];

const globalApp = {
	registerFill: () => console.warn( "You appear to have called registerFill before the main app rendered. Try to call the function later." ),

	/**
	 * Register a data callback.
	 *
	 * @param {function} callback The function that will return the extra data this app should save.
	 *
	 * @returns {void}
	 */
	registerCustomDataCallback: ( callback ) => {
		if ( typeof callback === "function" ) {
			customDataCallbacks.push( callback );
		}
	},
};

export default globalApp;
