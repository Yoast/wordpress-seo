import React from 'react';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';

const StepButton = ( props ) => (
	<IconButton className={props.className} onClick={props.onClick} tooltip={props.tooltip} touch={true} tooltipPosition="top-center">
		<SvgIcon color="rgb(158, 158, 158)">
			<circle cx="12" cy="12" r="10"/>
			<text
				x="12"
				y="16"
				textAnchor="middle"
				fontSize="12"
				fill="#fff"
			>
				{props.index}
			</text>
		</SvgIcon>
	</IconButton>
);

export default StepButton;