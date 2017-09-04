import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { angleUp, angleDown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import defaults from "../../../../config/defaults.json";
import { Icon } from "../../Shared/components/Icon";

/**
 * Container for the Collapsible header and its content.
 */
const AnalysisHeaderContainer = styled.div`
	margin-top: 20px;
	background-color: ${ colors.$color_white };
`;

/**
 * The clickable component of the analysis header.
 */
const AnalysisHeaderButton = styled.button`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	background-color: ${ colors.$color_white };
	padding: 0;
	border: none;
	text-align: left;
	font-weight: 300;
	cursor: pointer;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };
	outline: none;
`;

/**
 * The up or down pointing angle shown next to the title.
 */
const AnalysisHeaderIcon = styled( Icon )`
	flex: 0 0 40px;
	// Add some spacing between icon and text.
	margin-left: 10px;
	// Compensate the height difference with a line of text (32px).
	margin-top: -4px;
	margin-bottom: -4px;
	// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
	align-self: flex-start;
	
	@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		margin-top: 4px;
		margin-bottom: 4px;
		margin-right: -2px;
	}
`;

/**
 * The analysis header text.
 */
const AnalysisTitle = styled.span`
	word-wrap: break-word
	font-weight: 400;
	flex: 1 1 auto;
	font-size: 1.2em;
	// Chrome needs 8 decimals to make this 32px without roundings.
	line-height: 1.33333333;
	// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
	align-self: center;
`;

/**
 * A collapsible header used to show sets of analysis results. Expects list items as children.
 *
 * @param {object} props The properties for the component.
 * @returns {ReactElement} A collasible analysisresult set.
 */
export const AnalysisCollapsibleStateless = ( props ) => {
	return (
		<AnalysisHeaderContainer>
			<h3>
				<AnalysisHeaderButton aria-expanded={ props.isOpen } onClick={ props.onToggle }>
					<AnalysisHeaderIcon icon={ props.isOpen ? angleUp : angleDown } color={ colors.$color_grey_dark } size="20px" />
					<AnalysisTitle> { props.title + " (" + props.children.length + ")" } </AnalysisTitle>
				</AnalysisHeaderButton>
			</h3>
			<ul>
				{ props.isOpen ? props.children : null }
			</ul>
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
	 * Returns the rendered ListToggle element.
	 *
	 * @returns {ReactElement} The rendered collapsible analysisHeader.
	 */
	render() {
		return (
			<AnalysisCollapsibleStateless
				title={ this.props.title }
				onToggle={ this.toggleOpen.bind( this ) }
				isOpen={ this.state.isOpen }>
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


