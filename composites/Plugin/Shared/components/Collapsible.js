import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import omit from "lodash/omit";

import colors from "../../../../style-guide/colors.json";
import { IconsButton } from "../../Shared/components/Button";
import ScreenReaderText from "../../../../a11y/ScreenReaderText";

const StyledContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

const StyledContent = styled.div`
	padding: 0 15px;
`;

const StyledIconsButton = styled( IconsButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 15px;
	justify-content: flex-start;
	border-color: transparent;
	border-radius: 0;
	box-shadow: none;
	color: ${ colors.$color_button_border_active };
	
	svg {
		&:first-child {
			margin-right: 8px;
		}
		&:last-child {
			margin-left: 8px;
		}
	}
`;

const StyledTitle = styled.span`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	-ms-flex-positive: 1;
	flex-grow: 1;
	font-size: 1.03em;
	font-weight: 600;
`;

/**
 * Wraps a component in a heading element with a defined heading level.
 *
 * @param {ReactElement} Component    The component to wrap.
 * @param {int}          headingLevel The heading level.
 *
 * @returns {Function} A function that will return the wrapped component with given properties.
 */
export function wrapInHeading( Component, headingLevel ) {
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

const StyledHeading = wrapInHeading( StyledIconsButton, 2 );

/**
 * Base collapsible panel. Optionally has a heading around the button.
 *
 * @param {object}      props                       The properties for the component.
 * @param {children}    props.children              The content of the Collapsible.
 * @param {IconsButton} props.Heading               Heading button. May be wrapped or styled or both.
 * @param {boolean}     props.isOpen                True displays the children. False means collapsed.
 * @param {function}    props.onToggle              Function to handle the Heading click event.
 * @param {string}      props.prefixIcon            Heading icon before the title.
 * @param {string}      props.prefixIconCollapsed   Prefix icon when in collapsed state.
 * @param {string}      props.prefixIconColor       CSS color of the prefix icon.
 * @param {string}      props.suffixIcon            Heading icon after the title.
 * @param {string}      props.suffixIconColor       CSS color of the suffix icon.
 * @param {string}      props.suffixIconCollapsed   Suffix icon when in collapsed state.
 * @param {string}      props.title                 Title for in the Heading.
 * @param {string}      props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
 *
 * @returns {ReactElement} A collapsible panel.
 */
export const CollapsibleStateless = ( props ) => {
	return (
		<StyledContainer>
			<props.Heading
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				prefixIcon={ props.isOpen ? props.prefixIcon : props.prefixIconCollapsed }
				prefixIconColor={ props.prefixIconColor }
				suffixIcon={ props.isOpen ? props.suffixIcon : props.suffixIconCollapsed }
				suffixIconColor={ props.suffixIconColor }
			>
				<StyledTitle>{ props.title }</StyledTitle>
				{ props.titleScreenReaderText ? <ScreenReaderText>{ props.titleScreenReaderText }</ScreenReaderText> : null }
			</props.Heading>
			{ props.isOpen && props.children }
		</StyledContainer>
	);
};

CollapsibleStateless.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	Heading: PropTypes.func,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	prefixIcon: PropTypes.string,
	prefixIconCollapsed: PropTypes.string,
	prefixIconColor: PropTypes.string,
	suffixIcon: PropTypes.string,
	suffixIconCollapsed: PropTypes.string,
	suffixIconColor: PropTypes.string,
	title: PropTypes.string,
	titleScreenReaderText: PropTypes.string,
};

CollapsibleStateless.defaultProps = {
	Heading: StyledHeading,
	prefixIconColor: colors.$black,
	suffixIconColor: colors.$black,
};

/**
 * Stateful collapsible panel. Optionally has a heading around the button.
 */
export class Collapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object}  props                       The properties for the component.
	 * @param {number}  props.headingLevel          Heading level: 1 for h1, 2 for h2, etc.
	 * @param {boolean} props.initialIsOpen         Determines if the initial isOpen state is open or closed.
	 * @param {string}  props.prefixIcon            Heading icon before the title.
	 * @param {string}  props.prefixIconCollapsed   Prefix icon when in collapsed state.
	 * @param {string}  props.prefixIconColor       CSS color of the prefix icon.
	 * @param {string}  props.suffixIcon            Heading icon after the title.
	 * @param {string}  props.suffixIconColor       CSS color of the suffix icon.
	 * @param {string}  props.suffixIconCollapsed   Suffix icon when in collapsed state.
	 * @param {string}  props.title                 Title for in the Heading.
	 * @param {string}  props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
	 *
	 * @returns {ReactElement} Base collapsible panel.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: props.initialIsOpen,
		};

		/*
		 * Evaluate if the button should be wrapped in a heading in this constructor
		 * instead of doing it in the render function to avoid a full re-render of the button,
		 * which is bad for accessibility.
		 */
		this.Heading = Collapsible.getHeading( props );
		this.toggleCollapse = this.toggleCollapse.bind( this );
	}

	/**
	 * Makes sure the heading element is correctly set.
	 *
	 * @param {Object} nextProps The upcoming props.
	 *
	 * @returns {void}
	 */
	componentWillReceiveProps( nextProps ) {
		const { headingLevel } = this.props;

		if ( nextProps.headingLevel !== headingLevel ) {
			this.Heading = Collapsible.getHeading( nextProps );
		}
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleCollapse() {
		const { isOpen } = this.state;

		this.setState( {
			isOpen: ! isOpen,
		} );
	}

	/**
	 * Creates the header by wrapping the IconsButton with a header.
	 *
	 * @param {object} props The properties for the component.
	 *
	 * @returns {ReactElement} The header to render.
	 */
	static getHeading( props ) {
		return wrapInHeading( StyledIconsButton, props.headingLevel );
	}

	/**
	 * Returns the rendered collapsible panel.
	 *
	 * @returns {ReactElement} The rendered collapsible panel.
	 */
	render() {
		const { isOpen } = this.state;
		const { children } = this.props;

		const newProps = omit( this.props, [ "children" ] );

		return (
			<CollapsibleStateless
				Heading={ this.Heading }
				isOpen={ isOpen }
				onToggle={ this.toggleCollapse }
				{ ...newProps }
			>
				{ isOpen && <StyledContent>{ children }</StyledContent> }
			</CollapsibleStateless>
		);
	}
}

Collapsible.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	headingLevel: PropTypes.number,
	initialIsOpen: PropTypes.bool,
	prefixIcon: PropTypes.string,
	prefixIconCollapsed: PropTypes.string,
	prefixIconColor: PropTypes.string,
	suffixIcon: PropTypes.string,
	suffixIconCollapsed: PropTypes.string,
	suffixIconColor: PropTypes.string,
	title: PropTypes.string,
	titleScreenReaderText: PropTypes.string,
};

Collapsible.defaultProps = {
	headingLevel: 3,
	initialIsOpen: false,
	prefixIconColor: colors.$black,
	suffixIcon: "arrow-up",
	suffixIconCollapsed: "arrow-down",
	suffixIconColor: colors.$black,
};

export default Collapsible;
