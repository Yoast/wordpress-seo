import { Component } from "@wordpress/element";
import PropTypes from "prop-types";
import styled from "styled-components";
import { SimulatedLabel, Toggle } from "@yoast/components";
import { __ } from "@wordpress/i18n";

const Timestamp = styled.div`
	display: flex;
	margin-top: 8px;
`;

/**
 * The TimestampToggle Component.
 */
class TimestampToggle extends Component {
	/**
	 * Renders the TimestampToggle component.
	 *
	 * @returns {wp.Element} the CornerstoneToggle component.
	 */
	render() {
		return (
			<Timestamp>
				<SimulatedLabel
					for={ this.props.id }
					className={ "yoast-field-group__title" }
				>
					{ __( "Timestamp with WordProof", "wordpress-seo" ) }
				</SimulatedLabel>
				<Toggle
					id={ this.props.id }
					labelText={ __( "Timestamp this page", "wordpress-seo" ) }
					isEnabled={ this.props.isEnabled }
					onSetToggleState={ this.props.onToggle }
					onToggleDisabled={ this.props.onToggleDisabled }
				/>
			</Timestamp>
		);
	}
}

TimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func,
	onToggleDisabled: PropTypes.func,
};

TimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	onToggle: () => { },
	onToggleDisabled: () => { },
};

export default TimestampToggle;
