import { applySuffixesToStem, applySuffixesToStems } from "../morphoHelpers/suffixHelpers";
import { flattenDeep, uniq as unique } from "lodash-es";

const addSuffixesStrongVerbsClass1 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stemPast = stems[ 1 ];
	const stemPastParticiple = stems[ 2 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class1.stemPast.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = Array.isArray( stemPresent )
		? applySuffixesToStems( stemPresent, suffixesPresent )
		: applySuffixesToStem( stemPresent, suffixesPresent );
	const formsPast = Array.isArray( stemPast )
		? applySuffixesToStems( stemPast, suffixesPast )
		: applySuffixesToStem( stemPast, suffixesPast );
	const formsParticiple = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastParticiple, suffixParticiple )
		: applySuffixesToStem( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return unique( flattenDeep( [ stemPresent, stemPast, formsPresent, formsPast, formsParticiple ] ) );
};

const addSuffixesStrongVerbsClass2 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stemPast = stems[ 1 ];
	const stemPastSubjunctive = stems[ 2 ];
	const stemPastParticiple = stems[ 3 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class2.stemPast.slice();
	const suffixesPastSubjunctive = dataStrongVerbs.suffixes.class2.stemPastSubjunctive.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = Array.isArray( stemPresent )
		? applySuffixesToStems( stemPresent, suffixesPresent )
		: applySuffixesToStem( stemPresent, suffixesPresent );
	const formsPast = Array.isArray( stemPast )
		? applySuffixesToStems( stemPast, suffixesPast )
		: applySuffixesToStem( stemPast, suffixesPast );
	const formsPastSubjunctive = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastSubjunctive, suffixesPastSubjunctive )
		: applySuffixesToStem( stemPastSubjunctive, suffixesPastSubjunctive );
	const formsParticiple = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastParticiple, suffixParticiple )
		: applySuffixesToStem( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return unique( flattenDeep( [ stemPresent, stemPast, formsPresent, formsPast, formsPastSubjunctive,  formsParticiple ] ) );
};

const addSuffixesStrongVerbsClass3 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stem2nd3rdSg = stems[ 1 ];
	const stemPast = stems[ 2 ];
	const stemPastSubjunctive = stems[ 3 ];
	const stemPastParticiple = stems[ 4 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixes2nd3rdSg = dataStrongVerbs.suffixes.class3.stem2nd3rdSg.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class3.stemPast.slice();
	const suffixesPastSubjunctive = dataStrongVerbs.suffixes.class3.stemPastSubjunctive.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = Array.isArray( stemPresent )
		? applySuffixesToStems( stemPresent, suffixesPresent )
		: applySuffixesToStem( stemPresent, suffixesPresent );
	const forms2nd3rdSg = Array.isArray( stem2nd3rdSg )
		? applySuffixesToStems( stem2nd3rdSg, suffixes2nd3rdSg )
		: applySuffixesToStem( stem2nd3rdSg, suffixes2nd3rdSg );
	const formsPast = Array.isArray( stemPast )
		? applySuffixesToStems( stemPast, suffixesPast )
		: applySuffixesToStem( stemPast, suffixesPast );
	const formsPastSubjunctive = Array.isArray( stemPastSubjunctive )
		? applySuffixesToStems( stemPastSubjunctive, suffixesPastSubjunctive )
		: applySuffixesToStem( stemPastSubjunctive, suffixesPastSubjunctive );
	const formsParticiple = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastParticiple, suffixParticiple )
		: applySuffixesToStem( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return unique( flattenDeep( [ stemPresent, stemPast, formsPresent, forms2nd3rdSg, formsPast, formsPastSubjunctive, formsParticiple ] ) );
};

const addSuffixesStrongVerbsClass4 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stem2nd3rdSg = stems[ 1 ];
	const stemPast = stems[ 2 ];
	const stemPastSubjunctive = stems[ 3 ];
	const stemPastParticiple = stems[ 4 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixes2nd3rdSg = dataStrongVerbs.suffixes.class4.stem2nd3rdSg.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class4.stemPast.slice();
	const suffixesPastSubjunctive = dataStrongVerbs.suffixes.class4.stemPastSubjunctive.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = Array.isArray( stemPresent )
		? applySuffixesToStems( stemPresent, suffixesPresent )
		: applySuffixesToStem( stemPresent, suffixesPresent );
	const forms2nd3rdSg = Array.isArray( stem2nd3rdSg )
		? applySuffixesToStems( stem2nd3rdSg, suffixes2nd3rdSg )
		: applySuffixesToStem( stem2nd3rdSg, suffixes2nd3rdSg );
	const formsPast = Array.isArray( stemPast )
		? applySuffixesToStems( stemPast, suffixesPast )
		: applySuffixesToStem( stemPast, suffixesPast );
	const formsPastSubjunctive = Array.isArray( stemPastSubjunctive )
		? applySuffixesToStems( stemPastSubjunctive, suffixesPastSubjunctive )
		: applySuffixesToStem( stemPastSubjunctive, suffixesPastSubjunctive );
	const formsParticiple = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastParticiple, suffixParticiple )
		: applySuffixesToStem( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return unique( flattenDeep( [ stemPresent, stemPast, formsPresent, forms2nd3rdSg, formsPast, formsPastSubjunctive, formsParticiple ] ) );
};

const addSuffixesStrongVerbsClass5 = function( dataStrongVerbs, stems ) {
	const stemPresent = stems[ 0 ];
	const stem2nd3rdSg = stems[ 1 ];
	const stemPast = stems[ 2 ];
	const stemPastParticiple = stems[ 3 ];
	const suffixesPresent = dataStrongVerbs.suffixes.stemPresentAll.slice();
	const suffixes2nd3rdSg = dataStrongVerbs.suffixes.class5.stem2nd3rdSg.slice();
	const suffixesPast = dataStrongVerbs.suffixes.class5.stemPast.slice();
	const suffixParticiple = new Array( dataStrongVerbs.suffixes.participle.slice() );

	const formsPresent = Array.isArray( stemPresent )
		? applySuffixesToStems( stemPresent, suffixesPresent )
		: applySuffixesToStem( stemPresent, suffixesPresent );
	const forms2nd3rdSg = Array.isArray( stem2nd3rdSg )
		? applySuffixesToStems( stem2nd3rdSg, suffixes2nd3rdSg )
		: applySuffixesToStem( stem2nd3rdSg, suffixes2nd3rdSg );
	const formsPast = Array.isArray( stemPast )
		? applySuffixesToStems( stemPast, suffixesPast )
		: applySuffixesToStem( stemPast, suffixesPast );
	const formsParticiple = Array.isArray( stemPastParticiple )
		? applySuffixesToStems( stemPastParticiple, suffixParticiple )
		: applySuffixesToStem( stemPastParticiple, suffixParticiple );

	// The present and past stems can also be forms on their own.
	return unique( flattenDeep( [ stemPresent, stemPast, formsPresent, forms2nd3rdSg, formsPast, formsParticiple ] ) );
};

const addSuffixesPerClass = {
	1: addSuffixesStrongVerbsClass1,
	2: addSuffixesStrongVerbsClass2,
	3: addSuffixesStrongVerbsClass3,
	4: addSuffixesStrongVerbsClass4,
	5: addSuffixesStrongVerbsClass5,
};

const generateFormsPerClass = function( dataStrongVerbs, verbClass, currentStemDataSet, stemmedWordToCheck ) {
	const stems = currentStemDataSet[ 1 ].slice();

	const stemsFlattened = flattenDeep( stems );

	if ( stemsFlattened.some( stem => stemmedWordToCheck.endsWith( stem ) ) ) {
		const addSuffixes = addSuffixesPerClass[ verbClass ];
		return addSuffixes( dataStrongVerbs, stems );
	}

	return [];
};


const generateFormsStrongVerbs = function( dataStrongVerbs, stemmedWordToCheck ) {
	const stems = dataStrongVerbs.stems;

	for ( let i = 0; i < stems.length; i++ ) {
		const currentStemDataSet = stems[ i ];
		const verbClass = currentStemDataSet[ 0 ];

		const forms = generateFormsPerClass( dataStrongVerbs, verbClass, currentStemDataSet, stemmedWordToCheck );

		if ( forms.length > 0 ) {
			return forms;
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
