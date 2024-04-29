import { speak } from "@wordpress/a11y";
import { renderToString, useEffect, useMemo } from "@wordpress/element";
import { isString } from "lodash";

/**
 * Announces the message with the given politeness, if a valid message is provided.
 * Taken from the `useSpokenMessage` hook in Gutenberg Snackbar component.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 * @link https://github.com/WordPress/gutenberg/tree/trunk/packages/a11y
 *
 * @param {string} message  The message to be announced by assistive technologies.
 * @param {?string} [ariaLive] The politeness level for aria-live. Can be "off", "assertive" and anything else defaults to "polite".
 *
 * @returns {void}
 */
export const useSpokenMessage = ( message, ariaLive ) => {
	const spokenMessage = useMemo( () => isString( message ) ? message : renderToString( message ), [ message ] );

	useEffect( () => {
		if ( spokenMessage ) {
			speak( spokenMessage, ariaLive );
		}
	}, [ spokenMessage, ariaLive ] );
};
