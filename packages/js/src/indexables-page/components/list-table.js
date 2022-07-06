import PropTypes from "prop-types";

function Row( { children } ) {
	return <tr>{ children }</tr>;
}

function Cell( { children } ) {
	return <td className="yst-px-6 yst-py-4">{ children }</td>;
}

function Body( {children} ) {
	return <tbody className="yst-divide-y yst-divide-gray-200">
		{ children }
	</tbody>;
}

function Header( { children } ) {
	return <thead className="yst-bg-gray-50"><tr>{ children }</tr></thead>;
}

function HeaderCell( { children } ) {
	return <th className="yst-px-6 yst-py-3 yst-text-left yst-text-xs yst-font-medium yst-text-gray-500 yst-uppercase yst-tracking-wider">{ children }</th>;
}

/**
 * The basic table structure with thead and tbody that's used by the ListTable component.
 * @param {*} children Either the content or a state message.
 * @param {*} header The headings for the thead.
 *
 * @returns {JSX.Element} The table and thead.
 */
const Table = ( { children } ) => {
	return (
		<div className="yst-relative yst-overflow-x-scroll yst-border yst-border-gray-200 yst-shadow-sm yst-rounded-lg">
			<table className="yst-min-w-full yst-divide-y yst-divide-gray-200">
				{ children }
			</table>
		</div>
	);
};

Table.propTypes = {
	children: PropTypes.node.isRequired,
};

Table.Body = Body;
Table.Header = Header;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.Cell = Cell;

export default Table;
