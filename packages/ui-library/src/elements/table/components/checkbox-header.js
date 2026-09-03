import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import Checkbox from "../../checkbox";

/**
 * @param {Object} [cellProps]   Extra props for the th element (e.g. colSpan, className).
 * @param {Object} [inputProps]  Props forwarded to the inner Checkbox. Supports all standard checkbox
 *                               props (id, name, checked, onChange, disabled, aria-label, etc.) plus
 *                               `indeterminate` (boolean) which renders the checkbox in the (−) state.
 * @returns {JSX.Element} The element.
 */
export const CheckboxHeader = ( { cellProps = {}, inputProps = {} } ) => {
	const inputRef = useRef( null );

	const { indeterminate, ...restInputProps } = inputProps;

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
				value="all"
				{ ...restInputProps }
			/>
		</th>
	);
};

CheckboxHeader.displayName = "Table.CheckboxHeader";
