import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Extra class.
 * @param {JSX.node} [children] Content to determine the size.
 * @returns {JSX.Element} The element.
 */
const Skeleton = ( { as: Component, className, children } ) => {
	return (
		<Component className={ classNames( "yst-skeleton", className ) }>
			{ children && (
				<div className="yst-pointer-events-none yst-invisible">
					{ children }
				</div>
			) }
		</Component>
	);
};
Skeleton.propTypes = {
	as: PropTypes.elementType,
	className: PropTypes.string,
	children: PropTypes.node,
};
Skeleton.defaultProps = {
	as: "span",
	className: "",
	children: null,
};

export default Skeleton;
