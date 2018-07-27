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
	padding: 0 16px 16px;

	& > :first-child {
		margin-top: 0;
	}

	& > :last-child {
		margin-bottom: 0;
	}
`;

const StyledIconsButton = styled( IconsButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: ${ props => props.headingPadding };
	justify-content: flex-start;
	border: none;
	border-radius: 0;
	box-shadow: none;
	color: ${ props => props.headingColor };

	:hover {
		box-shadow: none;
		color: ${ props => props.headingColor };
	}

	:active {
		box-shadow: none;
		background-color: ${ colors.$color_white };
		color: ${ props => props.headingColor };
	}

	svg {
		${ props => props.hasSubTitle ? "align-self: flex-start;" : "" }
		&:first-child {
			margin-right: 8px;
		}
		&:last-child {
			margin-left: 8px;
		}
	}
`;

const StyledTitleContainer = styled.span`
	flex-grow: 1;
	overflow-x: hidden;
`;

const StyledTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	font-size: 1rem;
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
 * @param {string}      props.className             The name of the collapsible CSS class.
 * @param {IconsButton} props.Heading               Heading button. May be wrapped or styled or both.
 * @param {string}      props.headingColor          The button header text color.
 * @param {string}      props.headingPadding        The button header padding.
 * @param {boolean}     props.isOpen                True displays the children. False means collapsed.
 * @param {function}    props.onToggle              Function to handle the Heading click event.
 * @param {string}      props.prefixIcon            Heading icon before the title.
 * @param {string}      props.prefixIconCollapsed   Prefix icon when in collapsed state.
 * @param {string}      props.prefixIconColor       CSS color of the prefix icon.
 * @param {string}      props.prefixIconViewBox     The viewBox for the prefix SVG icon element.
 * @param {string}      props.subTitle              Sub-title for the Heading.
 * @param {string}      props.suffixIcon            Heading icon after the title.
 * @param {string}      props.suffixIconColor       CSS color of the suffix icon.
 * @param {string}      props.suffixIconCollapsed   Suffix icon when in collapsed state.
 * @param {string}      props.suffixIconViewBox     The viewBox for the suffix SVG icon element.
 * @param {string}      props.title                 Title for the Heading.
 * @param {string}      props.titleScreenReaderText Chance for an extra text to feed to a screenreader.
 *
 * @returns {ReactElement} A collapsible panel.
 */
export const CollapsibleStateless = ( props ) => {
	return (
		<StyledContainer
			// Pass the classname to allow re-styling with styled-components.
			className={ props.className }
		>
			<props.Heading
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				prefixIcon={ props.isOpen ? props.prefixIcon : props.prefixIconCollapsed }
				prefixIconColor={ props.prefixIconColor }
				suffixIcon={ props.isOpen ? props.suffixIcon : props.suffixIconCollapsed }
				suffixIconColor={ props.suffixIconColor }
				prefixIconViewBox={ props.prefixIconViewBox }
				suffixIconViewBox={ props.suffixIconViewBox }
				prefixIconSize={ props.prefixIconSize }
				suffixIconSize={ props.suffixIconSize }
				hasSubTitle={ !! props.subTitle }
				headingPadding={ props.headingPadding }
				headingColor={ props.headingColor }
			>
				<StyledTitleContainer>
					<StyledTitle>
						{ props.title }
						{ props.titleScreenReaderText ? <ScreenReaderText>{ " " + props.titleScreenReaderText }</ScreenReaderText> : null }
					</StyledTitle>
					{ props.subTitle && <StyledSubTitle>{ props.subTitle }</StyledSubTitle> }
				</StyledTitleContainer>
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
	className: PropTypes.string,
	Heading: PropTypes.func,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	prefixIcon: PropTypes.string,
	prefixIconCollapsed: PropTypes.string,
	prefixIconColor: PropTypes.string,
	prefixIconSize: PropTypes.string,
	prefixIconViewBox: PropTypes.string,
	suffixIcon: PropTypes.string,
	suffixIconCollapsed: PropTypes.string,
	suffixIconColor: PropTypes.string,
	suffixIconSize: PropTypes.string,
	suffixIconViewBox: PropTypes.string,
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
	headingPadding: PropTypes.string,
	headingColor: PropTypes.string,
};

CollapsibleStateless.defaultProps = {
	Heading: StyledHeading,
	prefixIconColor: colors.$black,
	suffixIconColor: colors.$black,
	headingPadding: "16px",
	headingColor: `${ colors.$color_black }`,
};

/**
 * Stateful collapsible panel. Optionally has a heading around the button.
 */
export class Collapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object}  props                       The properties for the component.
	 * @param {string}  props.className             The name of the collapsible CSS class.
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
		const { children, prefixIconViewBox, suffixIconViewBox } = this.props;

		const newProps = omit( this.props, [ "children" ] );

		return (
			<CollapsibleStateless
				Heading={ this.Heading }
				isOpen={ isOpen }
				onToggle={ this.toggleCollapse }
				{ ...newProps }
				prefixIconViewBox={ prefixIconViewBox }
				suffixIconViewBox={ suffixIconViewBox }
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
	className: PropTypes.string,
	headingLevel: PropTypes.number,
	initialIsOpen: PropTypes.bool,
	prefixIcon: PropTypes.string,
	prefixIconCollapsed: PropTypes.string,
	prefixIconColor: PropTypes.string,
	prefixIconViewBox: PropTypes.string,
	suffixIcon: PropTypes.string,
	suffixIconCollapsed: PropTypes.string,
	suffixIconColor: PropTypes.string,
	suffixIconViewBox: PropTypes.string,
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
};

Collapsible.defaultProps = {
	headingLevel: 2,
	initialIsOpen: false,
	prefixIconColor: colors.$black,
	suffixIcon: "arrow-up",
	suffixIconCollapsed: "arrow-down",
	suffixIconColor: colors.$black,
};

export default Collapsible;
