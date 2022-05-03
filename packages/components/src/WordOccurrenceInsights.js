// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";

// Yoast dependencies.
import WordOccurrences from "./WordOccurrences";


/**
 * @summary Translates and returns the keyword research article link.
 *
 * Translates and returns the keyword research article link
 * in a way that the link elements are still rendered.
 *
 * @param {string} url The URL to the research article.
 *
 * @returns {JSX.Element} The translated text including rendered link components.
 */
const getKeywordResearchArticleLink = ( url ) => {
	const keywordsResearchLinkTranslation = sprintf(
		__(
			"Read our %1$sultimate guide to keyword research%2$s to learn more about keyword research and keyword strategy.",
			"wordpress-seo"
		),
		"{{a}}",
		"{{/a}}"
	);

	return interpolateComponents( {
		mixedString: keywordsResearchLinkTranslation,
		components: {
			// eslint-disable-next-line jsx-a11y/anchor-has-content, react/jsx-no-target-blank
			a: <a href={ url } target="_blank" />,
		},
	} );
};

/**
 * @summary Determine the keyword suggestion explanation.
 *
 * @param {Array} keywords The keyword suggestions that were found.
 * @returns {string} The translated text.
 */
const getExplanation = keywords => {
	if ( keywords.length === 0 ) {
		return __(
			// eslint-disable-next-line max-len
			"Once you add a bit more copy, we'll give you a list of words that occur the most in the content. These give an indication of what your content focuses on.",
			"wordpress-seo"
		);
	}

	return __(
		// eslint-disable-next-line max-len
		"The following words occur the most in the content. These give an indication of what your content focuses on. If the words differ a lot from your topic, you might want to rewrite your content accordingly. ",
		"wordpress-seo"
	);
};

/**
 * @summary WordList component.
 *
 * @param {WordCombination[]|ProminentWord[]} words The relevant words.
 * @param {string} researchArticleLink The link to the article explaining keyword research.
 *
 * @returns {JSX.Element} Rendered WordList component.
 */
const WordOccurrenceInsights = ( { words, researchArticleLink } ) => {
	const header = <p className="yoast-field-group__title">{ __( "Prominent words", "wordpress-seo" ) }</p>;
	const introduction = <p>{ getExplanation( words ) }</p>;
	const footer = <p>{ getKeywordResearchArticleLink( researchArticleLink ) }</p>;
	return (
		<WordOccurrences
			words={ words }
			header={ header }
			introduction={ introduction }
			footer={ footer }
		/>
	);
};

WordOccurrenceInsights.propTypes = {
	words: PropTypes.arrayOf( PropTypes.object ).isRequired,
	researchArticleLink: PropTypes.string.isRequired,
};

export default WordOccurrenceInsights;
