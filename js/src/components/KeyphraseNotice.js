import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "yoast-components";

const Notice = styled.p`
	background: ${ colors.$color_notice_yellow };
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
		if ( this.props.innerHtml && this.props.innerHtml.length > 0 ) {
			return <Notice dangerouslySetInnerHTML={ { __html: this.props.innerHtml } } />;
		}
		return null;
	}
}

export default KeyphraseNotice;

KeyphraseNotice.propTypes = {
	innerHtml: PropTypes.string,
};

KeyphraseNotice.defaultProps = {
	innerHtml: "",
};
