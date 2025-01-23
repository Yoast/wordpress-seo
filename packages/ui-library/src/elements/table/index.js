import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

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
	<td className={ classNames( "yst-table-cell", className ) } { ...props }>
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
	<tr className={ classNames( "yst-table-row", rowClassNameMap.variant[ variant ], className ) } { ...props }>
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
		className={ classNames( "yst-table-header", className ) }
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
	<thead className={ className } { ...props }>{ children }</thead>
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
	<tbody className={ className } { ...props }>{ children }</tbody>
);

Body.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

const tableVariants = {
	"default": "yst-table--default",
	minimal: "yst-table--minimal",
};

/**
 * @param {JSX.node} children The content.
 * @param {string} [className] Optional class name.
 * @param {string} [variant] The variant of the table.
 * @param {Object} [props] Optional table props.
 * @returns {JSX.Element} The element.
 */
const Table = forwardRef( ( { children, className = "", variant = "default", ...props }, ref ) => (
	<div className={ classNames( "yst-table-wrapper", tableVariants[ variant ] ) }>
		<table className={ className } { ...props } ref={ ref }>
			{ children }
		</table>
	</div>
) );

Table.displayName = "Table";
Table.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	variant: PropTypes.string,
};
Table.defaultProps = {
	className: "",
	variant: "default",
};

Table.Head = Head;
Table.Head.displayName = "Table.Head";
Table.Body = Body;
Table.Body.displayName = "Table.Body";
Table.Header = Header;
Table.Header.displayName = "Table.Header";
Table.Row = Row;
Table.Row.displayName = "Table.Row";
Table.Cell = Cell;
Table.Cell.displayName = "Table.Cell";

export default Table;
