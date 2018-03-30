import React from "react";
import ScreenReaderText from "./ScreenReaderText";
import { FormattedMessage } from "react-intl";
import omit from "lodash/omit";
import PropTypes from "prop-types";

/**
 * Renders a message which should only be shown to screen readers. All props
 * will be passed for `FormattedMessage` except `before` and `after`.
 *
 * With `before` and `after` a string can be put before or after the translated
 * string. This is useful for punctuation that shouldn't be translated. Such
 * punctuation can for example be a colon.
 *
 * @param {Object} props The view properties.
 * @param {string} props.before A piece of text to render before the translation.
 * @param {string} props.after A piece of text to render after the translation.
 *
 * @returns {ReactElement} ScreenReaderText The div containing the screen reader text.
 */
const FormattedScreenReaderMessage = ( props ) => {
	return (
		<FormattedMessage { ...omit( props, "children" ) }>
			{ ( textNodes ) => <ScreenReaderText>{ [ props.before, ...textNodes, props.after ].join( "" ) }</ScreenReaderText> }
		</FormattedMessage>
	);
};

FormattedScreenReaderMessage.propTypes = {
	before: PropTypes.string,
	after: PropTypes.string,
	values: PropTypes.objectOf( PropTypes.string ),
};

export default FormattedScreenReaderMessage;
