import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { HelpCenterButton } from "../../Plugin/Shared/components/HelpCenterButton";
import Paper from "../../../composites/basic/Paper"

import YoastTabs from "../Shared/components/YoastTabs";

export const HelpCenterContainer = styled.div`
	margin-bottom: 1em;
`;

/**
 * Returns the HelpCenter component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The HelpCenter component.
 */
export class HelpCenter extends React.Component {

	/**
	 * Constructor for the component.
	 * @param {Object} props The props to assign to the current component.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isExpanded: false,
		};
	}

	/**
	 * Handles the onButtonClick event.
	 *
	 * @returns {void}
	 */
	onButtonClick() {
		this.setState( { isExpanded: ! this.state.isExpanded } );
	}

	/**
	 * Renders the HelpCenter.
	 *
	 * @returns {ReactElement} The HelpCenter component.
	 */
	render() {
		return (
			<HelpCenterContainer>
				<HelpCenterButton onClick={ this.onButtonClick.bind( this ) } isExpanded={ this.state.isExpanded }>Need help?</HelpCenterButton>
				{ this.state.isExpanded && <Paper minHeight="432px"><YoastTabs items={ this.props.items }/></Paper> }
			</HelpCenterContainer>
		);
	}
}

HelpCenter.propTypes = {
	items: PropTypes.array.isRequired,
};
