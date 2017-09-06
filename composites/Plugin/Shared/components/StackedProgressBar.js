import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StackedProgressBarContainer = styled.div`
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

const StackedProgressBar = ( props ) => {
	let totalValue = 0;
	for ( let i = 0; i < props.items.length; i++ ) {
		props.items[ i ].value = Math.max( props.items[ i ].value, 0 );
		totalValue += props.items[ i ].value;
	}
	return(
		<StackedProgressBarContainer barHeight={ props.barHeight }>
			{ totalValue > 0 && props.items.map( ( item, index ) =>
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
	barHeight: PropTypes.string,
};

StackedProgressBar.defaultProps = {
	barHeight: "40px",
};

export default StackedProgressBar;
