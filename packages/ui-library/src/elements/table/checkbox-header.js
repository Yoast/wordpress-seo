import React, { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { CheckboxTableContext } from "./context";

/**
 * @param {string}   id                  The checkbox id.
 * @param {string}   [name]              The checkbox name.
 * @param {boolean}  [checked]           Whether the checkbox is checked. Falls back to context when omitted.
 * @param {boolean}  [indeterminate]     Whether the checkbox is in an indeterminate state. Falls back to context when omitted.
 * @param {Function} [onChange]          Change handler. Falls back to context when omitted.
 * @param {boolean}  [disabled]          Whether the checkbox is disabled.
 * @param {string}   [className]         Optional class name for the th element.
 * @param {string}   [checkboxClassName] Optional class name forwarded to the inner input element.
 * @param {Object}   [cellProps]         Extra props for the th element (e.g. colSpan).
 * @param {Object}   [props]             Additional input props (aria-label, data-*, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxHeader = forwardRef( ( { id, name, checked, indeterminate, onChange, disabled, className = "", checkboxClassName = "", cellProps = {}, ...inputProps }, ref ) => {
	const context = useContext( CheckboxTableContext );
	const inputRef = useRef( null );

	const resolvedChecked = checked ?? context?.isAllSelected;
	const resolvedIndeterminate = indeterminate ?? context?.isIndeterminate;
	const resolvedOnChange = onChange ?? context?.toggleAll;
	const resolvedDisabled = disabled ?? false;

	useEffect( () => {
		if ( inputRef.current ) {
			inputRef.current.indeterminate = Boolean( resolvedIndeterminate );
		}
	}, [ resolvedIndeterminate ] );

	const setRef = useCallback( ( el ) => {
		inputRef.current = el;
		if ( typeof ref === "function" ) {
			ref( el );
		} else if ( ref ) {
			ref.current = el;
		}
	}, [ ref ] );

	return (
		<th scope="col" className={ classNames( "yst-table-checkbox-header", className ) } { ...cellProps }>
			<input
				ref={ setRef }
				type="checkbox"
				id={ id }
				name={ name }
				checked={ resolvedChecked }
				onChange={ resolvedOnChange }
				disabled={ resolvedDisabled }
				className={ classNames( "yst-checkbox__input", checkboxClassName, resolvedDisabled && "yst-opacity-50 yst-cursor-not-allowed" ) }
				{ ...inputProps }
			/>
		</th>
	);
} );

CheckboxHeader.displayName = "Table.CheckboxHeader";
