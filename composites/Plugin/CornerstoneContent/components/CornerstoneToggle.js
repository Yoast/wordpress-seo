import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import noop from "lodash/noop";
import Toggle from "../../Shared/components/Toggle";
import { __ } from "@wordpress/i18n";

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

	/**
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {ReactElement} the CornerstoneToggle component.
	 */
	render() {
		return (
				<Cornerstone>
					<label htmlFor={ this.props.ariaLabel }>{ __( "Mark this as cornerstone content.", "yoast-components" ) }</label>
					<Toggle ariaLabel="Test the Toggle"/>
				</Cornerstone>
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
