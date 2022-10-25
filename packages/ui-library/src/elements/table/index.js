import classNames from "classnames";
import PropTypes from "prop-types";

const rowClassNameMap = {
	variant: {
		striped: "even:yst-bg-slate-50 odd:yst-bg-white",
		plain: "",
	},
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Cell = ( { children, className = "", ...props } ) => (
	<td className={ classNames( "yst-px-6 yst-py-4 yst-text-sm", className ) } { ...props }>
		{ children }
	</td>
);

Cell.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf( Object.keys( rowClassNameMap.variant ) ),
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [variant] Optional variant. See `rowClassNameMap.variant` for the options.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Row = ( { children, variant = "striped", className = "", ...props } ) => (
	<tr className={ classNames( rowClassNameMap.variant[ variant ], className ) } { ...props }>
		{ children }
	</tr>
);

Row.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf( Object.keys( rowClassNameMap.variant ) ),
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Header = ( { children, className = "", ...props } ) => (
	<th
		className={ classNames( "yst-px-6 yst-py-3 yst-text-left yst-text-xs yst-font-medium yst-text-slate-600 yst-bg-slate-50 yst-uppercase yst-tracking-wider", className ) }
		{ ...props }
	>
		{ children }
	</th>
);

Header.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children The content.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Head = ( { children, ...props } ) => (
	<thead { ...props }>{ children }</thead>
);

Head.propTypes = {
	children: PropTypes.node.isRequired,
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Body = ( { children, ...props } ) => (
	<tbody { ...props }>{ children }</tbody>
);

Body.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Table = ( { children, className = "", ...props } ) => (
	<table className={ classNames( "yst-min-w-full yst-divide-y yst-divide-slate-200", className ) } { ...props }>
		{ children }
	</table>
);

Table.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Table.Head = Head;
Table.Body = Body;
Table.Header = Header;
Table.Row = Row;
Table.Cell = Cell;

export default Table;
