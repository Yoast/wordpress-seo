import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useMemo } from "react";

/**
 * @param {number} min The minimal value.
 * @param {number} max The maximum value.
 * @param {number} progress The current progress value between min and max.
 * @param {string} [className] Additional class names for the progress bar container.
 * @param {string} [progressClassName] Additional class names for the progress indicator.
 * @returns {JSX.Element} The ProgressBar component.
 */
const ProgressBar = forwardRef( ( {
	min,
	max,
	progress,
	className = "",
	progressClassName = "",
	...props
}, ref ) => {
	const percentage = useMemo( () => progress / ( max - min ) * 100, [ min, max, progress ] );

	return (
		<div ref={ ref } aria-hidden="true" className={ classNames( "yst-progress-bar", className ) } { ...props }>
			<div className={ classNames( "yst-progress-bar__progress", progressClassName ) } style={ { width: `${ percentage }%` } } />
		</div>
	);
} );

ProgressBar.displayName = "ProgressBar";
ProgressBar.propTypes = {
	min: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
	progressClassName: PropTypes.string,
	className: PropTypes.string,
};
ProgressBar.defaultProps = {
	className: "",
};

export default ProgressBar;
