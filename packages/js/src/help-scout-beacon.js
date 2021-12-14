import { render, useState, Fragment } from "@wordpress/element";
import styled, { createGlobalStyle } from "styled-components";
import { __ } from "@wordpress/i18n";

const BeaconOffset = createGlobalStyle`
	@media only screen and (min-width: 1024px) {
		.BeaconFabButtonFrame.BeaconFabButtonFrame {
			${ ( props => props.isRtl === "1" ? "left" : "right" ) }: 340px !important;
		}
	}
`;

/**
 * Render a component in a newly created div.
 *
 * @param {wp.Component} component The component to render.
 *
 * @returns {void}
 */
function renderComponent( component ) {
	const element = document.createElement( "div" );
	element.setAttribute( "id", "yoast-helpscout-beacon" );

	render( component, element );

	document.body.appendChild( element );
}

/**
 * Checks whether the current page contains upsells.
 *
 * @returns {boolean} Whether the current page contains upsells.
 */
function pageHasUpsells() {
	return !! document.getElementById( "sidebar" );
}

/**
 * Loads the session data for the current session.
 *
 * @param {string} sessionData Optional. JSON encoded session data to pass to the HelpScout Beacon.
 *
 * @returns {void}
 */
function loadHelpScoutSessionData( sessionData ) {
	if ( sessionData !== "" ) {
		sessionData = JSON.parse( sessionData );
		if ( typeof sessionData.name !== "undefined" && typeof sessionData.email !== "undefined" ) {
			// eslint-disable-next-line new-cap
			window.Beacon( "prefill", {
				name: sessionData.name,
				email: sessionData.email,
			} );

			delete sessionData.name;
			delete sessionData.email;
		}

		// eslint-disable-next-line new-cap
		window.Beacon( "session-data", sessionData );
	}
}

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
	loadHelpScoutSessionData( sessionData );

	if ( window.wpseoAdminGlobalL10n.isRtl === "1" ) {
		// eslint-disable-next-line new-cap
		window.Beacon( "config", { display: { position: "left" } } );
	}

	if ( pageHasUpsells() ) {
		renderComponent( <BeaconOffset isRtl={ window.wpseoAdminGlobalL10n.isRtl } /> );
	}
}

/**
 * Loads a button that, when clicked, asks the user's consent before possibly loading in the HelpScout beacon.
 *
 * @param {string} beaconId    The ID to pass to the HelpScout Beacon.
 * @param {string} sessionData Optional. JSON encoded session data to pass to the HelpScout Beacon.
 *
 * @returns {void}
 */
function loadHelpScoutConsent( beaconId, sessionData = null ) {
	const Frame = styled.div`
		border-radius: 60px;
		height: 60px;
		position: fixed;
		transform: scale(1);
		width: 60px;
		z-index: 1049;
		bottom: 40px;
		box-shadow: rgba(0, 0, 0, 0.1) 0 4px 7px;
		${ ( props => props.isRtl === "1" ? "left" : "right" ) }: 40px;
		top: auto;
		border-width: initial;
		border-style: none;
		border-color: initial;
		border-image: initial;
		transition: box-shadow 250ms ease 0s, opacity 0.4s ease 0s, scale 1000ms ease-in-out 0s, transform 0.2s ease-in-out 0s;
	`;

	const SvgContainer = styled.span`
		-webkit-box-align: center;
		align-items: center;
		color: white;
		cursor: pointer;
		display: flex;
		height: 100%;
		-webkit-box-pack: center;
		justify-content: center;
		left: 0;
		pointer-events: none;
		position: absolute;
		text-indent: -99999px;
		top: 0;
		width: 60px;
		will-change: opacity, transform;
		opacity: 1 !important;
		transform: rotate(0deg) scale(1) !important;
		transition: opacity 80ms linear 0s, transform 160ms linear 0s;
	`;

	/**
	 * Initializes the SpeechBubble component.
	 *
	 * @constructor
	 *
	 * @returns {wp.Element} A SpeechBubble element.
	 */
	const SpeechBubble = () => {
		return (
			<SvgContainer>
				<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52">
					{ /* eslint-disable-next-line max-len */ }
					<path d="M27.031 32h-2.488v-2.046c0-.635.077-1.21.232-1.72.154-.513.366-.972.639-1.381.272-.41.58-.779.923-1.109.345-.328.694-.652 1.049-.97l.995-.854a6.432 6.432 0 0 0 1.475-1.568c.39-.59.585-1.329.585-2.216 0-.635-.117-1.203-.355-1.703a3.7 3.7 0 0 0-.96-1.263 4.305 4.305 0 0 0-1.401-.783A5.324 5.324 0 0 0 26 16.114c-1.28 0-2.316.375-3.11 1.124-.795.75-1.286 1.705-1.475 2.865L19 19.693c.356-1.772 1.166-3.165 2.434-4.176C22.701 14.507 24.26 14 26.107 14c.947 0 1.842.131 2.682.392.84.262 1.57.648 2.185 1.16a5.652 5.652 0 0 1 1.475 1.892c.368.75.551 1.602.551 2.556 0 .728-.083 1.364-.248 1.909a5.315 5.315 0 0 1-.693 1.467 6.276 6.276 0 0 1-1.048 1.176c-.403.351-.83.71-1.28 1.073-.498.387-.918.738-1.26 1.057a4.698 4.698 0 0 0-.836 1.006 3.847 3.847 0 0 0-.462 1.176c-.095.432-.142.955-.142 1.568V32zM26 37a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="#FFF" />
				</svg>
			</SvgContainer>
		);
	};

	const Button = styled.button`
		-webkit-appearance: none;
		-webkit-box-align: center;
		align-items: center;
		bottom: 0;
		display: block;
		height: 60px;
		-webkit-box-pack: center;
		justify-content: center;
		line-height: 60px;
		position: relative;
		user-select: none;
		z-index: 899;
		background-color: rgb(164, 40, 106);
		color: white;
		cursor: pointer;
		min-width: 60px;
		-webkit-tap-highlight-color: transparent;
		border-radius: 200px;
		margin: 0;
		outline: none;
		padding: 0;
		border-width: initial;
		border-style: none;
		border-color: initial;
		border-image: initial;
		transition: background-color 200ms linear 0s, transform 200ms linear 0s;
	`;

	/**
	 * Initializes the HelpScoutBeaconAskConsentButton component.
	 *
	 * @constructor
	 *
	 * @returns {wp.Element} A HelpScoutBeaconAskConsentButton element.
	 */
	const HelpScoutBeaconAskConsentButton = () => {
		const [ show, setShow ] = useState( true );
		const hasUpsells = pageHasUpsells();

		/**
		 * Loads HelpScout beacon and then disables the ask consent button.
		 *
		 * @returns {void}
		 */
		function onClick() {
			const askConsentText = __(
				// eslint-disable-next-line max-len
				"When you click OK we will open our HelpScout beacon where you can find answers to your questions. This beacon will load our support data and also potentially set cookies.",
				"wordpress-seo"
			);

			// eslint-disable-next-line no-alert
			if ( window.confirm( askConsentText ) ) {
				// eslint-disable-next-line callback-return
				loadHelpScout( beaconId, sessionData );
				// eslint-disable-next-line new-cap
				window.Beacon( "open" );

				// Hide the consent asking button only after the HelpScout button is visible. There is no callback for that though.
				window.setTimeout( () => {
					setShow( false );
				}, 1000 );
			}
		}

		return (
			<Fragment>
				{ hasUpsells && <BeaconOffset isRtl={ window.wpseoAdminGlobalL10n.isRtl } /> }
				{ show && <Frame className={ hasUpsells ? "BeaconFabButtonFrame" : "" } isRtl={ window.wpseoAdminGlobalL10n.isRtl }>
					<Button onClick={ onClick }>
						<SpeechBubble />
					</Button>
				</Frame> }
			</Fragment>
		);
	};

	renderComponent( <HelpScoutBeaconAskConsentButton /> );
}

window.wpseoHelpScoutBeacon = loadHelpScout;
window.wpseoHelpScoutBeaconConsent = loadHelpScoutConsent;
