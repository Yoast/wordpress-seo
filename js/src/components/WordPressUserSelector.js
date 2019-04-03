import Select from "react-select/lib/Async";
import { Component, Fragment } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { createGlobalStyle } from "styled-components";
import { __ } from "@wordpress/i18n";

/**
 * Styles to overwrite react-select styles.
 */
const Styles = createGlobalStyle`
	.yoast-person-selector-container {
		max-width: 100%;
		min-width: 250px;
		margin: 7px 0;

		.yoast-person-selector__control {
			border-radius: 0;
			box-shadow: inset 0 1px 2px rgba(0,0,0,.07);
		}
	
		input[type=text] {
			box-shadow: none;
			margin: 0;
		}
	}
`;

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
			loading: this.props.properties.user !== null,
		};

		this.fetchUsers = debounce( this.fetchUsers, 500 ).bind( this );
		this.fetchUser = this.fetchUser.bind( this );
		this.onChange = this.onChange.bind( this );
	}

	/**
	 * Renders the WordPressUserSelector component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				<Styles />
				<Select
					placeholder={ __( "Start typing", "wordpress-seo" ) }
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

	componentDidMount() {
		if ( this.props.properties.user !== null ) {
			this.fetchUser( this.props.properties.user );
		}
	}

	/**
	 * Creates a query string from a params object.
	 *
	 * @param {Object} params Params for in the query string.
	 *
	 * @returns {string} URI encoded query string.
	 */
	static createQueryString( params ) {
		return Object.keys( params )
			.filter( key => !! params[ key ] )
			.map( key => `${ encodeURIComponent( key ) }=${ encodeURIComponent( params[ key ] ) }` )
			.join( "&" );
	}

	/**
	 * Handles the onChange event.
	 *
	 * @param {{ value: number, label: string}} option The selected option.
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

	mapUser( user ) {
		return {
			value: user.id,
			label: user.name,
		};
	}

	async fetchUser( id ) {
		const user = await apiFetch( {
			path: `/wp/v2/users/${ id }`,
		} );

		if ( ! user ) {
			this.setState( { loading: false } );

			return;
		}

		this.onChange( this.mapUser( user ) );
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
		const queryParameters = WordPressUserSelector.createQueryString( {
			/* eslint-disable-next-line camelcase */
			per_page: 10,
			search: input,
		} );

		apiFetch( {
			path: `/wp/v2/users?${ queryParameters }`,
		} ).then( users => {
			const mappedUsers = users.map( this.mapUser );

			callback( mappedUsers );
		} );
	}
}

WordPressUserSelector.propTypes = {
	name: PropTypes.string.isRequired,
	properties: PropTypes.shape( {
		user: PropTypes.number,
	} ).isRequired,
	onChange: PropTypes.func.isRequired,
};

export default WordPressUserSelector;
