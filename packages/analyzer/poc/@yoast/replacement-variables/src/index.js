import { reduce } from "lodash";

const createReplacementVariables = ( configs ) => {
	const replacementVariables = configs.map( ( { name, ...config } ) => ( {
		...config,
		name,
		regexp: new RegExp( `%%${ name }%%`, "g" ),
	} ) );

	const apply = ( string, ...args ) => reduce(
		replacementVariables,
		( replaced, { regexp, getReplacement } ) => (
			regexp.test( replaced )
				? replaced.replace( regexp, getReplacement( ...args ) )
				: replaced
		),
		string
	);

	return {
		replacementVariables,
		apply,
	};
};

export default createReplacementVariables;
