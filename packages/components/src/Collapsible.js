import { getDirectionalStyle } from "@yoast/helpers";
import { colors, rgba } from "@yoast/style-guide";
import { omit } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import IconsButton from "./buttons/IconsButton";
import { SectionTitle, StyledTitle } from "./SectionTitle";

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
 * Header row that lets a help link sit next to the title, before the suffix icon.
 *
 * The link has to be a sibling of the toggle button: a link inside a button is invalid HTML, and a
 * click on it would open the link and toggle the panel at the same time. To make room for it the
 * button shrinks to its title, which costs the two behaviours the full-width button provided. Both
 * are restored here without a click handler on this row:
 *
 * - The button's `::after` covers the row, so clicks anywhere on it still reach the button. The help
 *   link is lifted above that overlay so it stays clickable.
 * - The suffix icon is pinned to this row's edge while remaining a child of the button, which keeps
 *   it inside the toggle's hit area and keeps integrations working that look the icon up and click
 *   its parent element to open a collapsible.
 *
 * The hover background belongs to the collapsible that renders this row, because the button no
 * longer spans the row and each collapsible picks its own colour.
 */
export const StyledHeaderRow = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	// Reserve the suffix icon's lane so the title and the help link shrink before reaching it.
	padding-inline-end: 48px;

	> h2 {
		flex: 0 1 auto;
		min-width: 0;
	}

	// Anything that is not the heading, so in practice the help link.
	> :not(h2) {
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
	}

	${ StyledIconsButton } {
		width: auto;
		background-color: transparent;
		// The help link brings its own leading gap, so the button ends at its title.
		padding-inline-end: 0;

		&::after {
			content: "";
			position: absolute;
			inset: 0;
		}

		/*
		 * The button only wraps its title now, so its own focus ring would cover part of the header
		 * instead of all of it. The overlay still spans the row, so it carries the ring instead.
		 */
		&:focus {
			outline: none;
			box-shadow: none;
		}

		&:focus::after {
			outline: 1px solid ${ colors.$color_blue };
			outline-offset: -1px;
			box-shadow: 0 0 3px ${ rgba( colors.$color_blue_dark, 0.8 ) };
		}

		> svg:last-child {
			position: absolute;
			inset-inline-end: 16px;
			top: 50%;
			transform: translateY(-50%);
			margin: 0;
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
		color: ${ props.color } !important;

		${StyledTitle} {
			font-weight: ${ props.fontWeight };
			color: ${ props.color };
		}
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
 * @param {string}      props.id                    The id for the Heading button.
 * @param {function}    props.renderNewBadgeLabel   Function to render a "New" badge label.
 * @param {boolean}     props.hasNewBadgeLabel      Whether to show a "New" badge label.
 * @param {ReactElement} props.headerHelpLink       A link rendered next to the title, before the suffix icon. It is a
 *                                                  sibling of the toggle button, never a child of it. Passing it wraps
 *                                                  the heading in StyledHeaderRow, which changes the header layout; when
 *                                                  it is absent the header markup is unchanged.
 *
 * @returns {ReactElement} A collapsible panel.
 */
export function CollapsibleStateless( props ) {
	const {
		children,
		className,
		hasPadding,
		hasSeparator,
		Heading,
		id,
		isOpen,
		onToggle,
		prefixIcon,
		prefixIconCollapsed,
		suffixIcon,
		suffixIconCollapsed,
		subTitle,
		title,
		titleScreenReaderText,
		renderNewBadgeLabel,
		hasNewBadgeLabel,
		headerHelpLink,
	} = props;

	let wrappedChildren = children;
	if ( isOpen && hasPadding ) {
		wrappedChildren = <Content className="collapsible_content">{ children }</Content>;
	}
	const Container = ( hasSeparator ) ? StyledContainerTopLevel : StyledContainer;

	const heading = (
		<Heading
			id={ id }
			aria-expanded={ isOpen }
			onClick={ onToggle }
			prefixIcon={ isOpen ? prefixIcon : prefixIconCollapsed }
			suffixIcon={ isOpen ? suffixIcon : suffixIconCollapsed }
			hasSubTitle={ !! subTitle }
		>
			<SectionTitle
				title={ title }
				titleScreenReaderText={ titleScreenReaderText }
				subTitle={ subTitle }
				renderNewBadgeLabel={ renderNewBadgeLabel }
				hasNewBadgeLabel={ hasNewBadgeLabel }
			/>
		</Heading>
	);

	return (
		<Container
			// Pass the classname to allow re-styling with styled-components.
			className={ className }
		>
			{ headerHelpLink
				? <StyledHeaderRow>{ heading }{ headerHelpLink }</StyledHeaderRow>
				: heading }
			{ wrappedChildren }
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
	renderNewBadgeLabel: PropTypes.func,
	hasNewBadgeLabel: PropTypes.bool,
	headerHelpLink: PropTypes.element,
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
	prefixIcon: null,
	prefixIconCollapsed: null,
	suffixIcon: null,
	suffixIconCollapsed: null,
	renderNewBadgeLabel: () => {},
	hasNewBadgeLabel: false,
	headerHelpLink: null,
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
	 * @param {ReactElement} props.headerHelpLink   A link rendered next to the title, before the suffix icon.
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
			props.headingProps.fontWeight !== state.headingProps.fontWeight ||
			props.headingProps.color !== state.headingProps.color
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
		color: PropTypes.string,
	} ),
	onToggle: PropTypes.func,
	renderNewBadgeLabel: PropTypes.func,
	hasNewBadgeLabel: PropTypes.bool,
	headerHelpLink: PropTypes.element,
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
		color: colors.$color_headings,
	},
	onToggle: null,
	renderNewBadgeLabel: () => {},
	hasNewBadgeLabel: false,
	headerHelpLink: null,
};

export default Collapsible;
