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
	<td className={ classNames( "yst-whitespace-nowrap yst-px-3 yst-py-4 yst-text-sm yst-text-slate-500", className ) } { ...props }>
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
const Row = ( { children, variant = "plain", className = "", ...props } ) => (
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
		className={ classNames( "yst-px-3 yst-py-4 yst-text-left yst-text-sm yst-font-semibold yst-text-slate-900", className ) }
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
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Head = ( { children, className = "", ...props } ) => (
	<thead className={ classNames( "yst-bg-slate-50", className ) } { ...props }>{ children }</thead>
);

Head.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Body = ( { children, className = "", ...props } ) => (
	<tbody className={ classNames( "yst-divide-y yst-divide-gray-200 yst-bg-white", className ) } { ...props }>{ children }</tbody>
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
	<div className="yst-overflow-hidden yst-shadow yst-ring-1 yst-ring-black yst-ring-opacity-5 yst-rounded-lg">
		<table className={ classNames( "yst-min-w-full yst-divide-y yst-divide-slate-300", className ) } { ...props }>
			{ children }
		</table>
	</div>
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
