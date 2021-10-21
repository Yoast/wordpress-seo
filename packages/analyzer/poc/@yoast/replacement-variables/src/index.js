import { reduce } from "lodash";

const createReplacementVariables = ( configs ) => {
	const replacementVariables = configs.map( ( { name, ...config } ) => ( {
		...config,
		name,
		regexp: new RegExp( `%%${ name }%%`, "g" ),
	} ) );

	const apply = ( string, ...args ) => {
		let replaced = string;
		replacementVariables.forEach( ( { regexp, getReplacement } ) => {
			if ( regexp.test( string ) ) {
				replaced = string.replace( regexp, getReplacement( ...args ) );
			}
		} );
		return replaced;
	};

	return {
		replacementVariables,
		apply,
	};
};

export default createReplacementVariables;
