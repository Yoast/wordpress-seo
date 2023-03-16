
export default function parseClassAttribute( classString ){
	return new Set( classString.split( ' ' ) );
}