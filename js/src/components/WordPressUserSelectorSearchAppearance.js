import { Component, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

import WordPressUserSelector from "./WordPressUserSelector";

class WordPressUserSelectorSearchAppearance extends Component {
	constructor( props ) {
		super( props );

		this.element      = document.getElementById( "person_id" );
		this.state = {
			value: this.getInitialValue(),
			name: null,
		};

		this.onChange = this.onChange.bind( this );
	}

	getInitialValue() {
		const value = this.element.value;

		let userId = null;
		if ( value !== "false" ) {
			userId = parseInt( value, 10 );
		}

		return userId;
	}

	onChange( value, name ) {
		this.setState( { value, name }, () => {
			this.element.value = value;
		} );
	}

	renderError() {
		if ( this.state.value ) {
			return null;
		}

		return (
			<p className="error-message">
				{ __( "Error: Please select a user below to make your site's meta data complete.", "wordpress-seo" ) }
			</p>
		);
	}

	renderAuthorInfo() {
		if ( ! this.state.value ) {
			return null;
		}

		// translators: %1$s expands to the user's name, %2$s expands to an opening anchor tag, %3$s expands to a closing anchor tag.
		const message = sprintf(
			__( "You have selected the user %1$s as the person this site represents. " +
				"Their user profile information will now be used in search results. " +
				"%2$sUpdate their profile to make sure the information is correct.%3$s", "wordpress-seo" ),
			`{{strong}}${ this.state.name }{{/strong}}`,
			"{{authorEditLink}}",
			"{{/authorEditLink}}"
		);

		return interpolateComponents( {
			mixedString: message,
			components: {
				user: this.state.name,
				strong: <strong />,
				/* eslint-disable-next-line jsx-a11y/anchor-has-content */
				authorEditLink: <a href={ `http://local.wordpress.test/wp-admin/user-edit.php?user_id=${ this.state.value }` } />,
			},
		} );
	}

	render() {
		return (
			<Fragment>
				{ this.renderError() }
				<label
					htmlFor="wpseo-person-selector-name"
				>
					{ __( "Name:", "wordpress-seo" ) }
				</label>
				<WordPressUserSelector
					hasLabel={ false }
					name={ "wpseo-person-selector-name" }
					properties={ { user: this.state.value } }
					onChange={ this.onChange }
				/>
				<p>{ this.renderAuthorInfo() }</p>
			</Fragment>
		);
	}
}

export default WordPressUserSelectorSearchAppearance;
