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
 * Heading that holds the toggle button and a help link side by side.
 *
 * This replaces the heading the Collapsible renders itself, so it repeats the resets that
 * wrapInHeading applies. The link has to be a sibling of the toggle button, never a child: a link
 * inside a button is invalid HTML, and one click would open the link and toggle the panel at once.
 *
 * Making room for the link costs the two behaviours the full-width button provided. Both come back
 * without a click handler on the heading:
 *
 * - The button's `::after` covers the whole heading, so clicks anywhere on it still reach the button,
 *   and it carries the focus ring so the indicator still frames the whole heading rather than just the
 *   title. The help link is lifted above that overlay so it stays clickable.
 * - The suffix icon is pinned to the heading's edge while remaining a child of the button, which keeps
 *   it inside the toggle's hit area and keeps integrations working that look the icon up and click its
 *   parent element to open a collapsible.
 */
/*
 * Where to pin the suffix icon. Pinning takes it out of the flow, so it has to land where the flow
 * would have put it: against the toggle button's end padding. That padding is set with a physical
 * `padding-left` above, so the end side measures 16px in LTR but 24px in RTL. Matching both keeps this
 * heading's icon lined up with the icon of every collapsible that has no help link.
 */
const suffixIconInset = getDirectionalStyle( "right: 16px", "left: 24px" );

const StyledHeaderRow = styled.h2`
	/*
	 * Repeats wrapInHeading's resets, because this element takes the place of the heading it would
	 * otherwise render. Written as longhands so the chevron's lane below can override just one side.
	 */
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
	// Reserve the suffix icon's lane so the title and the help link shrink before reaching it.
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
