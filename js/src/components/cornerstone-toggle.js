import { Component } from "@wordpress/element";
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
class CornerstoneToggle extends Component {
	/**
	 * Renders the CornerstoneToggle component.
	 *
	 * @returns {wp.Element} the CornerstoneToggle component.
	 */
	render() {
		return (
			<Cornerstone>
				<Toggle
					id={ this.props.id }
					labelText={ __( "Mark as cornerstone content", "wordpress-seo" ) }
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
	onToggle: PropTypes.func,
	onToggleDisabled: PropTypes.func,
};

CornerstoneToggle.defaultProps = {
	id: "cornerstone-toggle",
	isEnabled: true,
	onToggle: () => { },
	onToggleDisabled: () => { },
};

export default CornerstoneToggle;
