import React from "react";
import interpolateComponents from "interpolate-components";

import Icon from "../Plugin/Shared/components/Icon";
import PropTypes from "prop-types";

/**
 * Creates a message box in the style of the onboarding wizard.
 *
 * @param {object} props Object containing the text and link to render in the messagebox.
 *
 * @returns {ReactElement} The rendered message box.
 */
const MessageBox = ( props ) => (
	<div className="yoast-wizard-body">
		<Icon icon={ props.icon } width="200px" height="93px" className="yoast-wizard__logo" />
		<div className="yoast-wizard-container yoast-wizard-container--no-navigation">
			<div className="yoast-wizard">
				{ interpolateComponents( props ) }
			</div>
		</div>
	</div>
);

MessageBox.propTypes = {
	icon: PropTypes.func.isRequired,
};

export default MessageBox;
