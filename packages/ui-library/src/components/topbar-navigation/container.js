import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The topbar.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The topbar container.
 */
const Container = ( { children, className } ) => (
	<div className={ classNames( "yst-px-2 sm:yst-px-6 lg:yst-px-8", className ) }>
		{ children }
	</div>
);

Container.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Container.defaultProps = {
	className: "",
};

export default Container;
