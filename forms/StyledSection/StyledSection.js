import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Section from "../Section";
import Heading from "../../composites/basic/Heading";
import colors from "../../style-guide/colors.json";
import { rgba } from "../../style-guide/helpers";
import SvgIcon from "../../composites/Plugin/Shared/components/SvgIcon";

export const StyledHeading = styled( Heading )``;

export const StyledIcon = styled( SvgIcon )``;

export const StyledSectionBase = styled( Section )`
	box-shadow: 0 1px 2px ${ rgba( colors.$color_black, 0.2 ) };
	background-color: ${ colors.$color_white };
	padding-right: 20px
	padding-left: 20px
	padding-bottom: ${ props => props.headingText ? "0" : "10px" } 
	padding-top: ${ props => props.headingText ? "0" : "10px" } 

	*, & {
		box-sizing: border-box;

		&:before, &:after {
			box-sizing: border-box;
		}
	}

	& ${ StyledHeading } {
		display: flex;
		align-items: center;
		padding: 8px 0 0;
		font-size: 1rem;
		line-height: 1.5;
		margin: 0 0 16px;
		font-family: "Open Sans", sans-serif;
		font-weight: 300;
		color: ${ props => props.headingColor ? props.headingColor : `${ colors.$color_grey_dark }` };
	}

	& ${ StyledIcon } {
		flex: 0 0 auto;
		margin-right: 8px;
	}
`;

/**
 * Creates a styled section within the page.
 *
 * @param {Object} props The props to use.
 * @returns {ReactElement} The rendered component.
 */
const StyledSection = ( props ) => {
	return (
		<StyledSectionBase
			className={ props.className }
			headingColor={ props.headingColor }
		>
			{ props.headingText &&
				<StyledHeading
					level={ props.headingLevel }
					className={ props.headingClassName }
				>
					{ props.headingIcon &&
						<StyledIcon
							icon={ props.headingIcon }
							color={ props.headingIconColor }
							size={ props.headingIconSize }
						/>
					}
					{ props.headingText }
				</StyledHeading>
			}
			{ props.children }
		</StyledSectionBase>
	);
};

StyledSection.propTypes = {
	className: PropTypes.string,
	headingLevel: PropTypes.number,
	headingClassName: PropTypes.string,
	headingColor: PropTypes.string,
	headingIcon: PropTypes.string,
	headingIconColor: PropTypes.string,
	headingIconSize: PropTypes.string,
	headingText: PropTypes.string,
	children: PropTypes.any,
};

StyledSection.defaultProps = {
	className: "yoast-section",
	headingLevel: 2,
};

export default StyledSection;
