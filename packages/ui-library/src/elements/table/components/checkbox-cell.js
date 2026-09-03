import classNames from "classnames";
import React, { forwardRef } from "react";
import Checkbox from "../../checkbox";

/**
 * @param {Object}   [cellProps]         Extra props for the td element (e.g. colSpan, className).
 * @param {Object}   [checkboxProps]     Additional props forwarded to Checkbox (aria-label, data-*, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxCell = forwardRef( ( { cellProps = {}, checkboxProps = {} }, ref ) => (
	<td
		{ ...cellProps }
		className={ classNames( "yst-table-checkbox-cell", cellProps?.className ) }
	>
		<Checkbox
			ref={ ref }
			{ ...checkboxProps }
		/>
	</td>
) );

CheckboxCell.displayName = "Table.CheckboxCell";
