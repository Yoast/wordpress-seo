import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StackedProgressBarContainer = styled.div`
	margin: 8px 0;
	height: ${ props => props.barHeight };
	overflow: hidden;
`;

const StackedProgressBarProgress = styled.span`
	display: inline-block;
	vertical-align: top;
	width: ${ props => `${ props.progressWidth }%` };
	background-color: ${ props => props.progressColor };
	height: 100%;
`;

StackedProgressBarProgress.propTypes = {
	progressWidth: PropTypes.number.isRequired,
	progressColor: PropTypes.string.isRequired,
};

/**
 * The StackedProgressBar component.
 *
 * @param {Object} props The component's props.
 * @param {string} [props.className="stacked-progress-bar"] The class name of the progress bar.
 * @param {Object[]} [props.items] The parts of the progress bar.
 * @param {number} props.items[].value The value of the part.
 * @param {string} props.items[].color The color of the part.
 * @param {string} [props.barHeight="24px"] The height of the progress bar.
 *
 * @returns {ReactElement} The StackedProgressBarContainer component.
 */
const StackedProgressBar = ( { className = "stacked-progress-bar", barHeight = "24px", ...props } ) => {
	let totalValue = 0;
	for ( let i = 0; i < props.items.length; i++ ) {
		props.items[ i ].value = Math.max( props.items[ i ].value, 0 );
		totalValue += props.items[ i ].value;
	}

	if ( totalValue <= 0 ) {
		return null;
	}

	return (
		<StackedProgressBarContainer
			className={ className }
			barHeight={ barHeight }
		>
			{ props.items.map( ( item, index ) =>
				<StackedProgressBarProgress
					className={ `${ className }__part` }
					key={ index }
					progressColor={ item.color }
					progressWidth={ item.value / totalValue * 100 }
				/>
			) }
		</StackedProgressBarContainer>
	);
};

export default StackedProgressBar;
