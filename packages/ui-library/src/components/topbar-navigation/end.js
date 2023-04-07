import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The topbar end.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The topbar end element.
 */
const End = ( { children, className } ) => (
	<div
		className={ classNames(
			"yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-2 sm:yst-static sm:yst-inset-auto sm:yst-ml-6 sm:yst-pr-0",
			className,
		) }
	>
		{ children }
	</div>
);

End.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

End.defaultProps = {
	className: "",
};

export default End;
