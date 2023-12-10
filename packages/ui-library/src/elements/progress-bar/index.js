import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useMemo } from "react";

/**
 * @param {number} min The minimal value.
 * @param {number} max The maximum value.
 * @param {number} progress The current progress value between min and max.
 * @returns {JSX.Element} The ProgressBar component.
 */
const ProgressBar = forwardRef( ( {
	min,
	max,
	progress,
	className,
	...props
}, ref ) => {
	const percentage = useMemo( () => progress / ( max - min ) * 100, [ min, max, progress ] );

	return (
		<div ref={ ref } aria-hidden="true" className={ classNames( "yst-progress-bar", className ) } { ...props }>
			<div className="yst-progress-bar__progress" style={ { width: `${ percentage }%` } } />
		</div>
	);
} );

const propTypes = {
	min: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	progress: PropTypes.number.isRequired,
	className: PropTypes.string,
};

ProgressBar.displayName = "ProgressBar";
ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = {
	className: "",
};

// eslint-disable-next-line require-jsdoc
export const StoryComponent = props => <ProgressBar { ...props } />;
StoryComponent.propTypes = propTypes;
StoryComponent.defaultProps = ProgressBar.defaultProps;
StoryComponent.displayName = "ProgressBar";

export default ProgressBar;
