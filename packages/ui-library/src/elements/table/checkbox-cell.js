import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useContext } from "react";
import Checkbox from "../checkbox";
import { CheckboxTableContext } from "./context";

/**
 * @param {string}   id          The checkbox id.
 * @param {string}   name        The checkbox name.
 * @param {string}   value       The checkbox value.
 * @param {boolean}  [checked]   Whether the checkbox is checked. Falls back to context when omitted.
 * @param {Function} [onChange]  Change handler. Falls back to context when omitted.
 * @param {boolean}  [disabled]  Whether the checkbox is disabled.
 * @param {string}   [label]     Optional visible label.
 * @param {string}   [className] Optional class name for the td element.
 * @param {Object}   [props]     Additional props forwarded to Checkbox (aria-label, data-*, etc.).
 * @returns {JSX.Element} The element.
 */
export const CheckboxCell = forwardRef( ( { id, name, value, checked, onChange, disabled, label, className = "", ...checkboxProps }, ref ) => {
	const context = useContext( CheckboxTableContext );
	const contextOnChange = useCallback( () => context?.toggleRow( value ), [ context, value ] );

	const resolvedChecked = checked ?? context?.isSelected( value ) ?? false;
	const resolvedOnChange = onChange ?? ( context ? contextOnChange : null );
	const resolvedDisabled = disabled ?? false;

	return (
		<td className={ classNames( "yst-table-checkbox-cell", className ) }>
			<Checkbox
				ref={ ref }
				id={ id }
				name={ name }
				value={ value }
				checked={ resolvedChecked }
				onChange={ resolvedOnChange }
				disabled={ resolvedDisabled }
				label={ label ?? "" }
				{ ...checkboxProps }
			/>
		</td>
	);
} );

CheckboxCell.displayName = "Table.CheckboxCell";

CheckboxCell.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	label: PropTypes.string,
	className: PropTypes.string,
};
