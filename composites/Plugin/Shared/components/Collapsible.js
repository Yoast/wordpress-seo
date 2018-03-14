import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import { IconsButton } from "../../Shared/components/Button";

const HeaderContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

const HeaderButton = styled( IconsButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 3px 6px;
	border-color: transparent;
	border-radius: 0;
	outline: none;
	justify-content: flex-start;
	box-shadow: none;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };

	:hover {
		border-color: transparent;
		color: ${ colors.$color_blue };
	}

	:active {
		box-shadow: none;
		background-color: ${ colors.$color_white };
		color: ${ colors.$color_blue };
	}
`;

const Title = styled.span`
	margin: 8px;
	word-wrap: break-word;
	font-size: 1.25em;
	line-height: 1.25;
	-ms-flex-positive: 1;
	flex-grow: 1;
`;

/**
 * Wraps a component in a heading element with a defined heading level.
 *
 * @param {ReactElement} Component    The component to wrap.
 * @param {int}          headingLevel The heading level.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInHeading( Component, headingLevel ) {
	const Heading = `h${ headingLevel }`;
	const StyledHeading = styled( Heading )`
		margin: 0;
		font-weight: normal;
	`;

	return function Wrapped( props ) {
		return (
			<StyledHeading>
				<Component { ...props } />
			</StyledHeading>
		);
	};
}

/**
 * A collapsible panel with a header.
 * Optionally has a heading around the button.
 *
 * @param {object} props The properties for the component.
 *
 * @returns {ReactElement} A collapsible panel.
 */
export const CollapsibleStateless = ( props ) => {
	return (
		<HeaderContainer>
			<props.element
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				prefixIcon={ "circle" }
				prefixIconColor={ colors.$color_red }
				suffixIcon={ props.isOpen ? "angle-down" : "angle-right" }
				suffixIconColor={ colors.$color_grey_dark } >
				<Title>{ props.title }</Title>
			</props.element>
			{ props.isOpen && props.children }
		</HeaderContainer>
	);
};

CollapsibleStateless.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	hasHeading: PropTypes.bool,
	headingLevel: PropTypes.number,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	element: PropTypes.func,
};

CollapsibleStateless.defaultProps = {
	hasHeading: false,
	headingLevel: 2,
};

export class Collapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The props to use.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: null,
		};

		this.toggleOpen = this.toggleOpen.bind( this );

		/*
		 * Evaluate if the button should be wrapped in a heading in this constructor
		 * instead of doing it in the CollapsibleStateless component to
		 * avoid a full re-render of the button, which is bad for accessibility.
		 */
		this.element = props.hasHeading ? wrapInHeading( HeaderButton, props.headingLevel ) : HeaderButton;
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleOpen() {
		this.setState( {
			isOpen: ! this.isOpen(),
		} );
	}

	/**
	 * Returns whether or not the collapsible should be rendered open or closed.
	 *
	 * @returns {boolean} Whether or not this component is open.
	 */
	isOpen() {
		// When `isOpen` is null then the user has never opened or closed the collapsible.
		if ( this.state.isOpen === null ) {
			return this.props.initialIsOpen;
		}

		return this.state.isOpen === true;
	}

	/**
	 * Returns the rendered Collapsible element.
	 *
	 * @returns {ReactElement} The rendered collapsible analysisHeader.
	 */
	render() {
		return (
			<CollapsibleStateless
				title={ this.props.title }
				onToggle={ this.toggleOpen.bind( this ) }
				isOpen={ this.isOpen() }
				hasHeading={ this.props.hasHeading }
				headingLevel={ this.props.headingLevel }
				element={ this.element }
			>
				{ this.props.children }
			</CollapsibleStateless>
		);
	}
}

Collapsible.propTypes = {
	title: PropTypes.string.isRequired,
	initialIsOpen: PropTypes.bool,
	hasHeading: PropTypes.bool,
	headingLevel: PropTypes.number,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

Collapsible.defaultProps = {
	initialIsOpen: true,
	hasHeading: false,
	headingLevel: 2,
};

export default Collapsible;
