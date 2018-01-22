import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Section from "../Section";
import Heading from "../../composites/basic/Heading";
import colors from "../../style-guide/colors.json";
import { rgba } from "../../style-guide/helpers";
import { Icon } from "../../composites/Plugin/Shared/components/Icon";
import * as icons from "../../style-guide/svg";

const StyledSectionBase = styled( Section )`
	box-shadow: 0 1px 2px ${ rgba( colors.$color_black, 0.2 ) };
	position: relative;
	background-color: ${ colors.$color_white };
	background-image: url( svg-icon-file-text-o( ${ colors.$color_black } ) );
	padding: 0 20px 15px;

	*, & {
		box-sizing: border-box;

		&:before, &:after {
			box-sizing: border-box;
		}
	}
`;

const StyledHeading = styled( Heading )`
	padding: 8px 20px;
	font-size: 0.9rem;
	margin: 0 -20px 15px;
	font-family: "Open Sans", sans-serif;
	font-weight: 300;
	color: ${ colors.$color_grey_dark };
`;

const StyledIcon = styled( Icon )`
	vertical-align: middle;
	margin-right: 8px;
`;

/**
 * Represents a visual section within the page.
 *
 * @param {Object} props The props for this component.
 * @returns {ReactElement} The rendered component.
 */
const StyledSection = ( props ) => {
	return (
		<StyledSectionBase
			className={ props.className }
			styled={ true }
		>
			<StyledHeading
				level={ props.headingLevel }
				headingText={ props.title }
				headingIcon={ props.headingIcon }
				headingIconColor={ props.headingIconColor }
				headingIconSize={ props.headingIconSize }
				headingClassName={ props.headingClassName }
			>
				{ props.headingIcon && <StyledIcon
					icon={ icons[ `${ props.headingIcon }` ] }
					color={ props.headingIconColor }
					size={ props.headingIconSize }
					/>
				}
				{ props.title }
			</StyledHeading>
			{ props.sectionContent }
			{ props.children }
		</StyledSectionBase>
	);
};

StyledSection.propTypes = {
	styled: PropTypes.bool,
	className: PropTypes.string,
	title: PropTypes.string.isRequired,
	headingIcon: PropTypes.string,
	headingIconColor: PropTypes.string,
	headingIconSize: PropTypes.string,
	headingLevel: PropTypes.number,
	headingClassName: PropTypes.string,
	sectionContent: PropTypes.element.isRequired,
	children: PropTypes.any,
};

StyledSection.defaultProps = {
	className: "yoast-section",
	headingLevel: 2,
	headingClassName: "yoast-section__heading yoast-section__heading-icon",
};

export default StyledSection;
