import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Toggle } from "@yoast/components";
import { __ } from "@wordpress/i18n";

const Cornerstone = styled.div`
	display: flex;
	margin-top: 8px;
`;

/**
 * The CornerstoneToggle Component.
 */
class CornerstoneToggle extends React.Component {
	/**
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {ReactElement} the CornerstoneToggle component.
	 */
	render() {
		return (
			<Cornerstone>
				<Toggle
					id={ this.props.id }
					labelText={ __( "Mark as cornerstone content", "yoast-components" ) }
					isEnabled={ this.props.isEnabled }
					onSetToggleState={ this.props.onToggle }
					onToggleDisabled={ this.props.onToggleDisabled }
				/>
			</Cornerstone>
		);
	}
}

CornerstoneToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onSetToggleState: PropTypes.func,
	onToggle: PropTypes.func,
	disable: PropTypes.bool,
	onToggleDisabled: PropTypes.func,
};

CornerstoneToggle.defaultProps = {
	id: "cornerstone-toggle",
};

export default CornerstoneToggle;
