import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import { IconsButton } from "../../Shared/components/Button";
import ScreenReaderText from "../../../../a11y/ScreenReaderText";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";

const StyledContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

const StyledContainerTopLevel = styled( StyledContainer )`
	border-top: 1px solid ${ colors.$palette_grey_light };
	border-bottom: 1px solid ${ colors.$palette_grey_light };
	margin-top: -1px;
`;

export const StyledIconsButton = styled( IconsButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 16px;
	justify-content: flex-start;
	border-color: transparent;
	border: none;
	border-radius: 0;
	box-shadow: none;

	:focus {
		outline: 1px solid ${ colors.$color_blue };
		outline-offset: -1px;
	}

	:active {
		box-shadow: none;
		background-color: ${ colors.$color_white };
	}

	svg {
		${ props => props.hasSubTitle ? "align-self: flex-start;" : "" }
		&:first-child {
			${ getRtlStyle( "margin-right: 8px", "margin-left: 8px" ) };
		}
		&:last-child {
			${ getRtlStyle( "margin-left: 8px", "margin-right: 8px" ) };
		}
	}
`;

const StyledTitleContainer = styled.span`
	flex-grow: 1;
	overflow-x: hidden;
	line-height: normal; // Avoid vertical scrollbar in IE 11 when rendered in the WP sidebar.
`;

const StyledTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
`;

const StyledSubTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	font-size: 0.8125rem;
	margin-top: 2px;
`;

/**
 * Wraps a component in a heading element with a defined heading level.
 *
 * @param {ReactElement} Component        The component to wrap.
 * @param {Object}       props            The heading props.
 * @param {number}       props.level      The heading level.
 * @param {string}       props.fontSize   The heading font-size.
 * @param {string}       props.fontWeight The heading font-weight.
 *
 * @returns {Function} A function that will return the wrapped component with given properties.
 */
export function wrapInHeading( Component, props ) {
	const Heading = `h${ props.level }`;
	const StyledHeading = styled( Heading )`
		margin: 0 !important;
		padding: 0 !important;
		font-size: ${ props.fontSize } !important;
		font-weight: ${ props.fontWeight } !important;
	`;

	return function Wrapped( props ) {
		return (
			<StyledHeading>
				<Component { ...props } />
			</StyledHeading>
		);
	};
}

const StyledHeading = wrapInHeading( StyledIconsButton, { level: 2, fontSize: "1rem", fontWeight: "normal" } );

/**
 * Base panel. Optionally has a heading around the button.
 *
 * @param {Object}      props                       The properties for the component.
 * @param {string}      props.className             The name of the CSS class used for alternate styling.
 * @param {IconsButton} props.Heading               Heading button. May be wrapped or styled or both.
 * @param {boolean}     props.hasSeparator          True displays borders around the section. False means no borders.
 * @param {Object}      props.prefixIcon            Heading icon before the title.
 * @param {string}      props.subTitle              Sub-title for the Heading.
 * @param {Object}      props.suffixIcon            Heading icon after the title.
 * @param {string}      props.title                 Title for the Heading.
 * @param {string}      props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
 *
 * @returns {ReactElement} A panel that can be clicked to open a modal.
 */
export const ButtonSection = ( props ) => {
	const Container = ( props.hasSeparator ) ? StyledContainerTopLevel : StyledContainer;

	return (
		<Container
			// Pass the classname to allow re-styling with styled-components.
			className={ props.className }
		>
			<props.Heading
				prefixIcon={ props.prefixIcon }
				suffixIcon={ props.suffixIcon }
				hasSubTitle={ !! props.subTitle }
			>
				<StyledTitleContainer>
					<StyledTitle>
						{ props.title }
						{ props.titleScreenReaderText && <ScreenReaderText>{ " " + props.titleScreenReaderText }</ScreenReaderText> }
					</StyledTitle>
					{ props.subTitle && <StyledSubTitle>{ props.subTitle }</StyledSubTitle> }
				</StyledTitleContainer>
			</props.Heading>
		</Container>
	);
};

ButtonSection.propTypes = {
	className: PropTypes.string,
	Heading: PropTypes.func,
	isOpen: PropTypes.bool.isRequired,
	hasSeparator: PropTypes.bool,
	hasPadding: PropTypes.bool,
	prefixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	subTitle: PropTypes.string,
	suffixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
};

ButtonSection.defaultProps = {
	Heading: StyledHeading,
};

export default ButtonSection;
