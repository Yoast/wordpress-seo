// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";
import { isFeatureEnabled } from "@yoast/feature-toggle";

// Yoast dependencies.
import WordList from "./WordList";


/**
 * @summary Translates and returns the keyword research article link.
 *
 * Translates and returns the keyword research article link
 * in a way that the link elements are still rendered.
 *
 * @returns {JSX.Element} The translated text including rendered link components.
 */
const getKeywordResearchArticleLink = () => {
	const keywordsResearchLinkTranslation = sprintf(
		__(
			"Read our %1$sultimate guide to keyword research%2$s to learn " +
			"more about keyword research and keyword strategy.",
			"yoast-components"
		),
		"{{a}}",
		"{{/a}}"
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
 * @param {Array} keywords The keyword suggestions that were found.
 * @returns {string} The translated text.
 */
const getKeywordSuggestionExplanation = keywords => {
	if ( isFeatureEnabled( "improvedInternalLinking" ) ) {
		if ( keywords.length === 0 ) {
			return __(
				"Once you add a bit more copy, we'll give you a list of words that occur the most in the content. " +
				"These give an indication of what your content focuses on.",
				"yoast-components"
			);
		}

		return __(
			"The following words occur the most in the content. " +
			"These give an indication of what your content focuses on. " +
			"If the words differ a lot from your topic, " +
			"you might want to rewrite your content accordingly. ",
			"yoast-components"
		);
	}

	if ( keywords.length === 0 ) {
		return __(
			"Once you add a bit more copy, we'll give you a list of words and " +
			"word combination that occur the most in the content. These give an indication of what your content focuses on.",
			"yoast-components"
		);
	}

	return __(
		"The following words and word combinations occur the most in the content. " +
		"These give an indication of what your content focuses on. " +
		"If the words differ a lot from your topic, " +
		"you might want to rewrite your content accordingly. ",
		"yoast-components"
	);
};

/**
 * @summary WordList component.
 *
 * @param {string}   title           The title of the list.
 * @param {WordCombination[]|ProminentWord[]}   relevantWords   The relevant words.
 * @param {number}   keywordLimit    The maximum number of keywords to display.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const KeywordSuggestions = ( { relevantWords, keywordLimit } ) => {
	const keywords = relevantWords.slice( 0, keywordLimit ).map( word => {
		return isFeatureEnabled( "improvedInternalLinking" ) ? word.getWord() : word.getCombination();
	} );

	return ( <WordList
		title={ __( "Prominent words", "yoast-components" ) }
		words={ keywords }
		classNamePrefix="yoast-keyword-suggestions"
		showBeforeList={ () => {
			return  ( <p>{ getKeywordSuggestionExplanation( keywords ) }</p> );
		} }
		showAfterList={
			() => {
				return getKeywordResearchArticleLink();
			}
		}
	/>
	);
};

KeywordSuggestions.propTypes = {
	relevantWords: PropTypes.arrayOf( PropTypes.object ).isRequired,
	keywordLimit: PropTypes.number,
};

KeywordSuggestions.defaultProps = {
	keywordLimit: 5,
};

export default KeywordSuggestions;
