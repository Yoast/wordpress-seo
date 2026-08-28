import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import { CheckboxTableContext } from "./context";

/**
 * @param {string}   id              The checkbox id.
 * @param {string}   [name]          The checkbox name.
 * @param {boolean}  [checked]       Whether the checkbox is checked. Falls back to context when omitted.
 * @param {boolean}  [indeterminate] Whether the checkbox is in an indeterminate state. Falls back to context when omitted.
 * @param {Function} [onChange]      Change handler. Falls back to context when omitted.
 * @param {boolean}  [disabled]      Whether the checkbox is disabled.
 * @param {string}   [aria-label]    Accessible label for the input element.
 * @param {string}   [className]     Optional class name for the th element.
 * @param {Object}   [props]         Additional th props (scope, colSpan, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxHeader = forwardRef( ( { id, name, checked, indeterminate, onChange, disabled, "aria-label": ariaLabel, className = "", ...thProps }, ref ) => {
	const context = useContext( CheckboxTableContext );
	const inputRef = useRef( null );

	const resolvedChecked = checked ?? Boolean( context?.isAllSelected );
	const resolvedIndeterminate = indeterminate ?? Boolean( context?.isIndeterminate );
	const resolvedOnChange = onChange ?? context?.toggleAll;
	const resolvedDisabled = disabled ?? false;

	useEffect( () => {
		if ( inputRef.current ) {
			inputRef.current.indeterminate = resolvedIndeterminate;
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
		<th className={ classNames( "yst-table-checkbox-header", className ) } { ...thProps }>
			<input
				ref={ setRef }
				type="checkbox"
				id={ id }
				name={ name }
				checked={ resolvedChecked }
				onChange={ resolvedOnChange }
				disabled={ resolvedDisabled }
				aria-label={ ariaLabel }
				className={ classNames( "yst-checkbox__input", resolvedDisabled && "yst-opacity-50 yst-cursor-not-allowed" ) }
			/>
		</th>
	);
} );

CheckboxHeader.displayName = "Table.CheckboxHeader";

CheckboxHeader.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
	checked: PropTypes.bool,
	indeterminate: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	"aria-label": PropTypes.string,
	className: PropTypes.string,
};
