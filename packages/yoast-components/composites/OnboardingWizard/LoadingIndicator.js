import React from "react";
import RefreshIndicator from "material-ui/RefreshIndicator";

/**
 * The (inline)styles for the refresh indicator.
 *
 * @type {{refresh: {display: string, position: string}}}
 */
const style = {
	refresh: {
		display: "inline-block",
		position: "relative",
	},
};

/**
 * Loading indicator component. Displays an loading indicator animation.
 *
 * @returns {void}
 */
const LoadingIndicator = () => (
	<div className="yoast-wizard-overlay-loader">
		<RefreshIndicator
			size={ 40 }
			left={ 10 }
			top={ 100 }
			status="loading"
			style={ style.refresh }
		/>
	</div>
);

export default LoadingIndicator;
