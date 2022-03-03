/* global wpApiSettings */
import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { debounce, noop } from "lodash";
import { __ } from "@wordpress/i18n";
import { sendRequest } from "@yoast/helpers";
import classNames from "classnames";

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
 * A function needed to extract the label to display when a person is selected.
 *
 * @param {*} person The object to get a display value for.
 *
 * @returns {string|null} The value to display. Returns null if there is no label.
 */
function getDisplayValue( person ) {
	return person && person.label ? person.label : null;
}

/**
 * Helper function to get active styles for select options.
 *
 * @param {boolean} options.active Whether the option is active.
 *
 * @returns {string} Styles for an active option.
 */
function getOptionActiveStyles( { active } ) {
	return classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9",
		active ? "yst-bg-primary-500 yst-text-white" : "yst-text-gray-900"
	);
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

	return <Combobox as="div" value={ selectedPerson } onChange={ handleSelectChange }>
		{
			( { open } ) => {
				return <Fragment>
					<Combobox.Label className="yst-block yst-text-sm yst-font-medium yst-text-gray-700">{ __( "Name", "wordpress-seo" ) }</Combobox.Label>
					<div className="yst-h-[45px] yst-max-w-sm yst-relative yst-mt-1">
						<Combobox.Input
							className="yst-w-full yst-rounded-md yst-border yst-border-gray-300 yst-bg-white yst-py-2 yst-pl-3 yst-pr-10 yst-shadow-sm focus:yst-border-primary-500 focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500 sm:yst-text-sm"
							onChange={ handleInputChange }
							displayValue={ getDisplayValue }
							placeholder={ placeholder }
						/>
						<Combobox.Button id="configuration-user-select-button" className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-rounded-r-md yst-px-2 focus:yst-outline-none">
							<SelectorIcon className="yst-h-5 yst-w-5 yst-text-gray-400" aria-hidden="true" />
						</Combobox.Button>

						{ ( users.length > 0 && open ) && (
							<Combobox.Options static={ true } className="yst-absolute yst-z-10 yst-mt-1 yst-max-h-60 yst-w-full yst-overflow-auto yst-rounded-md yst-bg-white yst-py-1 yst-text-base yst-shadow-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm">
								{ users.map( ( person ) => {
									return <Combobox.Option
										key={ `user-${ person.value }` }
										value={ person }
										className={ getOptionActiveStyles }
									>
										{ ( { active, selected } ) => (
											<>
												<span className={ classNames( "yst-block yst-truncate", selected && "yst-font-semibold" ) }>{ person.label }</span>

												{ selected && (
													<span
														className={ classNames(
															"yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-pr-4",
															active ? "yst-text-white" : "yst-text-primary-500"
														) }
													>
														<CheckIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
													</span>
												) }
											</>
										) }
									</Combobox.Option>;
								} ) }
							</Combobox.Options>
						) }
					</div>
				</Fragment>;
			}
		}
	</Combobox>;
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
