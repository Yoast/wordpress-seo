import some from "lodash/some";
import forEach from "lodash/forEach";

const ENTITY_FORMAT = /%%([a-zA-Z_]+)%%/;

/**
 * Serializes an entity into a string.
 *
 * @param {string} name The name of the entity.
 *
 * @returns {string} Serialized entity.
 */
export function serializeEntity( name ) {
	return "%%" + name + "%%";
}

/**
 * Serializes a DraftJS block into a string.
 *
 * @param {Object} entityMap Contains all the entities in the DraftJS editor.
 * @param {Object} block The block to serialize.
 *
 * @returns {string} The serialized block.
 */
export function serializeBlock( entityMap, block ) {
	const { text, entityRanges } = block;
	let previousEntityEnd = 0;

	let serialized = entityRanges.reduce( ( serialized, entityRange ) => {
		const { key, length, offset } = entityRange;
		const beforeEntityLength = offset - previousEntityEnd;

		const beforeEntity = text.substr( previousEntityEnd, beforeEntityLength );
		const serializedEntity = serializeEntity( entityMap[ key ].data.mention.name );

		previousEntityEnd = offset + length;
		return serialized + beforeEntity + serializedEntity;
	}, "" );

	serialized += text.substr( previousEntityEnd );

	return serialized;
}

/**
 * Serializes the content inside a DraftJS editor.
 *
 * @param {Object} rawContent The content as returned by convertToRaw.
 *
 * @returns {string} The serialized content.
 */
export function serializeEditor( rawContent ) {
	const { blocks, entityMap } = rawContent;

	return blocks.reduce( ( serialized, block ) => {
		return serialized + serializeBlock( entityMap, block );
	}, "" );
}

/**
 * Unserializes an entity to DraftJS data.
 *
 * @param {number} key The key the new entity should use.
 * @param {string} name The name of this entity.
 * @param {number} offset The offset where this entity starts in the text.
 *
 * @returns {Object} The serialized entity.
 */
export function unserializeEntity( key, name, offset ) {
	const length = name.length;

	const entityRange = {
		key,
		offset,
		length,
	};

	const mappedEntity = {
		data: {
			mention: {
				name,
			},
		},
		mutability: "IMMUTABLE",
		type: "%mention",
	};

	return { entityRange, mappedEntity };
}

/**
 * Find all indices of a search term in a string.
 *
 * @param {string} searchTerm The term to search for.
 * @param {string} text       The text to search in.
 *
 * @returns {Array} Array of found indices.
 */
const getIndicesOf = ( searchTerm, text ) => {
	let temp = text;
	let tempSearch = searchTerm;
	const searchStrLen = tempSearch.length;
	if ( searchStrLen === 0 ) {
		return [];
	}
	let startIndex = 0;
	let index;
	const indices = [];

	while ( ( index = temp.indexOf( tempSearch, startIndex ) ) > -1 ) {
		indices.push( index );
		startIndex = index + searchStrLen;
	}
	return indices;
};

/**
 * Unserializes a piece of content into DraftJS data.
 *
 * @param {string} content The content to unserialize.
 * @param {Array} tags The tags for the DraftJS mention plugin.
 *
 * @returns {Object} The raw data ready for convertFromRaw.
 */
export function unserializeEditor( content, tags ) {
	const entityRanges = [];
	const entityMap = {};

	forEach( tags, tag => {
		const tagValue = serializeEntity( tag.name );
		const indices = getIndicesOf( tagValue, content );

		forEach( indices, offset => {
			const before = content.substr( 0, offset );
			const between = content.substr( offset, tagValue.length ).replace( /%%/g, "" );
			const after = content.substr( offset + tagValue.length );

			content = before + between + after;

			let key = entityRanges.length;

			const { entityRange, mappedEntity } = unserializeEntity( key, tag.name, offset );

			entityRanges.push( entityRange );
			entityMap[ key ] = mappedEntity;
		} );
	} );

	const blocks = [
		{
			entityRanges,
			text: content,
		},
	];

	return {
		blocks,
		entityMap,
	};
}
