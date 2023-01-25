/* global wpseoScriptData */

/* External dependencies */
import { Component, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/components";
import interpolateComponents from "interpolate-components";

/* Internal dependencies */
import WordPressUserSelector from "./WordPressUserSelector";

/**
 * Wrapper for WordPressUserSelector to be used on the search appearance page.
 */
class WordPressUserSelectorSearchAppearance extends Component {
	/**
	 * The WordPressUserSelectorSearchAppearance constructor.
	 *
	 * @param {Object} props The component's props.
	 */
	constructor( props ) {
		super( props );

		this.element = document.getElementById( "person_id" );
		this.state = {
			value: this.getInitialValue(),
			name: null,
		};

		this.onChange = this.onChange.bind( this );
	}

	/**
	 * Gets the user id from the hidden input field.
	 *
	 * @returns {number} The user id.
	 */
	getInitialValue() {
		return parseInt( this.element.value, 10 );
	}

	/**
	 * Handles change event for the user selector.
	 *
	 * First updates its internal state and then updates the hidden input.
	 *
	 * @param {number} value The user's id.
	 * @param {string} name  The user's name.
	 *
	 * @returns {void}
	 */
	onChange( value, name ) {
		this.setState( { value, name }, () => {
			this.element.value = value;
		} );
	}

	/**
	 * Renders an error message when no user has been selected.
	 *
	 * @returns {wp.Element} The rendered error message.
	 */
	renderError() {
		if ( this.state.value ) {
			return null;
		}

		return <Alert type={ "warning" }>
			{ __( "Please select a user below to make your site's meta data complete.", "wordpress-seo" ) }
		</Alert>;
	}

	/**
	 * Renders a message about the selected user when a user has been selected.
	 *
	 * @returns {wp.Element} The rendered message.
	 */
	renderAuthorInfo() {
		if ( ! this.state.value || ! this.state.name ) {
			return null;
		}

		// translators: %1$s expands to the user's name, %2$s expands to an opening anchor tag, %3$s expands to a closing anchor tag.
		const message = sprintf(
			__(
				// eslint-disable-next-line max-len
				"You have selected the user %1$s as the person this site represents. Their user profile information will now be used in search results. %2$sUpdate their profile to make sure the information is correct.%3$s",
				"wordpress-seo"
			),
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
				authorEditLink: <a href={ wpseoScriptData.searchAppearance.userEditUrl.replace( "{user_id}", this.state.value ) } />,
			},
		} );
	}

	/**
	 * Renders the WordPressUserSelectorSearchAppearance component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				{ this.renderError() }
				<label
					htmlFor="wpseo-person-selector-name"
				>
					{ __( "Name", "wordpress-seo" ) }
				</label>
				<WordPressUserSelector
					hasLabel={ false }
					name={ "wpseo-person-selector-name" }
					value={ this.state.value }
					onChange={ this.onChange }
				/>
				<p>{ this.renderAuthorInfo() }</p>
			</Fragment>
		);
	}
}

export default WordPressUserSelectorSearchAppearance;
