import { pickBy } from "lodash";
import { useBlockProps } from "@wordpress/block-editor";

import Faq from "../components/FAQ";
import { childrenToString, getImageArray } from "../../shared-utils/migrationHelpers270";

/*
 * Converts rich text children to an HTML string.
 * In versions prior to 27.0, the FAQ block stored
 * Question's question and answer items as arrays of rich text elements.
 * This migration converts those arrays to HTML strings.
 * Additionally, it extracts image elements from the answer arrays
 * if the images attribute is missing.
 */

/**
 * Migrates old array-based question attributes to the new string-based format.
 *
 * @param {Object} attributes The block attributes.
 * @returns {Object} The migrated attributes.
 */
const migrateToStringFormat = ( attributes ) => {
	if ( ! attributes.questions ) {
		return attributes;
	}

	const migratedQuestions = attributes.questions.map( ( question ) => {
		// Extract images from an old answer array before converting to string.
		const imageArray = getImageArray( question.images || [], question.answer );

		// Convert question and answer to strings.
		const newQuestion = childrenToString( question.question );
		const newAnswer = childrenToString( question.answer );

		// Get image src for jsonImageSrc.
		let jsonImageSrc = question.jsonImageSrc || "";
		if ( ! jsonImageSrc && imageArray.length > 0 && imageArray[ 0 ].props.src ) {
			jsonImageSrc = imageArray[ 0 ].props.src;
		}

		return {
			id: question.id,
			question: newQuestion,
			answer: newAnswer,
			images: imageArray,
			jsonQuestion: newQuestion,
			jsonAnswer: newAnswer,
			jsonImageSrc: jsonImageSrc,
		};
	} );

	const migratedAttributes = {
		... attributes,
		questions: migratedQuestions,
	};

	// eslint-disable-next-line no-undefined
	return pickBy( migratedAttributes, ( value ) => value !== undefined );
};

/**
 * Checks if the block attributes need migration (have array-based question/answer).
 *
 * @param {Object} attributes The block attributes.
 * @returns {boolean} Whether migration is needed.
 */
const needsMigration = ( attributes ) => {
	if ( ! attributes.questions || ! Array.isArray( attributes.questions ) ) {
		return false;
	}

	return attributes.questions.some(
		( question ) =>
			Array.isArray( question.question ) ||
			Array.isArray( question.answer ) ||
			( ! question.images && Array.isArray( question.answer ) )
	);
};

/**
 * Legacy save function for blocks that used array-based attributes.
 * This matches the current save output structure.
 *
 * @param {Object} props The block props.
 * @returns {Object} The saved block content.
 */
const legacySave = ( { attributes } ) => {
	const blockProps = useBlockProps.save( attributes );
	return <Faq.Content { ...blockProps } />;
};

export {
	migrateToStringFormat,
	needsMigration,
	legacySave,
};

