/**
 * Helper class for login popups.
 */
export default class LoginPopup {
	/**
	 * Constructs the LoginPopup class.
	 *
	 * @param {string} url           The OAuth URL where requests are sent to.
	 * @param {Object} eventHandlers Object containing event types and their handlers
	 * @param {Object} options       Object containing options for the popup.
	 */
	constructor( url, eventHandlers = {}, options = {} ) {
		this.url    = url;
		this.origin = new URL( url ).origin;

		// Merge default handlers with the passed handlers.
		this.eventHandlers = Object.assign( {
			success: {
				type: "",
				callback: () => {},
			},
			error: {
				type: "",
				callback: () => {},
			},
		}, eventHandlers );

		// Merge default options with the passed options.
		this.options = Object.assign( {
			height: 570,
			width: 340,
			title: "",
		}, options );

		this.popup = null;

		this.createPopup    = this.createPopup.bind( this );
		this.messageHandler = this.messageHandler.bind( this );
		this.getPopup       = this.getPopup.bind( this );
	}

	/**
	 * Creates the actual popup based on the options.
	 *
	 * @returns {void}
	 */
	createPopup() {
		const { height, width, title } = this.options;

		const top    = window.top.outerHeight / 2 + window.top.screenY - ( height / 2 );
		const left   = window.top.outerWidth / 2 + window.top.screenX - ( width / 2 );

		const features = [
			"top=" + top,
			"left=" + left,
			"width=" + width,
			"height=" + height,
			"resizable=1",
			"scrollbars=1",
			"status=0",
		];

		if ( ! this.popup || this.popup.closed ) {
			this.popup = window.open(
				this.url,
				title,
				features.join( "," )
			);
		}

		if ( this.popup ) {
			this.popup.focus();
		}

		window.addEventListener( "message", this.messageHandler, false );
	}

	/**
	 * Handles the messages returned from the OAuth endpoint.
	 *
	 * @param {Event} event The event called in the popup.
	 *
	 * @returns {void}
	 */
	async messageHandler( event ) {
		const { data, source, origin } = event;

		// Check that the message comes from the expected origin.
		if ( origin !== this.origin || this.popup !== source ) {
			return;
		}

		if ( data.type === this.eventHandlers.success.type ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.messageHandler, false );
			await this.eventHandlers.success.callback( data );
		}

		if ( data.type === this.eventHandlers.error.type ) {
			this.popup.close();
			// Stop listening to messages, since the popup is closed.
			window.removeEventListener( "message", this.messageHandler, false );
			await this.eventHandlers.error.callback( data );
		}
	}

	/**
	 * Gets the popup.
	 *
	 * @returns {null|Window} Null if no window is open. Otherwise, it returns the Window instance.
	 */
	getPopup() {
		return this.popup;
	}

	/**
	 * Checks if the popup is closed.
	 *
	 * @returns {boolean} True if there is no popup or if it's closed, otherwise false.
	 */
	isClosed() {
		return ! this.popup || this.popup.closed;
	}

	/**
	 * Focuses the popup if it's open.
	 *
	 * @returns {void}
	 */
	focus() {
		if ( ! this.isClosed() ) {
			this.popup.focus();
		}
	}
}
