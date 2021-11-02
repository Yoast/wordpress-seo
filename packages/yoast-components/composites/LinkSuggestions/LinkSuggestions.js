/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import LinkSuggestion from "./LinkSuggestion";
import Clipboard from "clipboard";
import interpolateComponents from "interpolate-components";
import { speak } from "@wordpress/a11y";
import styled from "styled-components";

/* Internal dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const HelpTextLink = makeOutboundLink();

const LinkSuggestionsWrapper = styled.div`
	display: table-cell;
`;

const noRelevantPostsMessage = __(
	"We could not find any relevant articles on your website that you could link to from your post.",
	"wordpress-seo"
);

// Translators: Text between {{a}} and {{/a}} will be a link to an article about site structure.
const articleLinkString = __(
	"{{a}}Read our article about site structure{{/a}} to learn more about how internal linking can help improve your SEO.",
	"wordpress-seo"
);

// Translators: Text between {{a}} and {{/a}} will be a link to an article about cornerstone content.
const cornerstoneLinkString = __( "Consider linking to these {{a}}cornerstone articles:{{/a}}", "wordpress-seo" );

const nonCornerstoneLinkString = __( "Consider linking to these articles:", "wordpress-seo" );

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
		const message = __( "Copied!", "wordpress-seo" );

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
		const message = __( "Not supported!", "wordpress-seo" );

		// Update the button `aria-label` attribute.
		evt.trigger.el.setAttribute( "aria-label", message );
		// Update the button `data-label` attribute.
		evt.trigger.setAttribute( "data-label", message );
		// Send audible message to the ARIA live region.
		speak( message, "assertive" );
	}

	/**
	 * Renders the component for when there are no link suggestions. If there is not enough text to calculate Prominent Words
	 * or if no Prominent Words could be found, an "Add a bit more copy" message is returned. Otherwise we return a message
	 * that no relevant posts are found.
	 *
	 * @returns {React.Element} The rendered empty list
	 */
	renderEmptyList() {
		let lengthMessage = this.props.customMessages.lengthMessage;
		lengthMessage = lengthMessage === "" ? noRelevantPostsMessage : lengthMessage;

		return (
			<div>
				<p>{ lengthMessage }</p>
				<p>{ this.props.customMessages.metaMessage }</p>
				<p>{ this.getArticleLink() }</p>
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
				{ cornerStoneSuggestions }
				{ defaultSuggestions }
				<p>{ this.getArticleLink() }</p>
				<p>{ this.props.customMessages.metaMessage }</p>
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

		const cornerstoneLink = interpolateComponents( {
			mixedString: cornerstoneLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <HelpTextLink href="https://yoa.st/metabox-ls-help-cornerstone" />,
			},
		} );

		return this.getSuggestionsList( cornerstoneLink, suggestions );
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

		return this.getSuggestionsList( nonCornerstoneLinkString, suggestions );
	}

	/**
	 * Returns the message with a link to the Internal Linking article on yoast.com.
	 *
	 * @returns {React.Element} The values to use.
	 */
	getArticleLink() {
		return interpolateComponents( {
			mixedString: articleLinkString,
			components: {
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <HelpTextLink href="https://yoa.st/site-structure-metabox" />,
			},
		} );
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
	maxSuggestions: PropTypes.number,
	customMessages: PropTypes.object,
};

LinkSuggestions.defaultProps = {
	maxSuggestions: 10,
	customMessages: {
		lengthMessage: "",
		metaMessage: "",
	},
};

export default LinkSuggestions;
