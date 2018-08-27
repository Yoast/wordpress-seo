import PropTypes from "prop-types";
import React from "react";

import {
	wrapInHeading,
	StyledIconsButton,
	StyledContainer,
	StyledContainerTopLevel,
} from "./Collapsible";
import { SectionTitle } from "./SectionTitle";

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
			onClick={ props.onClick }
			className={ props.className }
		>
			<props.Heading
				prefixIcon={ props.prefixIcon }
				suffixIcon={ props.suffixIcon }
				hasSubTitle={ !! props.subTitle }
			>
				<SectionTitle
					title={ props.title }
					titleScreenReaderText={ props.titleScreenReaderText }
					subTitle={ props.subTitle }
				/>
			</props.Heading>
		</Container>
	);
};

ButtonSection.propTypes = {
	hasSeparator: PropTypes.bool,
	className: PropTypes.string,
	Heading: PropTypes.func,
	prefixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	suffixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	subTitle: PropTypes.string,
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	onClick: PropTypes.func.isRequired,
};

ButtonSection.defaultProps = {
	Heading: StyledHeading,
};

export default ButtonSection;
