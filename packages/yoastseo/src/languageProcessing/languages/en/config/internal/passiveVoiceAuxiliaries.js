// These auxiliaries are filtered from the beginning of word combinations in the prominent words.
export const filteredAuxiliaries =  [
	"am",
	"is",
	"are",
	"was",
	"were",
	"been",
	"get",
	"gets",
	"got",
	"gotten",
	"be",
	"she's",
	"he's",
	"it's",
	"i'm",
	"we're",
	"they're",
	"you're",
	"that's",
	"isn't",
	"weren't",
	"wasn't",
	"aren't",
];

// These auxiliaries are not filtered from the beginning of word combinations in the prominent words.
export const notFilteredAuxiliaries = [
	"being",
	"getting",
	"having",
	"what's",
];

export const all = filteredAuxiliaries.concat( notFilteredAuxiliaries );

export default all;
