import Select from "react-select/lib/Async";
import { Component, Fragment } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { debounce } from "lodash";
import { createGlobalStyle } from "styled-components";
import { Label } from "@yoast/components";
import { __ } from "@wordpress/i18n";

/**
 * Styles to overwrite react-select styles.
 */
const Styles = createGlobalStyle`
	.yoast-person-selector-container {
		width: 250px;
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
			selectedOption: props.properties.user || null,
		};

		this.fetchUsers = debounce( this.fetchUsers, 500 ).bind( this );
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
				<Label
					for={ this.props.name }
					optionalAttributes={ {
						className: "yoast-wizard-text-input-label",
					} }
				>
					{ __( "The name of the person", "wordpress-seo" ) }
				</Label>
				<Select
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
		}, () => {
			this.props.onChange( option.value );
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
		const queryParameters = WordPressUserSelector.createQueryString( {
			/* eslint-disable-next-line camelcase */
			per_page: 10,
			search: input,
		} );

		apiFetch( {
			path: `/wp/v2/users?${ queryParameters }`,
		} ).then( users => {
			const mappedUsers = users.map(
				user => ( { value: user.id, label: user.name } )
			);

			callback( mappedUsers );
		} );
	}
}


export default WordPressUserSelector;
