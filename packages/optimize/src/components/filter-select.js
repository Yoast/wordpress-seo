import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Select } from "@yoast/admin-ui-toolkit/components";

import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The container connecting the FilterSelect component to the store.
 *
 * @param {Object} props The props to pass to the FilterSelect component.
 *
 * @returns {JSX.Element} The connected Select.
 */
export default compose( [
	withSelect( ( select, { name, label, choices } ) => {
		const { getQueryData } = select( OPTIMIZE_STORE_KEY );
		return {
			value: getQueryData( `filters.${ name }`, choices[ 0 ]?.value ),
			label,
			placeholder: label,
			choices: choices.map( ( { value, ...choice } ) => ( {
				...choice,
				value,
				id: `filter-${ name }-${ value }`,
			} ) ),
		};
	} ),
	withDispatch( ( dispatch, { name } ) => {
		const { setQueryData } = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onChange: ( value ) => setQueryData( `filters.${ name }`, value ),
		};
	} ),
] )( Select );
