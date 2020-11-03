/* global $e */
/**
 * A class that conforms to the Elementor hooks format,
 * so that we can register its instance as a callback.
 *
 * Specifically, this is a UI After hook.
 */
class ElementorHook extends $e.modules.hookUI.After {
	/**
	 * Constructs this class.
	 *
	 * @param {string}   hook     The hook to register to.
	 * @param {string}   id       The id to register our callback behind.
	 * @param {function} callback The function to call when the hook is fired.
	 */
	constructor( hook, id, callback ) {
		super();
		this.hook = hook;
		this.id = id;
		this.callback = callback;
	}

	/**
	 * A getter for the Elementor hook we want to register to.
	 *
	 * @returns {string} The hook to register to.
	 */
	getCommand() {
	  return this.hook;
	}

	/**
	 * A getter for the id we register our callback behind.
	 *
	 * @returns {string} The id to register behind.
	 */
	getId() {
	  return this.id;
	}

	/**
	 * This function is called when the hook is fired.
	 *
	 * @returns {void}
	 */
	apply() {
		// Give some milliseconds to ensure the UI has been updated.
		this.callback();
	}
}

/**
 * Initializes the Elementor hooks and registers them.
 *
 * @param {string}   hook     The hook to register to.
 * @param {string}   id       The id to register our callback behind.
 * @param {function} callback The function to call when the hook is fired.
 *
 * @returns {void}
 */
const registerElementorHook = ( hook, id, callback ) => {
	$e.hooks.registerUIAfter( new ElementorHook( hook, id, callback ) );
};

export default registerElementorHook;
