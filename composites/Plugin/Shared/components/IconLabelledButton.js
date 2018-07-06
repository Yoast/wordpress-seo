import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import flow from "lodash/flow";
import omit from "lodash/omit";

import colors from "../../../../style-guide/colors.json";
import SvgIcon from "./SvgIcon";
import { addHoverStyle, addFocusStyle, addActiveStyle } from "./Button";

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
export const addButtonStyles = flow( [ addFocusStyle, addActiveStyle, addHoverStyle ] );

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const IconLabelledBaseButton = addButtonStyles(
	styled.button`
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid transparent;
		margin: 0;
		padding: 8px;
		overflow: visible;
		font-family: inherit;
		font-weight: inherit;
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		font-size: ${ props => props.fontSize };

		svg {
			margin: 0 0 8px;
			flex-shrink: 0;
			// Safari 10
			align-self: center;
		}

		&:hover svg {
			fill: ${ props => props.hoverColor };
		}
	`
);

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
export const IconLabelledButton = ( props ) => {
	const { children, icon, iconColor } = props;

	const newProps = omit( props, "icon" );

	return (
		<IconLabelledBaseButton { ...newProps }>
			<SvgIcon icon={ icon } color={ iconColor } />
			{ children }
		</IconLabelledBaseButton>
	);
};

IconLabelledButton.propTypes = {
	type: PropTypes.string,
	icon: PropTypes.string.isRequired,
	iconColor: PropTypes.string,
	textColor: PropTypes.string,
	fontSize: PropTypes.string,
	backgroundColor: PropTypes.string,
	hoverColor: PropTypes.string,
	hoverBackgroundColor: PropTypes.string,
	activeBackgroundColor: PropTypes.string,
	focusBackgroundColor: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ),
};

IconLabelledButton.defaultProps = {
	type: "button",
	iconColor: colors.$color_blue,
	textColor: colors.$color_blue,
	fontSize: "inherit",
	backgroundColor: "transparent",
	hoverColor: colors.$color_blue,
	hoverBackgroundColor: null,
	activeBackgroundColor: null,
	focusBackgroundColor: null,
};
