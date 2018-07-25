import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import noop from "lodash/noop";
import GutenbergToggle from "../../Shared/components/GutenbergToggle";
import { __ } from "@wordpress/i18n";
import HelpText from "../../Shared/components/HelpText";

const Cornerstone = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 5px;

	label { 
		margin-right: 10px;
		flex-shrink: 0;
		max-width: 75%;
	}
`;

const HelpTextDiv = styled.div`
	p {
		font-style: italic;
	}
`;

class CornerstoneToggle extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			cornerstoneToggleState: this.props.checked,
		};

		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * Handles changes on the cornerstoneToggle.
	 *
	 * @returns {void}
	 */
	handleChange() {
		this.setState( { cornerstoneToggleState: ! this.state.cornerstoneToggleState } );
		this.props.onChange();
	}

	getHelpTextWithToggle( checked ) {
		return checked ? __( "On" ) : __( "Off" );
	}

	/**
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {ReactElement} the CornerstoneToggle component.
	 */
	render() {
		return (
			<div>
				<Cornerstone>
						<label htmlFor={ this.props.toggleId }>{ __("Mark this as cornerstone content.") }</label>
						<GutenbergToggle
							checked={ this.state.cornerstoneToggleState }
							onChange={ this.handleChange }
							id={ this.props.toggleId }
						/>
				</Cornerstone>
				<HelpTextDiv>
					<p>{ this.getHelpTextWithToggle( this.state.cornerstoneToggleState ) }</p>
				</HelpTextDiv>
			</div>

		);
	}
}

CornerstoneToggle.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	toggleId: PropTypes.string,
};

CornerstoneToggle.defaultProps = {
	checked: false,
	onChange: noop,
	toggleId: "Cornerstone Toggle",
};

export default CornerstoneToggle;
