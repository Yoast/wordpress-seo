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
		const serializedEntity = serializeEntity( entityMap[ key ].data.mention.get( "name" ) );

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
			mention: new Map( [
				[ "name", name ],
				[ "description", "%%" + name + "%%" ],
			] ),
		},
		mutability: "IMMUTABLE",
		type: "%%mention",
	};

	return { entityRange, mappedEntity };
}

/**
 * Unserializes a piece of content into DraftJS data.
 *
 * @param {string} content The content to unserialize.
 * @returns {Object} The raw data ready for convertFromRaw.
 */
export function unserializeEditor( content ) {
	const entityRanges = [];
	const entityMap = {};
	let entity, entityName, fullEntity;

	do {
		entity = ENTITY_FORMAT.exec( content );

		if ( entity ) {
			fullEntity = entity[ 0 ];
			entityName = entity[ 1 ];

			let offset = entity.index;

			let key = entityRanges.length;

			const { entityRange, mappedEntity } = unserializeEntity( key, entityName, offset );

			entityRanges.push( entityRange );
			entityMap[ key ] = mappedEntity;

			const before = content.substr( 0, offset );
			const between = content.substr( offset, fullEntity.length ).replace( /%%/g, "" );
			const after = content.substr( offset + fullEntity.length );

			content = before + between + after;
		}
	} while ( entity );

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
