import { useMemo } from "@wordpress/element";
import { Collapsible, StyledIconsButton } from "@yoast/components";
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

/**
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
const StyledHeaderRow = styled.h2`
	/*
	 * Repeats wrapInHeading's resets, because this element takes the place of the heading it would
	 * otherwise render. Written as longhands so the chevron's lane below can override just one side.
	 */
	margin: 0 !important;
	padding-block: 0 !important;
	padding-inline-start: 0 !important;
	font-size: 1rem !important;
	font-weight: normal !important;
	color: ${ colors.$color_headings } !important;

	position: relative;
	display: flex;
	align-items: center;
	// Reserve the suffix icon's lane so the title and the help link shrink before reaching it.
	padding-inline-end: 48px !important;

	&:hover {
		background-color: #f0f0f0;
	}

	// Anything that is not the toggle button, so in practice the help link.
	> :not(button) {
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
	}

	${ StyledIconsButton } {
		flex: 0 1 auto;
		min-width: 0;
		width: auto;
		background-color: transparent;
		// The help link brings its own leading gap, so the button ends at its title.
		padding-inline-end: 0;

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
			inset-inline-end: 16px;
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
 * @param {?React.ComponentType} [props.HeaderHelpLink=null] A component rendering a help link to show
 *        next to the title, before the suffix icon. It is a component rather than an element so its
 *        identity stays stable across renders: the heading is swapped for a custom one when it is set,
 *        and a heading that changed identity every render would remount the toggle button and drop
 *        focus.
 *
 * @returns {React.Component} A MetaboxCollapsible component
 */
const MetaboxCollapsible = ( { initialIsOpen = false, id = null, HeaderHelpLink = null, ...rest } ) => {
	const Heading = useMemo( () => {
		if ( ! HeaderHelpLink ) {
			return null;
		}

		/**
		 * The heading, with the toggle button and the help link as siblings.
		 *
		 * @param {Object} headingProps The props the Collapsible passes to its heading.
		 *
		 * @returns {JSX.Element} The heading.
		 */
		return function HeadingWithHelpLink( headingProps ) {
			return (
				<StyledHeaderRow>
					<StyledIconsButton { ...headingProps } />
					<HeaderHelpLink />
				</StyledHeaderRow>
			);
		};
	}, [ HeaderHelpLink ] );

	return <StyledMetaboxCollapsible
		hasPadding={ true }
		hasSeparator={ true }
		initialIsOpen={ initialIsOpen }
		id={ id }
		{ ...( Heading ? { Heading } : {} ) }
		{ ...rest }
	/>;
};

MetaboxCollapsible.propTypes = {
	initialIsOpen: PropTypes.bool,
	id: PropTypes.string,
	HeaderHelpLink: PropTypes.elementType,
};

export default MetaboxCollapsible;
