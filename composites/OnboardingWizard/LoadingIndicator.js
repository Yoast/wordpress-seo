import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const style = {
	container: {
		position: 'relative',
	},
	refresh: {
		display: 'inline-block',
		position: 'relative',
	},
};

const LoadingIndicator = () => (
	<div style={style.container}>
		<RefreshIndicator
			size={40}
			left={10}
			top={100}
			status="loading"
			style={style.refresh}
			justify-content= "center"
		    z-index={10}

		/>
	</div>
);

export default LoadingIndicator;
