import { useMemo, useRef } from "@wordpress/element";
import { Collapsible, StyledIconsButton, StyledTitle } from "@yoast/components";
import { getDirectionalStyle } from "@yoast/helpers";
import { colors, rgba } from "@yoast/style-guide";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledMetaboxCollapsible = styled( Collapsible )`
	h2 > button {
		padding-left: 24px;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}

	div[class^="collapsible_content"] {
		padding: 24px 0;
		margin: 0 24px;
		border-top: 1px solid rgba(0,0,0,0.2);
	}

`;

/*
 * Pins the suffix icon against the button's end padding, which is physical: 16px in LTR, 24px in RTL.
 * Matching it lines the icon up with the collapsibles that have no help link.
 */
const suffixIconInset = getDirectionalStyle( "right: 16px", "left: 24px" );

/*
 * Heading holding the toggle button and a help link side by side, in place of the one the Collapsible
 * wraps itself, hence the headingProps and the resets below.
 *
 * The link is a sibling of the button, never a child: a link in a button is invalid HTML, and one click
 * would do both. The button then ends at its title, so its `::after` spans the row for the rest of the
 * click area and the focus ring, and the suffix icon is only moved with CSS, so it stays in the button.
 */
const StyledHeaderRow = styled.h2`
	// wrapInHeading's resets, as longhands so the icon's lane below can override one side.
	margin: 0 !important;
	padding-block: 0 !important;
	padding-inline-start: 0 !important;
	font-size: ${ props => props.headingProps.fontSize } !important;
	font-weight: ${ props => props.headingProps.fontWeight } !important;
	color: ${ props => props.headingProps.color } !important;

	${ StyledTitle } {
		font-weight: ${ props => props.headingProps.fontWeight };
		color: ${ props => props.headingProps.color };
	}

	position: relative;
	display: flex;
	align-items: center;
	// The suffix icon's lane, so the title and the link shrink before reaching it.
	padding-inline-end: 48px !important;

	&:hover {
		background-color: #f0f0f0;
	}

	// The link's wrapper, above the button's overlay so the link stays clickable.
	> span {
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
	}

	${ StyledIconsButton } {
		flex: 0 1 auto;
		min-width: 0;
		width: auto;
		/*
		 * Restates the shared h2 > button padding instead of inheriting a selector this heading does not
		 * own. Physical on purpose: the collapsibles it has to line up with are padded physically too.
		 */
		padding-block-start: 16px;
		${ getDirectionalStyle( "padding-left: 24px", "padding-right: 16px" ) };
		// The help link brings its own leading gap, so the button ends at its title.
		padding-inline-end: 0;
		// Only the heading paints the hover, so it covers the row in one even color.
		background-color: transparent;

		&:hover {
			background-color: transparent;
		}

		&::after {
			content: "";
			position: absolute;
			inset: 0;
		}

		/*
		 * The ring moves to the overlay, because on the button it would frame the title alone. It cannot
		 * be reused: elsewhere it is the browser's own, which no pseudo-element can draw. Colors from Button.js.
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
			${ suffixIconInset };
			top: 50%;
			transform: translateY(-50%);
			margin: 0;
		}
	}
`;

/**
 * The MetaboxCollapsible.
 *
 * @param {Object} props The props
 * @param {boolean} [props.initialIsOpen=false] Whether the collapsible should be open by default
 * @param {?string} [props.id=null] The id of the collapsible
 * @param {Object} [props.headingProps] The typography of the heading, as the Collapsible defines it
 * @param {?React.ComponentType} [props.HeaderHelpLink=null] Renders a help link after the title, before the
 *        suffix icon. A component rather than an element, because the heading composes it itself.
 *
 * @returns {React.Component} A MetaboxCollapsible component
 */
const MetaboxCollapsible = ( {
	initialIsOpen = false,
	id = null,
	HeaderHelpLink = null,
	headingProps = Collapsible.defaultProps.headingProps,
	...rest
} ) => {
	/*
	 * Read through refs, so the heading keeps its identity even when these props get a new reference.
	 * A heading that changed identity would remount the toggle button and drop focus.
	 */
	const HeaderHelpLinkRef = useRef( HeaderHelpLink );
	HeaderHelpLinkRef.current = HeaderHelpLink;
	const headingPropsRef = useRef( headingProps );
	headingPropsRef.current = headingProps;

	// Only the presence of a help link changes the heading, and that does not change after mount.
	const hasHeaderHelpLink = Boolean( HeaderHelpLink );

	const Heading = useMemo( () => {
		if ( ! hasHeaderHelpLink ) {
			return null;
		}

		/**
		 * The heading, with the toggle button and the help link as siblings.
		 *
		 * @param {Object} buttonProps The props the Collapsible passes to its heading.
		 *
		 * @returns {JSX.Element} The heading.
		 */
		return function HeadingWithHelpLink( buttonProps ) {
			const CurrentHeaderHelpLink = HeaderHelpLinkRef.current;

			return (
				// Always an h2, like every other metabox collapsible.
				<StyledHeaderRow headingProps={ headingPropsRef.current }>
					<StyledIconsButton { ...buttonProps } />
					<span><CurrentHeaderHelpLink /></span>
				</StyledHeaderRow>
			);
		};
	}, [ hasHeaderHelpLink ] );

	return <StyledMetaboxCollapsible
		hasPadding={ true }
		hasSeparator={ true }
		initialIsOpen={ initialIsOpen }
		id={ id }
		headingProps={ headingProps }
		{ ...( Heading ? { Heading } : {} ) }
		{ ...rest }
	/>;
};

MetaboxCollapsible.propTypes = {
	initialIsOpen: PropTypes.bool,
	id: PropTypes.string,
	HeaderHelpLink: PropTypes.elementType,
	headingProps: PropTypes.shape( {
		level: PropTypes.number,
		fontSize: PropTypes.string,
		fontWeight: PropTypes.string,
		color: PropTypes.string,
	} ),
};

export default MetaboxCollapsible;
