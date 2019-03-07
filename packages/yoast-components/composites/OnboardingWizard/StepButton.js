import React from "react";
import PropTypes from "prop-types";
import IconButton from "material-ui/IconButton";
import SvgIcon from "material-ui/SvgIcon";

import colors from "../../style-guide/colors.json";

/**
 * Creates a step button for the wizard. The step buttons are meant to be rendered in a stepper component(StepIndicator)
 * They indicate a step in the process, show a descriptive tooltip when hovered
 * and trigger a onclick event for going to that step when clicked.
 *
 * The step button is an extension for a IconButton from the Material-UI react framework.
 *
 * @param {Object} props The properties for the step button.
 *
 * @constructor
 */
const StepButton = ( props ) => (
	<IconButton
		className={ props.className } onClick={ props.onClick } tooltip={ props.tooltip } touch={ true }
		tooltipPosition="top-center" tooltipStyles={ props.tooltipStyles } aria-label={ props.ariaLabel }
	>
		<SvgIcon color={ colors.$color_grey_text }>
			<circle cx="12" cy="12" r="10" />
			<text x="12" y="16" textAnchor="middle" fontSize="12" fill={ colors.$color_white }>
				{ props.index }
			</text>
		</SvgIcon>
	</IconButton>
);

StepButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	tooltip: PropTypes.string,
	tooltipStyles: PropTypes.object,
	ariaLabel: PropTypes.string,
	index: PropTypes.string,
};

export default StepButton;
