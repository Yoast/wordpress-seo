import classNames from "classnames";
import PropTypes from "prop-types";
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import Checkbox from "../checkbox";

const rowClassNameMap = {
	variant: {
		striped: "[&>*]:even:yst-bg-slate-50 [&>*]:odd:yst-bg-white",
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
	variant: PropTypes.oneOf( Object.keys( tableVariants ) ),
};

const CheckboxTableContext = createContext( null );

/**
 * Provides internal checkbox selection state for Table.CheckboxHeader and Table.CheckboxCell.
 * When wrapped in this provider, those subcomponents do not need explicit checked/onChange props.
 *
 * @param {string[]} props.allValues All selectable values (one per row).
 * @param {Function} [props.onChange] Called with the new selected-values array on every change.
 * @param {JSX.node} props.children  The table and its contents.
 * @returns {JSX.Element} The provider.
 */
const CheckboxProvider = ( { allValues, onChange, children } ) => {
	const [ selectedValues, setSelectedValues ] = useState( new Set() );

	const isAllSelected = allValues.length > 0 && selectedValues.size === allValues.length;
	const isIndeterminate = selectedValues.size > 0 && ! isAllSelected;

	const update = useCallback( ( next ) => {
		setSelectedValues( next );
		onChange?.( Array.from( next ) );
	}, [ onChange ] );

	const toggleAll = useCallback( () => {
		update( selectedValues.size > 0 ? new Set() : new Set( allValues ) );
	}, [ selectedValues, allValues, update ] );

	const toggleRow = useCallback( ( value ) => {
		const next = new Set( selectedValues );
		if ( next.has( value ) ) {
			next.delete( value );
		} else {
			next.add( value );
		}
		update( next );
	}, [ selectedValues, update ] );

	const selectAll = useCallback( ( values ) => {
		update( new Set( values ?? allValues ) );
	}, [ allValues, update ] );

	const deselectAll = useCallback( () => {
		update( new Set() );
	}, [ update ] );

	const isSelected = useCallback( ( value ) => selectedValues.has( value ), [ selectedValues ] );

	return (
		<CheckboxTableContext.Provider
			value={ { selectedValues, isAllSelected, isIndeterminate, toggleAll, toggleRow, selectAll, deselectAll, isSelected } }
		>
			{ children }
		</CheckboxTableContext.Provider>
	);
};

CheckboxProvider.propTypes = {
	allValues: PropTypes.arrayOf( PropTypes.string ).isRequired,
	onChange: PropTypes.func,
	children: PropTypes.node.isRequired,
};

/**
 * Returns the checkbox selection context exposed by Table.CheckboxProvider.
 * Use this hook inside a Table.CheckboxProvider tree to read or drive selection state
 * from outside the Table subcomponents (e.g. a "Select all / deselect all" menu).
 *
 * @returns {{ selectedValues: Set<string>, isAllSelected: boolean, isIndeterminate: boolean,
 *             toggleAll: Function, toggleRow: Function,
 *             selectAll: Function, deselectAll: Function,
 *             isSelected: Function } | null} The context value, or null when called outside a provider.
 */
export const useCheckboxTableContext = () => useContext( CheckboxTableContext );

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
const CheckboxHeader = forwardRef( ( { id, name, checked, indeterminate, onChange, disabled, "aria-label": ariaLabel, className = "", ...thProps }, ref ) => {
	const context = useContext( CheckboxTableContext );
	const inputRef = useRef( null );

	const resolvedChecked = checked ?? context?.isAllSelected ?? false;
	const resolvedIndeterminate = indeterminate ?? context?.isIndeterminate ?? false;
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
				className="yst-checkbox__input"
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
const CheckboxCell = forwardRef( ( { id, name, value, checked, onChange, disabled, label, className = "", ...checkboxProps }, ref ) => {
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
Table.CheckboxHeader = CheckboxHeader;
Table.CheckboxHeader.displayName = "Table.CheckboxHeader";
Table.CheckboxCell = CheckboxCell;
Table.CheckboxCell.displayName = "Table.CheckboxCell";
Table.CheckboxProvider = CheckboxProvider;
Table.CheckboxProvider.displayName = "Table.CheckboxProvider";

export default Table;
