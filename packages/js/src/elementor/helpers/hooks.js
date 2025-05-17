/* global $e */

/**
 * @returns {boolean} True.
 */
const returnTrue = () => true;

/**
 * A class that conforms to the Elementor hooks format,
 * so that we can register its instance as a callback.
 *
 * Specifically, this is a UI After hook.
 */
class ElementorUIHook extends $e.modules.hookUI.Base {
	/**
	 * Constructs this class.
	 *
	 * @param {string} hook The hook to register to.
	 * @param {string} id The id to register our callback behind.
	 * @param {function} callback The function to call when the hook is fired.
	 * @param {function} conditions The function to call to check if the hook should run. Defaults to a function that always returns true.
	 */
	constructor( hook, id, callback, conditions = returnTrue ) {
		super();
		this.command = hook;
		this.id = id;
		this.callback = callback;
		this.conditions = conditions;
	}

	/**
	 * A getter for the Elementor hook we want to register to.
	 *
	 * @returns {string} The hook to register to.
	 */
	getCommand() {
		return this.command;
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
	 * A getter for the conditions function.
	 *
	 * @param {*} args The arguments passed to the hook.
	 *
	 * @returns {boolean} Whether the hook should run.
	 */
	getConditions( ...args ) {
		return this.conditions( ...args );
	}

	/**
	 * This function is called when the hook is fired.
	 *
	 * @param {*} args The arguments passed to the hook.
	 *
	 * @returns {*} The callback result.
	 */
	apply( ...args ) {
		return this.callback( ...args );
	}
}

/**
 * A class that conforms to the Elementor hooks format,
 * so that we can register its instance as a callback.
 *
 * Specifically, this is a Data After hook.
 */
class ElementorDataHook extends $e.modules.hookData.Base {
	/**
	 * Constructs this class.
	 *
	 * @param {string} hook The hook to register to.
	 * @param {string} id The id to register our callback behind.
	 * @param {function} callback The function to call when the hook is fired.
	 * @param {function} conditions The function to call to check if the hook should run. Defaults to a function that always returns true.
	 */
	constructor( hook, id, callback, conditions = returnTrue ) {
		super();
		this.command = hook;
		this.id = id;
		this.callback = callback;
		this.conditions = conditions.bind( this );
	}

	/**
	 * A getter for the Elementor hook we want to register to.
	 *
	 * @returns {string} The hook to register to.
	 */
	getCommand() {
		return this.command;
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
	 * A getter for the conditions function.
	 *
	 * @param {*} args The arguments passed to the hook.
	 *
	 * @returns {boolean} Whether the hook should run.
	 */
	getConditions( ...args ) {
		return this.conditions( ...args );
	}

	/**
	 * This function is called when the hook is fired.
	 *
	 * @param {*} args The arguments passed to the hook.
	 *
	 * @returns {*} The callback result.
	 */
	apply( ...args ) {
		return this.callback( ...args );
	}
}

/**
 * Initializes the Elementor UI after hooks and registers them.
 *
 * @param {string} hook The hook to register to.
 * @param {string} id The id to register our callback behind.
 * @param {function} callback The function to call when the hook is fired.
 * @param {function} conditions The function to call to check if the hook should run. Defaults to a function that always returns true.
 *
 * @returns {{callback: *, id: *, isActive: boolean}} The Elementor callback function.
 */
export function registerElementorUIHookAfter( hook, id, callback, conditions = returnTrue ) {
	return $e.hooks.registerUIAfter( new ElementorUIHook( hook, id, callback, conditions ) );
}

/**
 * Initializes the Elementor UI before hooks and registers them.
 *
 * @param {string} hook The hook to register to.
 * @param {string} id The id to register our callback behind.
 * @param {function} callback The function to call when the hook is fired.
 * @param {function} conditions The function to call to check if the hook should run. Defaults to a function that always returns true.
 *
 * @returns {{callback: *, id: *, isActive: boolean}} The Elementor callback function.
 */
export function registerElementorUIHookBefore( hook, id, callback, conditions = returnTrue ) {
	return $e.hooks.registerUIBefore( new ElementorUIHook( hook, id, callback, conditions ) );
}

/**
 * Initializes the Elementor Data after hooks and registers them.
 *
 * @param {string} hook The hook to register to.
 * @param {string} id The id to register our callback behind.
 * @param {function} callback The function to call when the hook is fired.
 * @param {function} conditions The function to call to check if the hook should run. Defaults to a function that always returns true.
 *
 * @returns {{callback: *, id: *, isActive: boolean}} The Elementor callback function.
 */
export function registerElementorDataHookAfter( hook, id, callback, conditions = returnTrue ) {
	return $e.hooks.registerDataAfter( new ElementorDataHook( hook, id, callback, conditions ) );
}
