// External dependencies.
import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Toggle } from "@yoast/components";

// Internal dependencies.
import WincherExplanation from "./modals/WincherExplanation";

const Wincher = styled.div`
	display: flex;
	margin-top: 8px;
`;

/**
 * The WincherToggle Component.
 */
class WincherToggle extends Component {
	/**
	 * Renders the WincherToggle component.
	 *
	 * @returns {wp.Element} the WincherToggle component.
	 */
	render() {
		return (
			<Fragment>
				<WincherExplanation />
				<Wincher>
					<Toggle
						id={ this.props.id }
						labelText={ __( "Track the SEO performance of this page with Wincher", "wordpress-seo" ) }
						isEnabled={ this.props.isEnabled }
						onSetToggleState={ this.props.onToggle }
						onToggleDisabled={ this.props.onToggleDisabled }
					/>
				</Wincher>
			</Fragment>
		);
	}
}

WincherToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func,
	onToggleDisabled: PropTypes.func,
};

WincherToggle.defaultProps = {
	id: "wincher-toggle",
	isEnabled: false,
	onToggle: () => { },
	onToggleDisabled: () => { },
};

export default WincherToggle;
