import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The topbar components.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The topbar.
 */
const Topbar = ( { children, className } ) => (
	<div className={ classNames( "yst-relative yst-flex yst-h-16 yst-justify-between", className ) }>
		{ children }
	</div>
);

Topbar.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Topbar.defaultProps = {
	className: "",
};

export default Topbar;
