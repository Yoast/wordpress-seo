import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The logo.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The logo container.
 */
const LogoContainer = ( { children, className } ) => (
	<div
		className={ classNames(
			"yst-flex yst-flex-shrink-0 yst-items-center",
			className,
		) }
	>
		{ children }
	</div>
);

LogoContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

LogoContainer.defaultProps = {
	className: "",
};

export default LogoContainer;
