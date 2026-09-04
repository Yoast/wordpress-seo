import classNames from "classnames";
import React from "react";
import Checkbox from "../../checkbox";

/**
 * @param {Object} [cellProps]     Extra props for the td element (e.g. colSpan, className).
 * @param {Object} [checkboxProps] Props forwarded to the inner Checkbox (id, name, value, checked, onChange, aria-label, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxCell = ( { cellProps = {}, checkboxProps = {} } ) => (
	<td
		{ ...cellProps }
		className={ classNames( "yst-table-checkbox-cell", cellProps?.className ) }
	>
		<Checkbox { ...checkboxProps } />
	</td>
);

CheckboxCell.displayName = "Table.CheckboxCell";
