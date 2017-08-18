import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { angleUp, angleDown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import defaults from "../../../../config/defaults.json";
import { Icon } from "../../Shared/components/Icon";

/**
 * Container for the Collapsable header and it's content.
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
`;


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
	font-weight: 400;
	flex: 1 1 auto;
	font-size: 1.2em;
	// Chrome needs 8 decimals to make this 32px without roundings.
	line-height: 1.33333333;
	// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
	align-self: center;
`;

export default class AnalysisHeader extends React.Component {
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
			isOpen: this.props.isOpen,
		};

		this.toggleOpen = this.toggleOpen.bind( this );
	}

	/**
	 * Returns whether the list is collapsed.
	 *
	 * @returns {Boolean} False when the list is collapsed.
	 */
	isOpen() {
		return this.state.isOpen;
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
	 * Returns the rendered AnalysisHeader element.
	 *
	 * @returns {ReactElement} The rendered AnalysisHeader element.
	 */
	render() {
		const isOpen = this.isOpen();
		let childrenAmount = this.props.children.props.children.length;

		return (
			<AnalysisHeaderContainer>
				<div role="presentation">
					<h3 role="heading" aria-level="3">
						<AnalysisHeaderButton aria-expanded={ isOpen } aria-controls="sect1" onClick={ this.toggleOpen } >
							<AnalysisHeaderIcon icon={ isOpen ? angleUp : angleDown } color={ colors.$color_grey_dark } size="20px" />
							<AnalysisTitle> { this.props.title + " (" + childrenAmount + ")" } </AnalysisTitle>
						</AnalysisHeaderButton>
					</h3>
				</div>
				{ isOpen ? this.props.children : "" }
			</AnalysisHeaderContainer>
		);
	}
}

AnalysisHeader.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

AnalysisHeader.defaultProps = {
	isOpen: false,
};


