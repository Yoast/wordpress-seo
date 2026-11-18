const origin = global.navigator.userAgent;
let fakeUserAgent = null;

Object.defineProperty( global.navigator, "userAgent", {
	/**
	 * @returns {string} The user agent.
	 */
	get() {
		return fakeUserAgent === null ? origin : fakeUserAgent;
	},
	/**
	 * @param {string|null} [userAgent] The user agent. Use `null` to go back to the original value.
	 * @returns {void}
	 */
	set( userAgent = null ) {
		fakeUserAgent = userAgent;
	},
} );
