import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

const BannerContents = styled.span`
	position: absolute;
	
	top: 8px;
	left: -8px;
	
	font-weight: 500;
	color: ${ props => props.textColor };
	line-height: 16px;
	
	background-color: ${ props => props.backgroundColor };
	padding: 8px 16px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
`;

const BannerTriangle = styled.span`
	position: absolute;
	
	top: 40px;
	left: -8px;
	
	/* This code makes the triangle. */
	border-top: 8px solid ${ colors.$color_purple_dark };
	border-left: 8px solid transparent;
`;

/**
 * The banner component.
 * @param {Object} props The props.
 * @returns {ReactElement} The banner element.
 * @constructor
 */
export default function Banner( props ) {
	return <Fragment>
		<BannerContents backgroundColor={ props.backgroundColor } textColor={ props.textColor }>
			{ props.children }
		</BannerContents>
		<BannerTriangle />
	</Fragment>;
}

Banner.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	children: PropTypes.any,
};

Banner.defaultProps = {
	backgroundColor: colors.$color_pink_dark,
	textColor: colors.$color_white,
	children: null,
};
