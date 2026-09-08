import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Checkbox from "../../checkbox";

/**
 * @param {Object} [cellProps]     Extra props for the th element (e.g. colSpan, className).
 * @param {Object} [checkboxProps] Props forwarded to the inner Checkbox. Supports all standard checkbox
 *                                 props (id, name, value, checked, onChange, disabled, aria-label, etc.)
 *                                 plus `indeterminate` (boolean) which renders the checkbox in the (−) state.
 * @returns {JSX.Element} The element.
 */
export const CheckboxHeader = ( { cellProps = {}, checkboxProps = {} } ) => {
	const inputRef = useRef( null );

	const { indeterminate, ...restCheckboxProps } = checkboxProps;

	useEffect( () => {
		if ( inputRef.current ) {
			inputRef.current.indeterminate = Boolean( indeterminate );
		}
	}, [ indeterminate ] );

	return (
		<th
			{ ...cellProps }
			className={ classNames( "yst-table-checkbox-header", cellProps?.className ) }
		>
			<Checkbox
				ref={ inputRef }
				{ ...restCheckboxProps }
			/>
		</th>
	);
};

CheckboxHeader.displayName = "Table.CheckboxHeader";
