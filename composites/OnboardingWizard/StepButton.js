import React from 'react';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';

/**
 * Creates a step button for the wizard. The step buttons are meant to be rendered in a stepper component(StepIndicator)
 * They indicate a step in the process, show a descriptive tooltip when hovered
 * and trigger a onclick event for going to that step when clicked.
 *
 * The step button is an extension for a IconButton from the Material-UI react framework.
 *
 * @param props The properties for the step button.
 *
 * @constructor Passes the properties to the component.
 */
const StepButton = ( props ) => (
	<IconButton className={props.className} onClick={props.onClick} tooltip={props.tooltip} touch={true}
	            tooltipPosition="top-center" tooltipStyles={props.tooltipStyles} aria-label={props.ariaLabel}>
		<SvgIcon color="rgb(114, 119, 124)">
			<circle cx="12" cy="12" r="10"/>
			<text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff">
				{props.index}
			</text>
		</SvgIcon>
	</IconButton>
);

export default StepButton;
