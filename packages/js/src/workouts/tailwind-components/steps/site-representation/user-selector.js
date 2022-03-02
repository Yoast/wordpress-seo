/* global wpApiSettings */

import Select from "react-select/async";
import { Combobox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Component, Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { debounce } from "lodash-es";
import { __ } from "@wordpress/i18n";
import { sendRequest } from "@yoast/helpers";
import classNames from "classnames";

const HEADERS = {
	"X-WP-NONCE": wpApiSettings.nonce,
};

const REST_ROUTE = wpApiSettings.root;

async function fetchUser( id ) {
	const user = await sendRequest( `${ REST_ROUTE }wp/v2/users/${ id }`, { method: "GET", headers: HEADERS } );
	console.log( "in fetch user: ", user );
	return user;
}

/**
 * A user selector based on a headlessui combobox.
 *
 * @param {Object} props The props
 *
 * @returns {WPElement} A user selector based on a headlessui combobox.
 */
function UserSelector( { value, onChange } ) {
	const [ users, setUsers ] = useState( [] );
	const [ showOptions, setShowOptions ] = useState( false );
	const [ selectedPerson, setSelectedPerson ] = useState( users[ 0 ] );
	const [ query, setQuery ] = useState( "" );

	const fetchUsers = useCallback( debounce( async( input ) => {
		const params = {
			/* eslint-disable-next-line camelcase */
			per_page: 10,
			search: input,
		};

		const url = `${ REST_ROUTE }wp/v2/users`;

		const allQueryParams = { ...params };

		const newQueryParams = Object.keys( allQueryParams )
			.filter( key => !! allQueryParams[ key ] )
			.map( key => `${ key }=${ encodeURIComponent( allQueryParams[ key ] ) }` )
			.join( "&" );

		const fullUrl = `${ url }?${ newQueryParams }`;
		const usersResponse = await sendRequest( fullUrl, { method: "GET", headers: HEADERS } );
		setUsers( usersResponse.map( ( user ) => {
			return {
				value: user.id,
				label: user.name,
			};
		} ) );
	}, 500 ), [] );

	useEffect( () => {
		fetchUsers( query );
	}, [ query ] );

	useEffect( async() => {
		if ( value !== 0 ) {
			const user = await fetchUser( value );
			console.log( "user: ", user, "value ", value );
			setSelectedPerson( {
				value: user.id,
				label: user.name,
			} );
		}
	}, [ value ] );

	return <Combobox as="div" value={ selectedPerson } onChange={ onChange }>
		{
			( { open } ) => {
				return <Fragment>
					<Combobox.Label className="yst-block yst-text-sm yst-font-medium yst-text-gray-700">{ __( "Name", "wordpress-seo" ) }</Combobox.Label>
					<div className="yst-h-[45px] yst-max-w-sm yst-relative yst-mt-1">
						<Combobox.Input
							className="yst-w-full yst-rounded-md yst-border yst-border-gray-300 yst-bg-white yst-py-2 yst-pl-3 yst-pr-10 yst-shadow-sm focus:yst-border-primary-500 focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500 sm:yst-text-sm"
							onChange={ ( event ) => setQuery( event.target.value ) }
							onClick={ () => setShowOptions( true ) }
							onBlur={ ( event ) => {
								// The button next to the input was not clicked
								if ( event.relatedTarget !== event.target.nextSibling ) {
									setShowOptions( false );
								}
							} }
							displayValue={ ( person ) => person.label }
							placeholder={ __( "Select a user", "wordpress-seo" ) }
						/>
						<Combobox.Button id="configuration-user-select-button" className="yst-absolute yst-inset-y-0 yst-right-0 yst-flex yst-items-center yst-rounded-r-md yst-px-2 focus:yst-outline-none">
							<SelectorIcon className="yst-h-5 yst-w-5 yst-text-gray-400" aria-hidden="true" />
						</Combobox.Button>

						{ ( users.length > 0 && ( open || showOptions ) ) && (
							<Combobox.Options static={ true } className="yst-absolute yst-z-10 yst-mt-1 yst-max-h-60 yst-w-full yst-overflow-auto yst-rounded-md yst-bg-white yst-py-1 yst-text-base yst-shadow-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 focus:yst-outline-none sm:yst-text-sm">
								{ users.map( ( person ) => {
									return <Combobox.Option
										key={ `user-${ person.value }` }
										value={ person }
										className={ ( { active } ) =>
											classNames(
												"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9",
												active ? "yst-bg-primary-500 yst-text-white" : "yst-text-gray-900"
											)
										}
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

/**
 * Allows a user to be selected within a WordPress context.
 */
class WordPressUserSelector extends Component {
	/**
	 * The WordPressUserSelector constructor.
	 *
	 * @param {Object} props The component props.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			selectedOption: null,
			loading: !! this.props.value,
		};

		this.fetchUsers = debounce( this.fetchUsers, 500 ).bind( this );
		this.fetchUser = this.fetchUser.bind( this );
		this.mapUserToSelectOption = this.mapUserToSelectOption.bind( this );
		this.onChange = this.onChange.bind( this );
	}

	/**
	 * Renders the WordPressUserSelector component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				<Select
					placeholder={ __( "Select a user...", "wordpress-seo" ) }
					isDisabled={ this.state.loading }
					inputId={ this.props.name }
					className={ "yoast-person-selector-container" }
					classNamePrefix={ "yoast-person-selector" }
					value={ this.state.selectedOption }
					onChange={ this.onChange }
					defaultOptions={ true }
					loadOptions={ this.fetchUsers }
				/>
				<UserSelector
					value={ this.props.value }
					onChange={ this.props.onChange }
				/>
			</Fragment>
		);
	}

	/**
	 * If a user id is defined fetch the currently selected user.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		if ( this.props.value ) {
			this.fetchUser( this.props.value );
		}
	}

	/**
	 * Adds additional query parameters to an existing URL. Also encodes existing query parameters.
	 *
	 * @param {string} url    The URL.
	 * @param {Object} params Params for in the query string.
	 *
	 * @returns {string} URI encoded query string.
	 */
	static addQueryParams( url, params ) {
		const urlParts = url.split( "?" );

		url = urlParts[ 0 ];

		const allQueryParams = { ...params };

		if ( urlParts.length === 2 ) {
			urlParts[ 1 ].split( "&" ).forEach( part => {
				const item = part.split( "=" );

				allQueryParams[ item[ 0 ] ] = item[ 1 ];
			} );
		}

		const newQueryParams = Object.keys( allQueryParams )
			.filter( key => !! allQueryParams[ key ] )
			.map( key => `${ key }=${ encodeURIComponent( allQueryParams[ key ] ) }` )
			.join( "&" );

		return `${ url }?${ newQueryParams }`;
	}

	/**
	 * Handles the onChange event.
	 *
	 * @param {{ value: number, label: string }} option The selected option.
	 *
	 * @returns {void}
	 */
	onChange( option ) {
		this.setState( {
			selectedOption: option,
			loading: false,
		}, () => {
			this.props.onChange( option.value, option.label );
		} );
	}

	/**
	 * Maps a WordPress user API result to a react-select option.
	 *
	 * @param {Object} user The WordPress user object.
	 *
	 * @returns {Object} The mapped user for react-select.
	 */
	mapUserToSelectOption( user ) {
		return {
			value: user.id,
			label: user.name,
		};
	}

	/**
	 * Fetches a single WordPress user.
	 *
	 * Is only called from componentDidMount and assumes the component is already in a loading state.
	 *
	 * @param {string|number} id The user id.
	 *
	 * @returns {void}
	 */
	fetchUser( id ) {
		sendRequest( `${ REST_ROUTE }wp/v2/users/${ id }`, { method: "GET", headers: HEADERS } )
			.then( user => {
				if ( user ) {
					this.onChange( this.mapUserToSelectOption( user ) );
					// Setting the state to `loading: false` is already done in the `onChange` function.
					return;
				}
				this.setState( { loading: false } );
			} )
			.catch( () => {
				this.setState( { loading: false } );
			} );
	}

	/**
	 * Searches for WordPress users.
	 *
	 * @param {string}   input    The search term.
	 * @param {function} callback Callback to be called with users.
	 *
	 * @returns {void}
	 */
	fetchUsers( input, callback ) {
		const params = {
			/* eslint-disable-next-line camelcase */
			per_page: 10,
			search: input,
		};

		const url = WordPressUserSelector.addQueryParams( `${ REST_ROUTE }wp/v2/users`, params );

		sendRequest( url, { method: "GET", headers: HEADERS } )
			.then( users => {
				const mappedUsers = users.map( this.mapUserToSelectOption );

				callback( mappedUsers );
			} );
	}
}

export const WordPressUserSelectorPropTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
};

WordPressUserSelector.propTypes = WordPressUserSelectorPropTypes;

export default WordPressUserSelector;
