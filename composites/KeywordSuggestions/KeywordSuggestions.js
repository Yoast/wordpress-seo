import React from "react";
import PropTypes from "prop-types";
import { localize } from "../../utils/i18n";
import interpolateComponents from "interpolate-components";

/**
 * @summary Translates and returns the keyword research article link.
 *
 * Translates and returns the keyword research article link
 * in a way that the link elements are still rendered.
 *
 * @param {Function} translate The translator function.
 *
 * @returns {JSX.Element} The translated text including rendered link components.
 */
const getKeywordResearchArticleLink = ( translate ) => {
	const keywordsResearchLinkTranslation =
		translate( "Read our %1$sultimate guide to keyword research%2$s" +
		           " to learn more about keyword research and keyword strategy." )
			.replace(
				"%1$s", "{{a}}"
			)
			.replace(
				"%2$s", "{{/a}}"
			);

	return interpolateComponents( {
		mixedString: keywordsResearchLinkTranslation,
		components: {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href="https://yoa.st/keyword-research-metabox" />,
		},
	} );
};

/**
 * @summary Determine the keyword suggestion explanation.
 *
 * @param {Function} translate The translator function.
 * @param {Array} keywords The keyword suggestions that were found.
 * @returns {JSX.Element} The translated text.
 */
const getKeywordSuggestionExplanation = ( translate, keywords ) => {
	if ( keywords.length === 0 ) {
		return (
			/* Translators: Prominent words explanation when there is no copy yet. */
			translate(
				"Once you add a bit more copy, we'll give you a list of words and " +
				"word combination that occur the most in the content. These give an indication of what your content focuses on."
			)
		);
	}

	return (
		/* Translators: Prominent words explanation. */
		translate(
			"The following words and word combinations occur the most in the content. " +
			"These give an indication of what your content focuses on. " +
			"If the words differ a lot from your topic, " +
			"you might want to rewrite your content accordingly. "
		)
	);
};

/**
 * @summary Keyword suggestion component.
 *
 * @param {Function} translate The translator function.
 * @param {string} relevantWords The relevant words.
 * @param {number} keywordLimit The maximum number of keywords to display.
 *
 * @returns {JSX.Element} Rendered KeywordSuggestions component.
 */
const KeywordSuggestions = ( { translate, relevantWords, keywordLimit } ) => {
	const keywords = relevantWords.slice( 0, keywordLimit ).map( word => word.getCombination() );

	const explanation = ( <p>{ getKeywordSuggestionExplanation( translate, keywords ) }</p> );

	const list = (
		<ol className="yoast-keyword-suggestions__list">
			{ keywords.map( ( word ) => {
				return (
					<li
						key={ word }
						className="yoast-keyword-suggestions__item"
					>
						{ word }
					</li>
				);
			} ) }
		</ol>
	);

	return (
		<div className="yoast-keyword-suggestions">
			<p><strong>{ translate( "Prominent words" ) }</strong></p>
			{ explanation }
			{ list }
			{ getKeywordResearchArticleLink( translate ) }
		</div>
	);
};

KeywordSuggestions.propTypes = {
	relevantWords: PropTypes.arrayOf( PropTypes.object ).isRequired,
	keywordLimit: PropTypes.number,

	// Provided by the localize higher order component
	translate: PropTypes.any,
};

KeywordSuggestions.defaultProps = {
	keywordLimit: 5,
};

export default localize( KeywordSuggestions );
