import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import { Icon } from "../../Shared/components/Icon";
import { caretUp, caretDown } from "../../../../style-guide/svg";
import { ButtonHeader } from "./ButtonHeader";

const AnalysisHeaderContainer = styled.div`
	margin-top: 20px;
	background-color: ${ colors.$color_white };
`;

export default class ListToggle extends React.Component {
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
	 * @returns {Boolean} True when the list is collapsed.
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
	 * Gets the correct arrow based on whether the list is collapsed or not.
	 *
	 * @returns {ReactElement} The upArrow when the header is collapsed, otherwise the downArrow.
	 */
	getArrow() {
		let upArrow = <Icon icon={ caretUp } iconColor= { colors.$color_grey_dark }  iconSize="20px" />;
		let downArrow = <Icon icon={ caretDown } iconColor= { colors.$color_grey_dark } iconSize="20px" />;

		return this.isOpen() ? upArrow : downArrow;
	}

	/**
	 * Returns the rendered ListToggle element.
	 *
	 * @returns {ReactElement} The rendered ListToggle element.
	 */
	render() {
		let children = null;

		if ( this.state.isOpen ) {
			children = this.props.children;
		}

		return (
			<AnalysisHeaderContainer>
				<ButtonHeader title={ this.props.title } headerClick={ this.toggleOpen } aria-expanded={ this.isOpen() } isOpen={ this.isOpen() } >
					{ this.getArrow() }
				</ButtonHeader>
				{ children }
			</AnalysisHeaderContainer>
		);
	}
}

ListToggle.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

ListToggle.defaultProps = {
	isOpen: false,
};


