import { useMemo } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * 
 * @param {number} min The minimal value.
 * @param {number} max The maximum value.
 * @param {number} progress The current progress value between min and max.
 * @returns {JSX.Element} The ProgressBar component.
 */
const ProgressBar = ( {
    min,
    max,
    progress,
    className,
    ...props
} ) => {
    const percentage = useMemo( () => progress / ( max - min ) * 100, [ min, max, progress ] );

    return (
        <div aria-hidden="true" className={ classNames( "yst-progress-bar", className ) } { ...props }>
            <div className="yst-progress-bar__progress" style={ { width: `${ percentage }%` } } />
        </div>
    )
};

ProgressBar.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    className: PropTypes.string,
};

ProgressBar.defaultProps = {
    className: "",
};

export default ProgressBar;