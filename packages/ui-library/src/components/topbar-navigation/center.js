import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The topbar center.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The topbar center element.
 */
const Center = ( { children, className } ) => (
	<div
		className={ classNames(
			"yst-flex yst-flex-1 yst-items-center yst-justify-center sm:yst-items-stretch sm:yst-justify-start",
			className,
		) }
	>
		{ children }
	</div>
);

Center.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Center.defaultProps = {
	className: "",
};

export default Center;
