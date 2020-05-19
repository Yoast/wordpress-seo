import { __ } from "@wordpress/i18n";


/**
 * Loads the HelpScout Beacon script.
 *
 * @param {string} beaconId    The ID to pass to the HelpScout Beacon.
 * @param {string} sessionData Optional. JSON encoded session data to pass to the HelpScout Beacon.
 *
 * @returns {void}
 */
function loadHelpScout( beaconId, sessionData = "" ) {
	// This IIFE is directly from HelpScout to insert their beacon.
	( function( window, document ) {
		let beacon = window.Beacon || function() {};

		/**
		 * Inserts the HelpScout beacon script.
		 *
		 * @returns {void}
		 */
		function insertScript() {
			const domScriptElement = document.getElementsByTagName( "script" )[ 0 ];
			const scriptElement = document.createElement( "script" );

			scriptElement.type = "text/javascript";
			scriptElement.async = true;
			scriptElement.src = "https://beacon-v2.helpscout.net";
			domScriptElement.parentNode.insertBefore( scriptElement, domScriptElement );
		}

		if ( window.Beacon = beacon = function( method, options, data ) {
			window.Beacon.readyQueue.push( { method: method, options: options, data: data } );
		}, beacon.readyQueue = [], "complete" === document.readyState ) {
			return insertScript();
		}

		if ( window.attachEvent ) {
			window.attachEvent( "onload", insertScript );
		} else {
			window.addEventListener( "load", insertScript, false );
		}
	}( window, document, window.Beacon || function() {} ) );

	// eslint-disable-next-line new-cap
	window.Beacon( "init", beaconId );
	if ( sessionData !== "" ) {
		// eslint-disable-next-line new-cap
		window.Beacon( "session-data", JSON.parse( sessionData ) );
	}

	if ( window.wpseoAdminGlobalL10n.isRtl === "1" ) {
		// eslint-disable-next-line new-cap
		window.Beacon( "config", { display: { position: "left" } } );
	}
	window.Beacon( "open" );
}


const onClick = () => {
	loadHelpScout( wpseoPostScraperL10n.languageBeaconId );
};

/**
 * Triggers a HelpScout language feedback form.
 *
 * @returns {wp.Element} Feedbacklink component.
 * @constructor
 */
export default function LanguageFeedbackLink() {
	return (
		<a href="#" onClick={ onClick }>
			{ __( "Yoast didn't recognize my keyphrase.", "wordpress-seo" ) }
		</a>
	);
};
