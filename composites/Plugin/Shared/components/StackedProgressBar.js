import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StackedProgressBarContainer = styled.div`
	height: ${ props => props.barHeight };
	overflow: hidden;
`;

StackedProgressBarContainer.propTypes = {
	barHeight: PropTypes.string,
};

StackedProgressBarContainer.defaultProps = {
	barHeight: "40px",
};

const StackedProgressBarProgress = styled.span`
	display: inline-block;
	width: ${ props => `${ props.progressWidth }%` };
	background-color: ${ props => props.progressColor };
	height: 100%;
`;

StackedProgressBarProgress.propTypes = {
	progressWidth: PropTypes.number.isRequired,
	progressColor: PropTypes.string.isRequired,
};

const StackedProgressBar = ( props ) => {
	let totalValue = 0;
	for ( let i = 0; i < props.items.length; i++ ) {
		totalValue += props.items[ i ].value;
	}
	return(
		<StackedProgressBarContainer barHeight={ props.barHeight }>
			{ props.items.map( ( item, index ) =>
				<StackedProgressBarProgress
					key={ index }
					progressColor={ item.color }
					progressWidth={ item.value / totalValue * 100 }/>
			) }
		</StackedProgressBarContainer>
	);
};

StackedProgressBar.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape( {
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
		} )
	),
};

export default StackedProgressBar;
