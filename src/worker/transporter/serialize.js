const isArray = require( "lodash/isArray" );
const isObject = require( "lodash/isObject" );
const mapValues = require( "lodash/mapValues" );

export default function serialize( thing ) {
	if ( isArray( thing ) ) {
		return thing.map( serialize );
	}

	const thingIsObject = isObject( thing );

	if ( thingIsObject && thing.serialize ) {
		return thing.serialize();
	}

	if ( thingIsObject ) {
		return mapValues( thing, ( value ) => serialize( value ) );
	}

	return thing;
};
