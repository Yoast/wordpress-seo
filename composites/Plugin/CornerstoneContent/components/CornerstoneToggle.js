import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Toggle from "../../Shared/components/Toggle";
import { __ } from "@wordpress/i18n";

const Cornerstone = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 5px;

	label { 
		margin-right: 10px;
		flex-shrink: 0;
		max-width: 75%;
	}
`;

class CornerstoneToggle extends React.Component {
	/**
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {ReactElement} the CornerstoneToggle component.
	 */
	render() {
		return (
			<Cornerstone>
				<Toggle ariaLabel="Mark this post as cornerstone content" id="cornerstone_toggle"
				        labelText={ __( "Mark this as cornerstone content.", "yoast-components" ) } />
			</Cornerstone>
		);
	}
}

CornerstoneToggle.propTypes = {
	isEnabled: PropTypes.bool,
	onSetEnable: PropTypes.func,
	disable: PropTypes.bool,
	onToggleDisabled: PropTypes.func,
};

export default CornerstoneToggle;
