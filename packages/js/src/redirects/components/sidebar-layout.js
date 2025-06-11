import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Layout component for pages with a sidebar and main content.
 *
 * @param {string} [contentClassName] Extra class name for the children container.
 * @param {JSX.node} children The children.
 * @returns {JSX.Element} The element.
 */
export const SidebarLayout = ( { contentClassName, children } ) => {
	return (
		<div className="yst-flex yst-gap-6 xl:yst-flex-row yst-flex-col">
			<div className={ classNames( "yst-@container yst-flex yst-flex-grow yst-flex-col", contentClassName ) }>
				{ children }
			</div>
		</div>
	);
};

SidebarLayout.propTypes = {
	contentClassName: PropTypes.string,
	children: PropTypes.node,
};
