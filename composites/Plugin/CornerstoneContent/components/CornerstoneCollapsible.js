import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import noop from "lodash/noop";
import CornerstoneToggle from "./CornerstoneToggle";
import { __ } from "@wordpress/i18n";

const CornerstoneText = styled.div`
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
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {ReactElement} the CornerstoneToggle component.
	 */
	render() {
		return (
			<div>
				<CornerstoneToggle onChange={ () => {} }/>
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

export default CornerstoneCollapsible;
