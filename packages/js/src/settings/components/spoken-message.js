import PropTypes from "prop-types";
import { useSpokenMessage } from "../hooks";

/**
 * Announces the message with the given politeness, if a valid message is provided.
 * Wraps the `useSpokenMessage` hook in a component.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 * @see useSpokenMessage in packages/js/src/settings/hooks/use-spoken-message.js
 *
 * @param {string} message  The message to be announced by assistive technologies.
 * @param {?string} [ariaLive] The politeness level for aria-live. Can be "off", "assertive" and anything else defaults to "polite".
 *
 * @returns {JSX.Element} Null.
 */
export const SpokenMessage = ( { message, ariaLive } ) => {
	useSpokenMessage( message, ariaLive );

	return null;
};

SpokenMessage.propTypes = {
	message: PropTypes.string.isRequired,
	ariaLive: PropTypes.string,
};
SpokenMessage.defaultProps = {
	// eslint-disable-next-line no-undefined
	ariaLive: undefined,
};
