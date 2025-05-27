import PropTypes from "prop-types";

/**
 * @param {string} title The title.
 * @param {JSX.node} children The children nodes.
 * @returns {JSX.Element} The SearchNoResultsContent component.
 */
export const SearchNoResultsContent = ( { title, children } ) => (
	<div className="yst-border-t yst-border-slate-100 yst-p-6 yst-py-12 yst-space-3 yst-text-center yst-text-sm">
		<span className="yst-block yst-font-semibold yst-text-slate-900">{ title }</span>
		{ children }
	</div>
);

SearchNoResultsContent.propTypes = {
	title: PropTypes.node.isRequired,
	children: PropTypes.node.isRequired,
};
