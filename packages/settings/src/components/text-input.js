import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { TextInput } from "@yoast/admin-ui-toolkit/components";
import { REDUX_STORE_KEY } from "../constants";

/**
 * The container connecting the TextInput component to the store.
 *
 * @param {Object} props The props to pass to the TextInput component.
 *
 * @returns {JSX.Element} The connected TextInput.
 */
export default compose( [
	withSelect( ( select, { dataPath, id } ) => {
		const {
			getData,
			getValidationErrorProp,
		} = select( REDUX_STORE_KEY );

		return {
			// Prevent null from being loaded as value with an extra check, as null can come from the database.
			value: getData( dataPath, "" ) ?? "",
			error: getValidationErrorProp( dataPath ),
			// Fallback to dataPath for id prop
			id: id || dataPath,
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( REDUX_STORE_KEY );

		return {
			onChange: ( event ) => setData( dataPath, event.target.value ),
		};
	} ),
] )( TextInput );
