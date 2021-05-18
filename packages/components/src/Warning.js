import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";
import { getDirectionalStyle } from "@yoast/helpers";

// Internal dependencies.
import SvgIcon from "./SvgIcon";

const WarningBox = styled.div`
	display: flex;
	padding: 16px;
	background: ${ colors.$color_alert_warning_background };
	color: ${ colors.$color_alert_warning_text };
`;

const StyledSvgIcon = styled( SvgIcon )`
	margin-top: 2px;
`;

const MessageContainer = styled.div`
	margin: ${ getDirectionalStyle( "0 0 0 8px", "0 8px 0 0" ) };
`;

/**
 * A warning to show in the meta box.
 * (Consists of a warning icon and a text on a yellow background)
 *
 * @param {Array} message The warning message to display.
 */
class Warning extends React.Component {
	/**
	 * Renders the YoastWarning component.
	 *
	 * @returns {React.Element|null} The rendered YoastWarning.
	 */
	render() {
		const { message } = this.props;
		if ( isEmpty( message ) ) {
			return null;
		}
		return <WarningBox>
			<StyledSvgIcon icon="exclamation-triangle" size="16px" />
			<MessageContainer>
				{ message }
			</MessageContainer>
		</WarningBox>;
	}
}

Warning.propTypes = {
	message: PropTypes.array,
};

Warning.defaultProps = {
	message: [],
};

export default Warning;
