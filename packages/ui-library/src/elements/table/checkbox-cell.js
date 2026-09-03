import classNames from "classnames";
import React, { forwardRef, useCallback, useContext } from "react";
import Checkbox from "../checkbox";
import { CheckboxTableContext } from "./context";

/**
 * @param {string}   id                  The checkbox id.
 * @param {string}   name                The checkbox name.
 * @param {string}   value               The checkbox value.
 * @param {boolean}  [checked]           Whether the checkbox is checked. Falls back to context when omitted.
 * @param {Function} [onChange]          Change handler. Falls back to context when omitted.
 * @param {boolean}  [disabled]          Whether the checkbox is disabled.
 * @param {string}   [label]             Optional visible label (or pass aria-label via spread for screen-reader-only labels).
 * @param {string}   [className]         Optional class name for the td element.
 * @param {string}   [checkboxClassName] Optional class name forwarded to the inner Checkbox wrapper.
 * @param {Object}   [cellProps]         Extra props for the td element (e.g. colSpan).
 * @param {Object}   [props]             Additional props forwarded to Checkbox (aria-label, data-*, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxCell = forwardRef( ( { id, name, value, checked, onChange, disabled, label, className = "", checkboxClassName = "", cellProps = {}, ...checkboxProps }, ref ) => {
	const context = useContext( CheckboxTableContext );
	const contextOnChange = useCallback( ( event ) => context?.toggleRow( value, event ), [ context, value ] );

	const resolvedChecked = checked ?? context?.isSelected( value );
	const resolvedOnChange = onChange ?? ( context ? contextOnChange : undefined );

	return (
		<td className={ classNames( "yst-table-checkbox-cell", className ) } { ...cellProps }>
			<Checkbox
				ref={ ref }
				id={ id }
				name={ name }
				value={ value }
				checked={ resolvedChecked }
				onChange={ resolvedOnChange }
				disabled={ disabled }
				className={ checkboxClassName }
				label={ label ?? "" }
				{ ...checkboxProps }
			/>
		</td>
	);
} );

CheckboxCell.displayName = "Table.CheckboxCell";
