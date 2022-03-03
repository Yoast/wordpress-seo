/* global wpApiSettings */
import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { debounce, noop } from "lodash";
import { __ } from "@wordpress/i18n";
import { sendRequest } from "@yoast/helpers";
import classNames from "classnames";
import YoastComboBox from "../../base/combo-box";

const HEADERS = {
	"X-WP-NONCE": wpApiSettings.nonce,
};

const REST_ROUTE = wpApiSettings.root;

/**
 * Fetches a user.
 *
 * @param {Integer} id The id belonging to the user to fetch.
 *
 * @returns {Promise} Returns the request response as a promise.
 */
function fetchUser( id ) {
	return sendRequest( `${ REST_ROUTE }wp/v2/users/${ id }`, { method: "GET", headers: HEADERS } );
}

/**
 * Fetches a list of users. Filterable.
 *
 * @param {String} query A search string to search users by.
 *
 * @returns {Promise} Returns the request response as a promise.
 */
function fetchUsers( query = "" ) {
	const url = `${ REST_ROUTE }wp/v2/users?per_page=10${ query ? `&search=${ encodeURIComponent( query ) }` : "" }`;
	return sendRequest( url, { method: "GET", headers: HEADERS } );
}

/**
 * A user selector based on a headlessui combobox.
 *
 * @param {Object} props The props
 *
 * @returns {WPElement} A user selector based on a headlessui combobox.
 */
export default function UserSelector( { initialValue, onChangeCallback, placeholder } ) {
	const [ users, setUsers ] = useState( [] );
	const [ selectedPerson, setSelectedPerson ] = useState( null );
	const [ query, setQuery ] = useState( "" );

	/**
	 * If a nonzero initialValue was passed, fetch the user belonging to that id on mount.
	 * This effect should not happen on every initialValue change, since it might be coupled to the onChangeCallback.
	 */
	useEffect( async() => {
		if ( initialValue !== 0 ) {
			const user = await fetchUser( initialValue );
			const selectObject = {
				value: user.id,
				label: user.name,
			};
			setSelectedPerson( selectObject );

			// Let wrapper know name if needed:
			onChangeCallback( selectObject );
		}
	}, [] );

	const handleSelectChange = useCallback( ( event ) => {
		setQuery( "" );
		setSelectedPerson( event );
		onChangeCallback( event );
	} );

	const handleInputChange = useCallback( ( event ) => {
		setQuery( event.target.value );
	}, [ setQuery ] );

	const loadUsers = useCallback( debounce( async( searchQuery ) => {
		const usersResponse = await fetchUsers( searchQuery );
		setUsers( usersResponse.map( ( user ) => {
			return {
				value: user.id,
				label: user.name,
			};
		} ) );
	}, 500 ), [] );

	useEffect( () => {
		loadUsers( query );
	}, [ query ] );

	return <YoastComboBox
		value={ selectedPerson }
		onChange={ handleSelectChange }
		onInputChange={ handleInputChange }
		options={ users }
		placeholder={ placeholder }
	/>;
}

UserSelector.propTypes = {
	initialValue: PropTypes.number,
	onChangeCallback: PropTypes.func,
	placeholder: PropTypes.string,
};

UserSelector.defaultProps = {
	initialValue: 0,
	onChangeCallback: noop,
	placeholder: __( "Select a user", "wordpress-seo" ),
};
