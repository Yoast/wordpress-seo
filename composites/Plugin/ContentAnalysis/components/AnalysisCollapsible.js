import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { angleUp, angleDown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import { IconButton } from "../../Shared/components/Button";

/**
 * Container for the Collapsible header and its content.
 */
const AnalysisHeaderContainer = styled.div`
	margin: 8px 0;
	background-color: ${ colors.$color_white };
`;

/**
 * The clickable component of the analysis header.
 */
const AnalysisHeaderButton = styled( IconButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 0;
	border-color: transparent;
	border-radius: 0;
	outline: none;
	box-shadow: none;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };

	:hover {
		border-color: transparent;
	}

	:active {
		box-shadow: none;
		background-color: ${ colors.$color_white };
	}

	svg {
		margin: 0 10px;
		width: 20px;
		height: 20px;
	}
`;

/**
 * The analysis header text.
 */
const AnalysisTitle = styled.span`
	margin: 8px 0;
	word-wrap: break-word;
	font-size: 1.25em;
	line-height: 1.25;
`;

/**
 * Analysis items list.
 */
const AnalysisList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 8px 16px;
`;

/**
 * A collapsible header used to show sets of analysis results. Expects list items as children.
 *
 * @param {object} props The properties for the component.
 * @returns {ReactElement} A collapsible analysisresult set.
 */
export const AnalysisCollapsibleStateless = ( props ) => {
	return (
		<AnalysisHeaderContainer>
			<AnalysisHeaderButton
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				icon={ props.isOpen ? angleUp : angleDown }
				iconColor={ colors.$color_grey_dark }
			>
				<AnalysisTitle>{ props.title + " (" + props.children.length + ")" }</AnalysisTitle>
			</AnalysisHeaderButton>
			{
				props.isOpen
				?	<AnalysisList role="list">
						{ props.children }
					</AnalysisList>
				: null
			}
		</AnalysisHeaderContainer>
	);
};

AnalysisCollapsibleStateless.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

export class AnalysisCollapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @constructor
	 *
	 * @param {Object} props The props to use.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: this.props.initialIsOpen,
		};

		this.toggleOpen = this.toggleOpen.bind( this );
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleOpen() {
		this.setState( {
			isOpen: ! this.state.isOpen,
		} );
	}

	/**
	 * Returns the rendered AnalysisCollapsible element.
	 *
	 * @returns {ReactElement} The rendered collapsible analysisHeader.
	 */
	render() {
		return (
			<AnalysisCollapsibleStateless
				title={ this.props.title }
				onToggle={ this.toggleOpen.bind( this ) }
				isOpen={ this.state.isOpen }
			>
				{ this.props.children }
			</AnalysisCollapsibleStateless>
		);
	}
}

AnalysisCollapsible.propTypes = {
	title: PropTypes.string.isRequired,
	initialIsOpen: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

AnalysisCollapsible.defaultProps = {
	initialIsOpen: false,
};

export default AnalysisCollapsible;
