import { useBlockProps } from "@wordpress/block-editor";
import { pickBy } from "lodash";

import HowTo from "../components/HowTo";
import { childrenToString, getImageArray } from "../../shared-utils/migrationHelpers269";

/*
 * Converts rich text children to an HTML string.
 * In versions prior to 26.9, the How-to block stored
 * step names and texts as arrays of rich text elements.
 * This migration converts those arrays to HTML strings.
 * Additionally, it extracts image elements from the text arrays
 * if the images attribute is missing.
 */

/**
 * Migrates old array-based step attributes to the new string-based format.
 *
 * @param {Object} attributes The block attributes.
 * @returns {Object} The migrated attributes.
 */
const migrateToStringFormat = ( attributes ) => {
	if ( ! attributes.steps ) {
		return attributes;
	}

	const migratedSteps = attributes.steps.map( ( step ) => {
		// Extract images from an old text array before converting to string.
		const imageArray = getImageArray( step.images || [], step.text );

		// Convert name and text to strings.
		const newName = childrenToString( step.name );
		const newText = childrenToString( step.text );

		// Get image src for jsonImageSrc.
		let jsonImageSrc = step.jsonImageSrc || "";
		if ( ! jsonImageSrc && imageArray.length > 0 && imageArray[ 0 ].props.src ) {
			jsonImageSrc = imageArray[ 0 ].props.src;
		}

		return {
			id: step.id,
			name: newName,
			text: newText,
			images: imageArray,
			jsonName: newName,
			jsonText: newText,
			jsonImageSrc: jsonImageSrc,
		};
	} );

	// Also migrate description if it's an array
	const migratedAttributes = {
		... attributes,
		steps: migratedSteps,
	};

	if ( Array.isArray( attributes.description ) ) {
		migratedAttributes.description = childrenToString( attributes.description );
		migratedAttributes.jsonDescription = migratedAttributes.description;
	}

	// eslint-disable-next-line no-undefined
	return pickBy( migratedAttributes, ( value ) => value !== undefined );
};

/**
 * Checks if the block attributes need migration (have array-based name/text).
 *
 * @param {Object} attributes The block attributes.
 * @returns {boolean} Whether migration is needed.
 */
const needsMigration = ( attributes ) => {
	if ( ! attributes.steps || ! Array.isArray( attributes.steps ) ) {
		return false;
	}

	return attributes.steps.some(
		( step ) =>
			Array.isArray( step.name ) ||
			Array.isArray( step.text ) ||
			( ! step.images && Array.isArray( step.text ) )
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
	return <HowTo.Content { ...blockProps } />;
};

export {
	migrateToStringFormat,
	needsMigration,
	legacySave,
};
