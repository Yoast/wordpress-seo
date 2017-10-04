import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import { questionCircle, angleUp, angleDown } from "../../../../style-guide/svg";
import { YoastButton } from "./YoastButton";
import { Icon } from "../../Shared/components/Icon";

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
const HelpCenterButtonBase = ( props ) => {
	return (
		<YoastButton { ...props }>
			<Icon icon={ questionCircle } color={ props.iconColor } />
			{ props.children }
			<Icon icon={ props.isExpanded ? angleUp : angleDown } color={ props.iconColor } />
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
