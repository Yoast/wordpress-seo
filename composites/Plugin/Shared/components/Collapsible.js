import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import omit from "lodash/omit";

import colors from "../../../../style-guide/colors.json";
import { IconsButton } from "../../Shared/components/Button";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";
import { SectionTitle } from "./SectionTitle";

const Content = styled.div`
	padding: 0 16px;
	margin-bottom: 16px;
`;

export const StyledContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

export const StyledContainerTopLevel = styled( StyledContainer )`
	border-top: 1px solid ${ colors.$color_border_gutenberg };
	border-bottom: 1px solid ${ colors.$color_border_gutenberg };
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
			${ getRtlStyle( "margin-right: 8px", "margin-left: 8px" ) };
		}
		&:last-child {
			${ getRtlStyle( "margin-left: 8px", "margin-right: 8px" ) };
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
export const CollapsibleStateless = ( props ) => {
	let children = null;
	if ( props.isOpen ) {
		children = ( props.hasPadding ) ? <Content>{ props.children }</Content> : props.children;
	}
	const Container = ( props.hasSeparator ) ? StyledContainerTopLevel : StyledContainer;

	return (
		<Container
			// Pass the classname to allow re-styling with styled-components.
			className={ props.className }
		>
			<props.Heading
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
};

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
};

CollapsibleStateless.defaultProps = {
	Heading: StyledHeading,
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
		const { level } = this.props.headingProps;

		if ( nextProps.headingProps.level !== level ) {
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
	 * @param {Object} props The properties for the component.
	 *
	 * @returns {ReactElement} The header to render.
	 */
	static getHeading( props ) {
		return wrapInHeading( StyledIconsButton, props.headingProps );
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
};

Collapsible.defaultProps = {
	hasSeparator: false,
	hasPadding: false,
	initialIsOpen: false,
	prefixIcon: null,
	prefixIconCollapsed: null,
	suffixIcon: {
		icon: "arrow-up",
		color: colors.$black,
		size: "9px",
	},
	suffixIconCollapsed: {
		icon: "arrow-down",
		color: colors.$black,
		size: "9px",
	},
	headingProps: {
		level: 2,
		fontSize: "1rem",
		fontWeight: "normal",
	},
};

export default Collapsible;
