import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import SvgIcon from "./SvgIcon";


const WarningBox = styled.div`
	display: flex;
	padding: 16px;
	background: ${ colors.$color_yellow };
	color: ${ colors.$color_black };
`;

const MessageContainer = styled.div`
	margin-left: 2px;
`;

/**
 * A warning to show in the meta box.
 * (Consists of a warning icon and a text on a yellow background)
 *
 * @param {Array} message The warning message to display.
 */
class YoastWarning extends React.Component {
	render() {
		const { message } = this.props;
		if ( isEmpty( message ) ) {
			return null;
		}
		return <WarningBox>
			<SvgIcon icon="exclamation-triangle" size="16px" />
			<MessageContainer>
				{ message }
			</MessageContainer>
		</WarningBox>;
	}
}

YoastWarning.propTypes = {
	message: PropTypes.array,
};

export default YoastWarning;
