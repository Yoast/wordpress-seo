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
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The StackedProgressBarContainer component.
 */
const StackedProgressBar = ( { className = "stacked-progress-bar", items, barHeight = "24px" } ) => {
	let totalValue = 0;
	for ( let i = 0; i < items.length; i++ ) {
		items[ i ].value = Math.max( items[ i ].value, 0 );
		totalValue += items[ i ].value;
	}

	if ( totalValue <= 0 ) {
		return null;
	}

	return (
		<StackedProgressBarContainer
			className={ className }
			barHeight={ barHeight }
		>
			{ items.map( ( item, index ) =>
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

StackedProgressBar.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
		} )
	),
	barHeight: PropTypes.string,
};

export default StackedProgressBar;
