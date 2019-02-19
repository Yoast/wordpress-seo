import { applySuffixesToStem, applySuffixesToStems } from "../morphoHelpers/suffixHelpers";
import { flattenDeep, forOwn, uniq as unique } from "lodash-es";

const addSuffixes = function( dataStrongVerbs, verbClass, stems ) {
	// All classes have the same present and participle suffixes.
	const suffixes = {
		present: dataStrongVerbs.suffixes.presentAllClasses.slice(),
		pastParticiple: new Array( dataStrongVerbs.suffixes.pastParticiple.slice() ),
	};

	const suffixesPerClass = dataStrongVerbs.suffixes.classDependent;

	// Add class-specific suffixes.
	forOwn( suffixesPerClass, function( stemData, stemClass ) {
		if ( stemClass === verbClass ) {
			forOwn( stemData, function( additionalSuffixes, suffixClass ) {
				suffixes[ suffixClass ] = additionalSuffixes;
			} );
		}
	} );

	const forms = [ stems.present, stems.past ];

	forOwn( stems, function( stem, stemClass ) {
		forms.push(
			Array.isArray( stem )
				? applySuffixesToStems( stem, suffixes[ stemClass ] )
				: applySuffixesToStem( stem, suffixes[ stemClass ] )
		);
	} );

	return unique( flattenDeep( forms ) );
};

const addPrecedingLexicalMaterial = function( stems, materialToAdd ) {
	forOwn( stems, function( stem, stemClass ) {
		if ( Array.isArray( stem ) ) {
			for ( let i = 0; i < stem.length; i++ ) {
				stem[ i ] = materialToAdd.concat( stem[ i ] );
			}
		} else {
			stems[ stemClass ] = materialToAdd.concat( stem );
		}
	} );

	return stems;
};


const generateFormsPerClass = function( dataStrongVerbs, currentStemDataSet, stemmedWordToCheck ) {
	const verbClass = currentStemDataSet.class;
	let stems = currentStemDataSet.stems;
	let stemsFlattened = [];

	forOwn( stems, ( stem ) => stemsFlattened.push( stem ) );
	// Some stem types have two forms, which means that a stem type can also contain an array. These get flattened here.
	stemsFlattened = flattenDeep( stemsFlattened );

	/*
	 * Sort in order to make sure that if the stem to check is e.g. "gehalt", "halt" isn't matched before "gehalt".
	 * (Both are part of the same paradigm). Otherwise, if "halt" is matched, the "ge" will be interpreted as preceding
	 * lexical material and added to all forms.
	 */
	stemsFlattened = stemsFlattened.sort( ( a, b ) => b.length - a.length );

	for ( let i = 0; i < stemsFlattened.length; i++ ) {
		const currentStem = stemsFlattened[ i ];

		if ( stemmedWordToCheck.endsWith( currentStem ) ) {
			// "fest".length = "festhalt".length - "halt".length
			const precedingLength = stemmedWordToCheck.length - currentStem.length;
			const precedingLexicalMaterial = stemmedWordToCheck.slice( 0, precedingLength );
			/*
			  * If the word is a compound, removing the final stem will result in some lexical material to
			  * be left over at the beginning of the word. For example, removing "halt" from "festhalt"
			  * leaves "fest". This lexical material is the base for the word forms that need to be created
			  * (e.g., "festhielt").
			  */
			if ( precedingLexicalMaterial.length > 0 ) {
				stems = addPrecedingLexicalMaterial( stems, precedingLexicalMaterial );
			}

			return addSuffixes( dataStrongVerbs, verbClass, stems );
		}
	}

	return [];
};

const generateFormsStrongVerbs = function( dataStrongVerbs, stemmedWordToCheck ) {
	const stems = dataStrongVerbs.stems;

	for ( let i = 0; i < stems.length; i++ ) {
		const currentStemDataSet = stems[ i ];

		const forms = generateFormsPerClass( dataStrongVerbs, currentStemDataSet, stemmedWordToCheck );

		if ( forms.length > 0 ) {
			return forms;
		}
	}

	return [];
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
