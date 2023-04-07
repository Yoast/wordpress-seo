import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The topbar start.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The topbar start element.
 */
const Start = ( { children, className } ) => (
	<div
		className={ classNames(
			"yst-absolute yst-inset-y-0 yst-left-0 yst-flex yst-items-center sm:yst-hidden",
			className,
		) }
	>
		{ children }
	</div>
);

Start.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Start.defaultProps = {
	className: "",
};

export default Start;
