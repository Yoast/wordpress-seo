/* global wpApiSettings */
import { useState, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { debounce, noop } from "lodash";
import { __ } from "@wordpress/i18n";
import { sendRequest } from "@yoast/helpers";
import YoastComboBox from "../../base/combo-box";

const HEADERS = {
	"X-WP-NONCE": wpApiSettings.nonce,
};

const REST_ROUTE = wpApiSettings.root;

/**
 * Fetches a list of users. Filterable.
 *
 * @param {String} query A search string to search users by.
 *
 * @returns {Promise} Returns the request response as a promise.
 */
function fetchUsers( query = "" ) {
	const url = `${ REST_ROUTE }wp/v2/users?per_page=20${ query ? `&search=${ encodeURIComponent( query ) }` : "" }`;
	return sendRequest( url, { method: "GET", headers: HEADERS } );
}

/**
 * A user selector based on a headlessui combobox.
 *
 * @param {Object}   props            The props.
 * @param {Object}   initialValue     The option selected by default in the combo box select with shape {id, name}.
 * @param {function} onChangeCallback Function to manage a selected option.
 * @param {string}   placeholder      YoastCombobox text input placeholder.
 *
 * @returns {WPElement} A user selector based on a headlessui combobox.
 */
export default function UserSelector( { initialValue, onChangeCallback, placeholder } ) {
	const [ users, setUsers ] = useState( [] );
	const [ selectedPerson, setSelectedPerson ] = useState( {
		value: initialValue.id,
		label: initialValue.name,
	} );
	const handleSelectChange = useCallback( ( event ) => {
		setSelectedPerson( event );
		onChangeCallback( event );
	} );

	const loadUsers = useCallback( debounce( async( searchQuery ) => {
		const usersResponse = await fetchUsers( searchQuery );
		setUsers( usersResponse.map( ( user ) => {
			return {
				value: user.id,
				label: user.name,
			};
		} ) );
	}, 500 ), [] );

	return <YoastComboBox
		value={ selectedPerson }
		label={ __( "Name", "wordpress-seo" ) }
		onChange={ handleSelectChange }
		onQueryChange={ loadUsers }
		options={ users }
		placeholder={ placeholder }
	/>;
}

UserSelector.propTypes = {
	initialValue: PropTypes.shape( {
		id: PropTypes.number,
		name: PropTypes.string,
	} ),
	onChangeCallback: PropTypes.func,
	placeholder: PropTypes.string,
};

UserSelector.defaultProps = {
	initialValue: {
		id: 0,
		name: "",
	},
	onChangeCallback: noop,
	placeholder: __( "Select a user", "wordpress-seo" ),
};
