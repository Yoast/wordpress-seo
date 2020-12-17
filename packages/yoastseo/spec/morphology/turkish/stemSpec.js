import stem from "../../../src/morphology/turkish/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

// @todo add actual Turkish morphology data
const morphologyDataTR = getMorphologyData( "tr" ).tr;

const wordsToStem = [
	// Stem words end in suffixes in step a_0
	[ "tulkarem", "tulkare" ],
	[ "gözüken", "gözüke" ],
	[ "tüketimimiz", "tüketim" ],
	[ "ulaşandeniz", "ulaşande" ],
	[ "ulusumuz", "ulus" ],
	[ "umduðunuz", "umduð" ],
	[ "yürüttüðümüz", "yürüttüð" ],
	[ "henüz", "he" ],
	[ "tutmamız", "tutma" ],
	[ "numaranız", "numara" ],
	// Stem words end in suffixes in step a_1
	[ "görüþleri", "görüþ" ],
	[ "gözyaşları", "gözyaş" ],
	// Stem words end in suffixes in step a_2
	// Stem words end in suffixes in step a_3
	// Stem words end in suffixes in step a_4
	// Stem words end in suffixes in step a_5
	// Stem words end in suffixes in step a_6
	// Stem words end in suffixes in step a_7
	// Stem words end in suffixes in step a_8
	// Stem words end in suffixes in step a_9
	// Stem words end in suffixes in step a_10
	// Stem words end in suffixes in step a_11
	// Stem words end in suffixes in step a_12
	// Stem words end in suffixes in step a_13
	// Stem words end in suffixes in step a_14
	// Stem words end in suffixes in step a_15
	// Stem words end in suffixes in step a_16
	// Stem words end in suffixes in step a_17
	// Stem words end in suffixes in step a_18
	// Stem words end in suffixes in step a_19
	// Stem words end in suffixes in step a_20
	// Stem words end in suffixes in step a_21
	// Stem words end in suffixes in step a_22
	// Stem words end in suffixes in step a_23
	[ "Kedileriyle", "kedi" ],
];
describe( "Test for stemming Turkish words", () => {
	it( "stems Turkish words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataTR ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );

