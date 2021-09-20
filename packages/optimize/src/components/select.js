import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Select } from "@yoast/admin-ui-toolkit/components";
import { OPTIMIZE_STORE_KEY } from "../constants";

/**
 * Maps a value:label object of choices to an array of choices.
 * @param {Object} choices          An object with values as keys and labels as values.
 *
 * @returns {Array} The array of choices.
 */
const mapChoices = ( choices ) => Object.entries( choices ).map( ( [ type, label ] ) => ( {
	id: type === "" ? "default" : type,
	value: type,
	label: label,
} ) );


/**
 * The container connecting the Select component to the store.
 *
 * @param {Object} props The props to pass to the Select component.
 *
 * @returns {JSX.Element} The connected Select component.
 */
export default compose( [
	withSelect( ( select, { dataPath, choicesMap } ) => {
		const { getData } = select( OPTIMIZE_STORE_KEY );

		let value = getData( dataPath );
		if ( ! value && value !== false ) {
			value = "";
		}

		return {
			// Value should be a string
			value: value.toString(),
			id: dataPath,
			choices: mapChoices( choicesMap ),
		};
	} ),
	withDispatch( ( dispatch, { dataPath } ) => {
		const {
			setData,
		} = dispatch( OPTIMIZE_STORE_KEY );

		return {
			onChange: ( event ) => {
				switch ( event ) {
					case "false":
						event = false;
						break;
					case "true":
						event = true;
						break;
					case "":
						event = "";
						break;
					default:
						break;
				}
				setData( dataPath, event );
			},
		};
	} ),
] )( Select );
