// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import omit from "lodash/omit";

// Yoast dependencies.
import { getDirectionalStyle } from "@yoast/helpers";

// Internal dependencies.
import { default as Button } from "./Button";
import { SvgIcon } from "../index";

/**
 * Applies styles to SvgIcon for IconButton with text.
 *
 * @param {ReactElement} icon The original SvgIcon.
 *
 * @returns {ReactElement} SvgIcon with text styles applied.
 */
function addIconTextStyle( icon ) {
	return styled( icon )`
		margin: ${ getDirectionalStyle( "0 8px 0 0", "0 0 0 8px" ) };
		flex-shrink: 0;
	`;
}

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled icon button.
 */
const IconButton = ( props ) => {
	const { children: text, icon, iconColor } = props;

	let IconComponent = SvgIcon;
	if ( text ) {
		IconComponent = addIconTextStyle( IconComponent );
	}

	const newProps = omit( props, "icon" );

	return (
		<Button { ...newProps }>
			<IconComponent icon={ icon } color={ iconColor } />
			{ text }
		</Button>
	);
};

IconButton.propTypes = {
	icon: PropTypes.string.isRequired,
	iconColor: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ),
};

IconButton.defaultProps = {
	iconColor: "#000",
};

export default IconButton;
