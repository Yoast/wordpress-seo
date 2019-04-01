import Select from "react-select/lib/Async";
import { Component, Fragment } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { debounce } from "lodash";
import { createGlobalStyle } from "styled-components";

const Styles = createGlobalStyle`
	.yoast-person-selector-container {
		background: navy;
	}
`;

class WordPressUserSelector extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedOption: props.properties.user || null,
		};

		this.fetchUsers = debounce( this.fetchUsers, 500 ).bind( this );
		this.onChange = this.onChange.bind( this );
	}

	render() {
		return (
			<Fragment>
				<Styles />
				<Select
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

	onChange( option ) {
		const {
			name,
		} = this.props;

		this.setState( {
			selectedOption: option,
		}, () => {
			this.props.onChange( {
				target: {
					name: name,
					value: option.value,
				},
			} );
		} );
	}

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
