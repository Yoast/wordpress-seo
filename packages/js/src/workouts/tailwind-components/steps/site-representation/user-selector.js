/* global wpApiSettings */

import Select from "react-select/async";
import { Component, Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import { debounce } from "lodash-es";
import { __ } from "@wordpress/i18n";
import { sendRequest } from "@yoast/helpers";

const HEADERS = {
	"X-WP-NONCE": wpApiSettings.nonce,
};

const REST_ROUTE = wpApiSettings.root;

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
