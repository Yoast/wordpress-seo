import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Checkbox } from "@yoast/admin-ui-toolkit/components";
import { without } from "lodash";

import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * The container connecting the Checkbox component to the store.
 *
 * @returns {JSX.Element} The connected Checkbox.
 */
export default compose( [
	withSelect( ( select, { dataPath, value } ) => {
		const { getData } = select( OPTIMIZE_STORE_KEY );
		const state = getData( dataPath, [] );
		return {
			name: dataPath,
			checked: Boolean( state.find( ( stateValue ) => stateValue === value ) ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath }, { select } ) => {
		const { getData } = select( OPTIMIZE_STORE_KEY );
		const { replaceArrayData } = dispatch( OPTIMIZE_STORE_KEY );
		const state = getData( dataPath, [] );
		return {
			onChange: ( event ) => {
				const { checked, value } = event.target;
				replaceArrayData( dataPath, checked ? [ ...state, value ] : without( state, value ) );
			},
		};
	} ),
] )( Checkbox );
