import PropTypes from "prop-types";

/**
 * @param {JSX.Element} children The main content.
 * @param {JSX.Element} sidebar The sidebar content.
 * @returns {JSX.Element} The layout.
 */
const SidebarLayout = ( { children, sidebar } ) => (
	<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-gap-4">
		<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden min-[783px]:yst-block yst-pb-6 yst-bottom-0 yst-w-56">
			{ sidebar }
		</aside>
		<div className="yst-flex yst-grow yst-flex-wrap">
			<div className="yst-grow yst-space-y-6 yst-mb-8 xl:yst-mb-0">
				<main className="yst-rounded-lg yst-bg-white yst-shadow">
					{ children }
				</main>
			</div>
		</div>
	</div>
);

SidebarLayout.propTypes = {
	children: PropTypes.node.isRequired,
	sidebar: PropTypes.node.isRequired,
};

export default SidebarLayout;
