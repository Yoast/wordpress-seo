import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import { YoastButton } from "./YoastButton";
import SvgIcon from "../../Shared/components/SvgIcon";

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled icon button.
 */
const HelpCenterButtonBase = ( props ) => {
	return (
		<YoastButton { ...props }>
			<SvgIcon icon="question-circle" color={ props.iconColor } />
			{ props.children }
			<SvgIcon icon={ props.isExpanded ? "angle-up" : "angle-down" } color={ props.iconColor } />
		</YoastButton>
	);
};

export const HelpCenterButton = styled( HelpCenterButtonBase )`
	display: flex;
	margin: 0;
	min-width: 0;
	padding: 0 2px;
	min-height: 32px;

	svg {
		margin: 0 16px;
	}
`;

HelpCenterButtonBase.propTypes = {
	iconColor: PropTypes.string,
	isExpanded: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

HelpCenterButtonBase.defaultProps = {
	iconColor: colors.$color_white,
	isExpanded: false,
};
