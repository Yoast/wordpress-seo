// External dependencies.
import React from "react";
import { FormattedMessage } from "react-intl";
import omit from "lodash/omit";
import PropTypes from "prop-types";

// Internal dependencies.
import ScreenReaderText from "./ScreenReaderText";

/**
 * Combines the text that is passed to the formatted screen reader message.
 *
 * @param {string[]} textNodes The text nodes passed from the FormattedMessage
 *                             component.
 * @param {Object}   props     The props to the `FormattedScreenReaderMessage`
 *                             component.
 * @returns {string} The combined text.
 */
function renderText( textNodes, props ) {
	const combinedParts = [ props.before, ...textNodes, props.after ];

	return combinedParts.join( "" );
}

/**
 * Renders a message which should only be shown to screen readers. All props
 * will be passed for `FormattedMessage` except `before` and `after`.
 *
 * With `before` and `after` a string can be put before or after the translated
 * string. This is useful for punctuation that shouldn't be translated. Such
 * punctuation can for example be a colon.
 *
 * @param {Object} props        The view properties.
 * @param {string} props.before A piece of text to render before the translation.
 * @param {string} props.after  A piece of text to render after the translation.
 *
 * @returns {ReactElement} The rendered div containing the screen reader text.
 */
const FormattedScreenReaderMessage = ( props ) => {
	return (
		<FormattedMessage { ...omit( props, "children" ) }>
			{ ( textNodes ) => <ScreenReaderText>{ renderText( textNodes, props ) }</ScreenReaderText> }
		</FormattedMessage>
	);
};

FormattedScreenReaderMessage.propTypes = {
	before: PropTypes.string,
	after: PropTypes.string,
	values: PropTypes.objectOf( PropTypes.string ),
};

export default FormattedScreenReaderMessage;
