import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { getChildrenCount } from "../../../../utils/reactUtils";
import { angleUp, angleDown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import { IconButton } from "../../Shared/components/Button";

const AnalysisHeaderContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

const AnalysisHeaderButton = styled( IconButton )`
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
		margin: 0 8px;
		width: 20px;
		height: 20px;
	}
`;

const AnalysisTitle = styled.span`
	margin: 8px 0;
	word-wrap: break-word;
	font-size: 1.25em;
	line-height: 1.25;
`;

const AnalysisList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0 16px 0 13px;
`;

/**
 * Wraps a component in a heading element with a defined heading level.
 *
 * @param {ReactElement} Component    The component to wrap.
 * @param {int}          headingLevel The heading level.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInHeading( Component, headingLevel ) {
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

/**
 * A collapsible header used to show sets of analysis results. Expects list items as children.
 * Optionally has a heading around the button.
 *
 * @param {object} props The properties for the component.
 *
 * @returns {ReactElement} A collapsible analysisresult set.
 */
export const AnalysisCollapsibleStateless = ( props ) => {
	let title = props.title;
	let count = getChildrenCount( props.children );

	const Button = props.hasHeading ? wrapInHeading( AnalysisHeaderButton, props.headingLevel ) : AnalysisHeaderButton;

	return (
		<AnalysisHeaderContainer>
			<Button
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				icon={ props.isOpen ? angleUp : angleDown }
				iconColor={ colors.$color_grey_dark } >
				<AnalysisTitle>{ `${ title } (${ count })` }</AnalysisTitle>
			</Button>
			{
				props.isOpen && props.children
					? <AnalysisList role="list">{ props.children }</AnalysisList>
					: null
			}
		</AnalysisHeaderContainer>
	);
};

AnalysisCollapsibleStateless.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	hasHeading: PropTypes.bool,
	headingLevel: PropTypes.number,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

AnalysisCollapsibleStateless.defaultProps = {
	hasHeading: false,
	headingLevel: 2,
};

export class AnalysisCollapsible extends React.Component {
	/**
	 * The constructor.
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
				hasHeading={ this.props.hasHeading }
				headingLevel={ this.props.headingLevel }
			>
				{ this.props.children }
			</AnalysisCollapsibleStateless>
		);
	}
}

AnalysisCollapsible.propTypes = {
	title: PropTypes.string.isRequired,
	initialIsOpen: PropTypes.bool,
	hasHeading: PropTypes.bool,
	headingLevel: PropTypes.number,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

AnalysisCollapsible.defaultProps = {
	initialIsOpen: false,
	hasHeading: false,
	headingLevel: 2,
};

export default AnalysisCollapsible;
