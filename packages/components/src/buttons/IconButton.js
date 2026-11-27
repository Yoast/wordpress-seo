// External dependencies.
import React from "react";
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
 * @param {Object} props Component props.
 * @param {string} props.icon The name of the icon.
 * @param {string} [props.iconColor="#000"] The color of the icon.
 * @param {(import("react").ReactNode[]|import("react").ReactNode|string)} [props.children] The text of the button.
 *
 * @returns {ReactElement} styled icon button.
 */
const IconButton = ( { iconColor = "#000", ...props } ) => {
	const { children: text, icon } = props;

	let IconComponent = SvgIcon;
	if ( text ) {
		IconComponent = addIconTextStyle( IconComponent );
	}

	const newProps = omit( { ...props, iconColor }, "icon" );

	return (
		<Button { ...newProps }>
			<IconComponent icon={ icon } color={ iconColor } />
			{ text }
		</Button>
	);
};

export default IconButton;
