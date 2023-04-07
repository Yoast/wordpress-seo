import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The links.
 * @param {string} [className] Any extra CSS class.
 * @returns {JSX.Element} The links container.
 */
const LinksContainer = ( { children, className } ) => (
	<div
		className={ classNames(
			"yst-hidden sm:yst-ml-6 sm:yst-flex sm:yst-space-x-8",
			className,
		) }
	>
		{ children }
	</div>
);

LinksContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

LinksContainer.defaultProps = {
	className: "",
};

export default LinksContainer;
