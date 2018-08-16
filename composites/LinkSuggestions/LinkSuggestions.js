import React from "react";
import PropTypes from "prop-types";
import LinkSuggestion from "./composites/LinkSuggestion";
import Clipboard from "clipboard";
import { localize } from "../../utils/i18n";
import interpolateComponents from "interpolate-components";
import { speak } from "@wordpress/a11y";

/**
 * Represents the Suggestions component.
 */
class LinkSuggestions extends React.Component {
	/**
	 * @constructor
	 *
	 * @returns {void}
	 */
	constructor() {
		super();

		this.state = {
			clipboard: new Clipboard( ".yoast-link-suggestion__copy" ),
		};

		this.state.clipboard.on( "success", this.handleSuccess.bind( this ) );

		this.state.clipboard.on( "error", this.handleError.bind( this ) );
	}

	/**
	 * @summary Handles visual feedback and keyboard focus on Clipboard copy success.
	 *
	 * @param {Object} evt Clipboard.js custom DOM event.
	 * @returns {void}
	 */
	handleSuccess( evt ) {
		let message = this.props.translate( "Copied!" );

		// Move focus back to the Clipboard trigger button.
		evt.trigger.focus();
		// Update the button `aria-label` attribute.
		evt.trigger.setAttribute( "aria-label", message );
		// Update the button `data-label` attribute.
		evt.trigger.setAttribute( "data-label", message );
		// Send audible message to the ARIA live region.
		speak( message, "assertive" );
	}

	/**
	 * @summary Handles visual feedback on Clipboard copy error.
	 *
	 * @param {Object} evt Clipboard.js custom DOM event.
	 * @returns {void}
	 */
	handleError( evt ) {
		let message = this.props.translate( "Not supported!" );

		// Update the button `aria-label` attribute.
		evt.trigger.el.setAttribute( "aria-label", message );
		// Update the button `data-label` attribute.
		evt.trigger.setAttribute( "data-label", message );
		// Send audible message to the ARIA live region.
		speak( message, "assertive" );
	}

	/**
	 * Renders the component for when there are no link suggestions.
	 *
	 * @returns {React.Element} The rendered empty list
	 */
	renderEmptyList() {
		// Translators: Text between {{a}} and {{/a}} will be a link to an article about site structure.
		let articleLinkString = this.props.translate( "Read {{a}}our article about site structure{{/a}} " +
		                                              "to learn more about how internal linking can help improve your SEO." );

		let articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <a href="https://yoa.st/site-structure-metabox" />,
			},
		} );

		let moreCopyMessage = this.props.translate( "Once you add a bit more copy, we'll give you a list of related " +
		                                            "content here to which you could link in your post." );

		return (
			<div>
				<p>{moreCopyMessage}</p>
				<p>{articleLink}</p>
			</div>
		);
	}

	/**
	 * @summary Renders the suggestions.
	 *
	 * @returns {React.Element} The rendered suggestions HTML.
	 */
	render() {
		let suggestions = this.props.suggestions;
		let maximumSuggestions = this.props.maxSuggestions;

		// Translators: Text between {{a}} and {{/a}} will be a link to an article about site structure.
		let articleLinkString = this.props.translate( "This is a list of related content to which you could link in your post. " +
		                                              "Read {{a}}our article about site structure{{/a}} " +
		                                              "to learn more about how internal linking can help improve your SEO." );
		let articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <a href="https://yoa.st/site-structure-metabox" />,
			},
		} );

		if ( suggestions.length === 0 ) {
			return this.renderEmptyList();
		}
		if ( suggestions.length > maximumSuggestions ) {
			suggestions.length = maximumSuggestions;
		}

		let cornerStoneSuggestions = this.getCornerstoneSuggestions();
		let defaultSuggestions = this.getDefaultSuggestions();

		return (
			<div>
				<p>{articleLink}</p>
				{ cornerStoneSuggestions }
				{ defaultSuggestions }
			</div>
		);
	}

	/**
	 * Returns the cornerstone suggestions values.
	 *
	 * @returns {React.Element} The values to use.
	 */
	getCornerstoneSuggestions() {
		let suggestions = this.filterSuggestionsByCornerstone( true );

		if ( suggestions.length === 0 ) {
			return null;
		}

		// Translators: Text between {{a}} and {{/a}} will be a link to an article about cornerstone content.
		let articleLinkString = this.props.translate( "Consider linking to these {{a}}cornerstone articles:{{/a}}" );
		let articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <a href="https://yoa.st/metabox-ls-help-cornerstone" rel="noopener noreferrer" target="_blank" />,
			},
		} );

		return this.getSuggestionsList( articleLink, suggestions );
	}

	/**
	 * Returns the non cornerstone suggestions values.
	 *
	 * @returns {React.Element} The values to use.
	 */
	getDefaultSuggestions() {
		let suggestions = this.filterSuggestionsByCornerstone( false );

		if ( suggestions.length === 0 ) {
			return null;
		}

		return this.getSuggestionsList( this.props.translate( "Consider linking to these articles:" ), suggestions );
	}

	/**
	 * Returns a generated suggestions list based on the given parameters.
	 *
	 * @param {string|Object} context     The context to show.
	 * @param {Object[]}       suggestions The suggestions to show
	 *
	 * @returns {React.Element} The generated component.
	 */
	getSuggestionsList( context, suggestions ) {
		return (
			<div>
				<p>{ context }</p>
				{ suggestions.map( ( suggestion, key ) => <LinkSuggestion key={key} {...suggestion} /> ) }
			</div>
		);
	}

	/**
	 * Filters the suggestions by cornerstone or not
	 *
	 * @param {bool} isCornerstone Keep only cornerstone or filter all out.
	 *
	 * @returns {Object[]} The filtered array.
	 */
	filterSuggestionsByCornerstone( isCornerstone = true ) {
		return this.props.suggestions.filter(
			( suggestion ) => {
				return suggestion.isCornerstone === isCornerstone;
			}
		);
	}
}

LinkSuggestions.propTypes = {
	suggestions: PropTypes.array.isRequired,
	translate: PropTypes.func,
	maxSuggestions: PropTypes.number,
};

LinkSuggestions.defaultProps = {
	maxSuggestions: 10,
};

export default localize( LinkSuggestions );
