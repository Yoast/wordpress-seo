import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "yoast-components";

// TODO: Add background color to style guide?
const Notice = styled.p`
	background: #FFEEA3;
	color: ${ colors.$color_grey_dark };
	padding: 4px 8px;
`;

/**
 * A notice to be shown inside the metabox.
 */
class KeyphraseNotice extends React.Component {
	/**
	 * Renders the keyphrase notice.
	 * @returns {React.Component} the keyphrase notice component.
	 */
	render() {
		return ( <Notice>
			{ this.props.text }
		</Notice> );
	}
}

export default KeyphraseNotice;

KeyphraseNotice.propTypes = {
	text: PropTypes.string,
};

KeyphraseNotice.defaultProps = {
	text: "",
};
