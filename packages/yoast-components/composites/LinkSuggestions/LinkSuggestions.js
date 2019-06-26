/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import LinkSuggestion from "./LinkSuggestion";
import Clipboard from "clipboard";
import interpolateComponents from "interpolate-components";
import { speak } from "@wordpress/a11y";
import styled from "styled-components";
import { isEqual } from "lodash-es";

/* Internal dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const HelpTextLink = makeOutboundLink();

const LinkSuggestionsWrapper = styled.div`
	display: table-cell;
`;

/**
 * Represents the Suggestions component.
 */
class LinkSuggestions extends React.Component {
	/**
	 * @constructor
	 *
	 * @param {Object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

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
		const message = __( "Copied!", "yoast-components" );

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
		const message = __( "Not supported!", "yoast-components" );

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
		const articleLinkString = __(
			"Read {{a}}our article about site structure{{/a}} " +
			"to learn more about how internal linking can help improve your SEO.", "yoast-components" );

		const articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <HelpTextLink href="https://yoa.st/site-structure-metabox" />,
			},
		} );

		const noRelevantPostsMessage = __(
			"We could not find any relevant articles on your website that you could link to from your post.", "yoast-components" );

		const moreCopyMessage = __(
			"Once you add a bit more copy, we'll give you a list of related " +
			"content here to which you could link in your post.", "yoast-components" );

		// If there is not enough text to calculate Prominent Words an "Add a bit more copy" message is returned.
		if ( isEqual( this.props.prominentWords, [] ) ) {
			return (
				<div>
					<p>{ moreCopyMessage }</p>
					<p>{ articleLink }</p>
				</div>
			);
		}

		// Otherwise we return a message that no relevant posts are found.
		return (
			<div>
				<p>{ noRelevantPostsMessage }</p>
				<p>{ articleLink }</p>
			</div>
		);
	}

	/**
	 * @summary Renders the suggestions.
	 *
	 * @returns {React.Element} The rendered suggestions HTML.
	 */
	render() {
		const suggestions = this.props.suggestions;
		const maximumSuggestions = this.props.maxSuggestions;

		// Translators: Text between {{a}} and {{/a}} will be a link to an article about site structure.
		const articleLinkString = __(
			"This is a list of related content to which you could link in your post. " +
			"{{a}}Read our article about site structure{{/a}} " +
			"to learn more about how internal linking can help improve your SEO.", "yoast-components" );

		const articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <HelpTextLink href="https://yoa.st/site-structure-metabox" />,
			},
		} );

		if ( suggestions.length === 0 ) {
			return this.renderEmptyList();
		}
		if ( suggestions.length > maximumSuggestions ) {
			suggestions.length = maximumSuggestions;
		}

		const cornerStoneSuggestions = this.getCornerstoneSuggestions();
		const defaultSuggestions = this.getDefaultSuggestions();

		return (
			<LinkSuggestionsWrapper>
				<p>{ articleLink }</p>
				{ cornerStoneSuggestions }
				{ defaultSuggestions }
			</LinkSuggestionsWrapper>
		);
	}

	/**
	 * Returns the cornerstone suggestions values.
	 *
	 * @returns {React.Element} The values to use.
	 */
	getCornerstoneSuggestions() {
		const suggestions = this.filterSuggestionsByCornerstone( true );

		if ( suggestions.length === 0 ) {
			return null;
		}

		// Translators: Text between {{a}} and {{/a}} will be a link to an article about cornerstone content.
		const articleLinkString = __( "Consider linking to these {{a}}cornerstone articles:{{/a}}", "yoast-components" );
		const articleLink = interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <HelpTextLink href="https://yoa.st/metabox-ls-help-cornerstone" />,
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
		const suggestions = this.filterSuggestionsByCornerstone( false );

		if ( suggestions.length === 0 ) {
			return null;
		}

		return this.getSuggestionsList( __( "Consider linking to these articles:", "yoast-components" ), suggestions );
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
				{ suggestions.map( ( suggestion, key ) => <LinkSuggestion key={ key } { ...suggestion } /> ) }
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
	prominentWords: PropTypes.array.isRequired,
	maxSuggestions: PropTypes.number,
};

LinkSuggestions.defaultProps = {
	maxSuggestions: 10,
};

export default LinkSuggestions;
