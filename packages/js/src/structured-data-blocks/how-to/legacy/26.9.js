import { useBlockProps } from "@wordpress/block-editor";
import { renderToString } from "@wordpress/element";

import HowTo from "../components/HowTo";

/*
 * Converts rich text children to an HTML string.
 * In versions prior to 26.9, the How-to block stored
 * step names and texts as arrays of rich text elements.
 * This migration converts those arrays to HTML strings.
 * Additionally, it extracts image elements from the text arrays
 * if the images attribute is missing.
 */

/**
 * Converts a rich text children array to an HTML string.
 *
 * @param {Array|string} value The value to convert.
 * @returns {string} The HTML string.
 */
const childrenToString = ( value ) => {
	if ( ! value ) {
		return "";
	}
	if ( typeof value === "string" ) {
		return value;
	}
	if ( Array.isArray( value ) ) {
		try {
			return renderToString( value );
		} catch ( e ) {
			// Fallback: join string parts.
			return value
				.map( ( item ) => {
					if ( typeof item === "string" ) {
						return item;
					}
					if ( item && item.props ) {
						return renderToString( item );
					}
					return "";
				} )
				.join( "" );
		}
	}
	return "";
};

/**
 * Builds an image object from a node.
 * @param {object} node The image node.
 * @returns {{type: string, key: null, props: {src: string, alt: string, className: string, style: string}}} The image object.
 */
const buildImageObject = ( node ) => {
	const { key, props = {} } = node;
	const { src = "", alt = "", className = "", style = "" } = props;

	return {
		type: "img",
		key,
		props: { src, alt, className, style },
	};
};

/**
 * Extracts image elements from an old array-based text field.
 *
 * @param {Array} textArray The old text array that may contain image elements.
 * @returns {Array} Array of image objects in the new format.
 */
const extractImagesFromTextArray = ( textArray ) => {
	if ( ! Array.isArray( textArray ) ) {
		return [];
	}

	return textArray
		.filter( ( node ) => node && node.type && node.type === "img" )
		.map( buildImageObject );
};

/**
 * Gets the image array for a step, extracting from text if necessary.
 * @param {object} step The step object.
 * @returns {object[]} The image array.
 */
const getImageArray = ( step ) => {
	let imageArray = step.images || [];
	if ( Array.isArray( step.text ) && imageArray.length === 0 ) {
		imageArray = extractImagesFromTextArray( step.text );
	}
	return imageArray;
};

/**
 * Removes properties with undefined values from an object.
 * @param {Object} obj The object to clean.
 * @returns {Object} The object without undefined values.
 */
const removeUndefinedProps = ( obj ) => {
	const result = {};
	for ( const key in obj ) {
		if ( typeof obj[ key ] !== "undefined" ) {
			result[ key ] = obj[ key ];
		}
	}
	return result;
};

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
		const imageArray = getImageArray( step );

		// Convert name and text to strings.
		const newName = childrenToString( step.name );
		const newText = childrenToString( step.text );

		// Get image src for jsonImageSrc.
		let jsonImageSrc = step.jsonImageSrc || "";
		if ( ! jsonImageSrc && imageArray.length > 0 && imageArray[ 0 ].props?.src ) {
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

	return removeUndefinedProps( migratedAttributes );
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
