import { applySuffixes } from "../morphoHelpers/suffixHelpers";

const addSuffixesStrongVerbsClass1 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stemPast = stems[ 1 ];
	const stemPastParticiple = stems[ 2 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class1.stemPast.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = applySuffixes( stemPresent, suffixesPresent );
	const formsPast = applySuffixes( stemPast, suffixesPast );
	const formsParticiple = applySuffixes( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return [ stemPresent, stemPast, ...formsPresent, ...formsPast, ...formsParticiple ];
};

const generateFormsStrongVerbsClass1 = function( dataStrongVerbs, currentStemDataSet, stemmedWordToCheck ) {
	const stems = currentStemDataSet[ 1 ].slice();

	if ( stems.some( stem => stemmedWordToCheck.endsWith( stem ) ) ) {
		return addSuffixesStrongVerbsClass1( dataStrongVerbs, stems );
	}

	return [];
};

const generateFormsStrongVerbs = function( dataStrongVerbs, stemmedWordToCheck ) {
	const stems = dataStrongVerbs.stems;

	for ( let i = 0; i < stems.length; i++ ) {
		const currentStemDataSet = stems[ i ];

		if ( currentStemDataSet[ 0 ] === 1 ) {
			const forms = generateFormsStrongVerbsClass1( dataStrongVerbs, currentStemDataSet, stemmedWordToCheck );

			if ( forms.length > 0 ) {
				return forms;
			}
		}
	}

	return [ ];
};

export function generateVerbExceptionForms( morphologyDataVerbs, stemmedWordToCheck ) {
	let exceptions = [];

	// Check exceptions with full forms.
	exceptions = generateFormsStrongVerbs( morphologyDataVerbs.strongVerbs, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	return exceptions;
}
