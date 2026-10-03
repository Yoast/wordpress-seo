// All lists except for the `other` one are also used to create rules for some inclusive language assessments.
// The auxiliaries are categorized into different lists because this categorization is needed for the inclusive language rules.
export const formsOfToBe = [
	"am",
	"is",
	"are",
	"was",
	"were",
	"been",
	"be",
	"she's",
	"he's",
	"it's",
	"i'm",
	"we're",
	"they're",
	"you're",
	"that's",
	"being",
];

export const negatedFormsOfToBe = [
	"isn't",
	"weren't",
	"wasn't",
	"aren't",
];

export const formsOfToGet =  [
	"get",
	"gets",
	"got",
	"gotten",
	"getting",
];

export const other = [
	"having",
	"what's",
];

export const all = formsOfToBe.concat( negatedFormsOfToBe, formsOfToGet, other );

export default all;
