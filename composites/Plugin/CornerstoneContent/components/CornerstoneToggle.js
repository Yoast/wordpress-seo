import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import noop from "lodash/noop";

import GutenbergToggle from "../../Shared/components/GutenbergToggle";

const Cornerstone = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
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
				<label htmlFor={this.props.key}>Cornerstone</label>
				<GutenbergToggle
					key={this.props.key}
					checked={this.state.cornerstoneToggleState}
					onChange={this.handleChange}
					id={this.props.toggleId}
				/>
			</Cornerstone>
		);
	}
}

CornerstoneToggle.propTypes = {
	key: PropTypes.string,
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	toggleId: PropTypes.string,
};

CornerstoneToggle.defaultProps = {
	checked: false,
	onChange: noop,
};

export default CornerstoneToggle;
