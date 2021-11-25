import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";
import { omit } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import IconsButton from "./buttons/IconsButton";
import { SectionTitle } from "./SectionTitle";

const Content = styled.div`
	padding: 0 16px;
	margin-bottom: 16px;
`;

export const StyledContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

export const StyledContainerTopLevel = styled( StyledContainer )`
	border-top: var(--yoast-border-default);
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
	font-weight: normal;

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
			${ getDirectionalStyle( "margin-right: 8px", "margin-left: 8px" ) };
		}
		&:last-child {
			${ getDirectionalStyle( "margin-left: 8px", "margin-right: 8px" ) };
		}
	}
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
	const headingLevel = `h${ props.level }`;
	const StyledHeadingLevel = styled( headingLevel )`
		margin: 0 !important;
		padding: 0 !important;
		font-size: ${ props.fontSize } !important;
		font-weight: ${ props.fontWeight } !important;
	`;

	return function Wrapped( componentProps ) {
		return (
			<StyledHeadingLevel>
				<Component { ...componentProps } />
			</StyledHeadingLevel>
		);
	};
}

const StyledHeading = wrapInHeading( StyledIconsButton, { level: 2, fontSize: "1rem", fontWeight: "normal" } );

/**
 * Base collapsible panel. Optionally has a heading around the button.
 *
 * @param {Object}      props                       The properties for the component.
 * @param {children}    props.children              The content of the Collapsible.
 * @param {string}      props.className             The name of the collapsible CSS class.
 * @param {IconsButton} props.Heading               Heading button. May be wrapped or styled or both.
 * @param {boolean}     props.isOpen                True displays the children. False means collapsed.
 * @param {boolean}     props.hasPadding            True adds padding to the content. False means no padding.
 * @param {boolean}     props.hasSeparator          True displays borders around the section. False means no borders.
 * @param {function}    props.onToggle              Function to handle the Heading click event.
 * @param {Object}      props.prefixIcon            Heading icon before the title.
 * @param {Object}      props.prefixIconCollapsed   Prefix icon when in collapsed state.
 * @param {string}      props.subTitle              Sub-title for the Heading.
 * @param {Object}      props.suffixIcon            Heading icon after the title.
 * @param {Object}      props.suffixIconCollapsed   Suffix icon when in collapsed state.
 * @param {string}      props.title                 Title for the Heading.
 * @param {string}      props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
 *
 * @returns {ReactElement} A collapsible panel.
 */
export function CollapsibleStateless( props ) {
	let children = null;
	if ( props.isOpen ) {
		children = ( props.hasPadding ) ? <Content className="collapsible_content">{ props.children }</Content> : props.children;
	}
	const Container = ( props.hasSeparator ) ? StyledContainerTopLevel : StyledContainer;

	return (
		<Container
			// Pass the classname to allow re-styling with styled-components.
			className={ props.className }
		>
			<props.Heading
				id={ props.id }
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				prefixIcon={ props.isOpen ? props.prefixIcon : props.prefixIconCollapsed }
				suffixIcon={ props.isOpen ? props.suffixIcon : props.suffixIconCollapsed }
				hasSubTitle={ !! props.subTitle }
			>
				<SectionTitle
					title={ props.title }
					titleScreenReaderText={ props.titleScreenReaderText }
					subTitle={ props.subTitle }
				/>
			</props.Heading>
			{ children }
		</Container>
	);
}

CollapsibleStateless.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	className: PropTypes.string,
	Heading: PropTypes.func,
	isOpen: PropTypes.bool.isRequired,
	hasSeparator: PropTypes.bool,
	hasPadding: PropTypes.bool,
	initialIsOpen: PropTypes.bool,
	onToggle: PropTypes.func.isRequired,
	prefixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	prefixIconCollapsed: PropTypes.shape( {
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
	suffixIconCollapsed: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	id: PropTypes.string,
};

CollapsibleStateless.defaultProps = {
	Heading: StyledHeading,
	id: null,
	children: null,
	className: null,
	subTitle: null,
	titleScreenReaderText: null,
	hasSeparator: false,
	hasPadding: false,
	initialIsOpen: false,
	prefixIcon: null,
	prefixIconCollapsed: null,
	suffixIcon: null,
	suffixIconCollapsed: null,
};

/**
 * Stateful collapsible panel. Optionally has a heading around the button.
 */
export class Collapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object}  props                       The properties for the component.
	 * @param {string}  props.className             The name of the collapsible CSS class.
	 * @param {Object}  props.headingProps          Props to use in the Heading.
	 * @param {boolean} props.initialIsOpen         Determines if the initial isOpen state is open or closed.
	 * @param {Object}  props.prefixIcon            Heading icon before the title.
	 * @param {Object}  props.prefixIconCollapsed   Prefix icon when in collapsed state.
	 * @param {Object}  props.suffixIcon            Heading icon after the title.
	 * @param {Object}  props.suffixIconCollapsed   Suffix icon when in collapsed state.
	 * @param {string}  props.title                 Title for in the Heading.
	 * @param {string}  props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
	 *
	 * @returns {ReactElement} Base collapsible panel.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: props.initialIsOpen,
			// Keep to compare incoming change.
			headingProps: props.headingProps,
			/*
			 * Evaluate if the button should be wrapped in a heading in this constructor
			 * instead of doing it in the render function to avoid a full re-render of the button,
			 * which is bad for accessibility.
			 */
			Heading: wrapInHeading( StyledIconsButton, props.headingProps ),
		};

		this.toggleCollapse = this.toggleCollapse.bind( this );
	}

	/**
	 * Makes sure the heading element is correctly set.
	 *
	 * @param {Object} props The upcoming props.
	 * @param {Object} state The current state.
	 *
	 * @returns {Object|null} The new state or null if unchanged.
	 */
	static getDerivedStateFromProps( props, state ) {
		if (
			props.headingProps.level !== state.headingProps.level ||
			props.headingProps.fontSize !== state.headingProps.fontSize ||
			props.headingProps.fontWeight !== state.headingProps.fontWeight
		) {
			return {
				...state,
				headingProps: props.headingProps,
				Heading: wrapInHeading( StyledIconsButton, props.headingProps ),
			};
		}
		return null;
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleCollapse() {
		const { isOpen } = this.state;
		const { onToggle } = this.props;

		if ( ! onToggle || onToggle( isOpen ) !== false ) {
			this.setState( {
				isOpen: ! isOpen,
			} );
		}
	}

	/**
	 * Returns the rendered collapsible panel.
	 *
	 * @returns {ReactElement} The rendered collapsible panel.
	 */
	render() {
		const { isOpen } = this.state;
		const { children } = this.props;

		const newProps = omit( this.props, [ "children", "onToggle" ] );

		return (
			<CollapsibleStateless
				Heading={ this.state.Heading }
				isOpen={ isOpen }
				onToggle={ this.toggleCollapse }
				{ ...newProps }
			>
				{ isOpen && children }
			</CollapsibleStateless>
		);
	}
}

Collapsible.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	className: PropTypes.string,
	initialIsOpen: PropTypes.bool,
	hasSeparator: PropTypes.bool,
	hasPadding: PropTypes.bool,
	prefixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	prefixIconCollapsed: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	suffixIcon: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	suffixIconCollapsed: PropTypes.shape( {
		icon: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.string,
	} ),
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
	headingProps: PropTypes.shape( {
		level: PropTypes.number,
		fontSize: PropTypes.string,
		fontWeight: PropTypes.string,
	} ),
	onToggle: PropTypes.func,
};

Collapsible.defaultProps = {
	hasSeparator: false,
	hasPadding: false,
	initialIsOpen: false,
	subTitle: null,
	titleScreenReaderText: null,
	children: null,
	className: null,
	prefixIcon: null,
	prefixIconCollapsed: null,
	suffixIcon: {
		icon: "chevron-up",
		color: colors.$black,
		size: "24px",
	},
	suffixIconCollapsed: {
		icon: "chevron-down",
		color: colors.$black,
		size: "24px",
	},
	headingProps: {
		level: 2,
		fontSize: "1rem",
		fontWeight: "normal",
	},
	onToggle: null,
};

export default Collapsible;
