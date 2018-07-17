import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { getChildrenCount } from "../../../../utils/reactUtils";
import colors from "../../../../style-guide/colors.json";
import { IconsButton } from "../../Shared/components/Button";
import { CollapsibleStateless, wrapInHeading } from "../../Shared/components/Collapsible";

const StyledIconsButton = styled( IconsButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 0;
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

	svg {
		margin: 0 8px 0 -5px; // (icon 20 + button border 1) - 5 = 16 for the 8px grid
		padding-bottom: 2px;
		width: 20px;
		height: 20px;
	}
	
	span {
		margin: 8px 0;
		word-wrap: break-word;
		font-size: 1em;
		line-height: 1.25;
		font-weight: inherit;
		color: ${ colors.$color_snippet_focus }
	}
`;

const StyledHeading = wrapInHeading( StyledIconsButton, 2 );

const AnalysisList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0 16px 0 0;
`;

/**
 * A collapsible header used to show sets of analysis results. Expects list items as children.
 * Optionally has a heading around the button.
 *
 * @param {object} props The properties for the component.
 *
 * @returns {ReactElement} A collapsible analysisresult set.
 */
export const AnalysisCollapsibleStateless = ( props ) => {
	let count = getChildrenCount( props.children );

	return (
		<CollapsibleStateless
			Heading={ props.Heading }
			isOpen={ props.isOpen }
			onToggle={ props.onToggle }
			prefixIcon="angle-up"
			prefixIconCollapsed="angle-down"
			prefixIconColor={ colors.$color_grey_dark }
			title={ `${ props.title } (${ count })` }
		>
			<AnalysisList role="list">{ props.children }</AnalysisList>
		</CollapsibleStateless>
	);
};

AnalysisCollapsibleStateless.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	Heading: PropTypes.func,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
};

AnalysisCollapsibleStateless.defaultProps = {
	Heading: StyledHeading,
};

export class AnalysisCollapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The properties for the component.
	 *
	 * @returns {ReactElement} The analysis collapsible panel.
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
		this.Heading = AnalysisCollapsible.getHeading( props );
		this.toggleOpen = this.toggleOpen.bind( this );
	}

	/**
	 * Before receiving props makes sure the heading is set correctly.
	 *
	 * @param {Object} nextProps The props this component will receive.
	 *
	 * @returns {void}
	 */
	componentWillReceiveProps( nextProps ) {
		const { headingLevel } = this.props;

		if ( nextProps.headingLevel !== headingLevel ) {
			this.Heading = AnalysisCollapsible.getHeading( nextProps );
		}
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleOpen() {
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
	 * Returns the rendered AnalysisCollapsible element.
	 *
	 * @returns {ReactElement} The rendered collapsible analysisHeader.
	 */
	render() {
		const { isOpen } = this.state;
		const { children, title } = this.props;

		return (
			<AnalysisCollapsibleStateless
				Heading={ this.Heading }
				isOpen={ isOpen }
				onToggle={ this.toggleOpen }
				title={ title }
			>
				{ children }
			</AnalysisCollapsibleStateless>
		);
	}
}

AnalysisCollapsible.propTypes = {
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	initialIsOpen: PropTypes.bool,
	headingLevel: PropTypes.number,
	title: PropTypes.string.isRequired,
};

AnalysisCollapsible.defaultProps = {
	initialIsOpen: true,
	headingLevel: 2,
};

export default AnalysisCollapsible;
