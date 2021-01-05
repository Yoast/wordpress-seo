import stem from "../../../src/morphology/turkish/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataTR = getMorphologyData( "tr" ).tr;

const wordsToStem = [
	// Stem words end in suffixes in step a_0
	[ "tulkarem", "tulkare" ],
	[ "gözüken", "gözüke" ],
	[ "tüketimimiz", "tüketim" ],
	[ "ulaşandeniz", "ulaşande" ],
	[ "ulusumuz", "ulus" ],
	[ "umduğunuz", "umduk" ],
	[ "yürüttüğümüz", "yürüttük" ],
	[ "henüz", "he" ],
	[ "tutmamız", "tutma" ],
	[ "numaranız", "numara" ],
	// Stem words end in suffixes in step a_1
	[ "görüşleri", "görüş" ],
	[ "gözyaşları", "gözyaş" ],
	// Stem words end in suffixes in step a_2
	[ "nikotini", "nikot" ],
	[ "notunu", "not" ],
	[ "prosedürünü", "prosedür" ],
	[ "puanını", "puan" ],
	// Stem words end in suffixes in step a_3
	[ "pêkirin", "pêkir" ],
	[ "radyosu'nun", "radyosu'n" ],
	[ "reflektörün", "reflektör" ],
	[ "reforların", "refor" ],
	// Stem words end in suffixes in step a_4
	[ "rekora", "rekor" ],
	[ "resmiyette", "resmiyet" ],
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
	[ "gidiyorsa", "gidiyor" ],
	[ "girerse", "girer" ],
	[ "konuşursak", "konuşur" ],
	[ "gönderemezsek", "gönderemez" ],
	// Stem words end in suffixes in step a_22
	[ "borçlanmış", "borçla" ],
	[ "gerekiyormuş", "gerekiyor" ],
	[ "dökmüş", "dök" ],
	[ "dzenlenmiş", "dzenle" ],
	// Stem words end in suffixes in step a_23
	[ "samandağ", "samandak" ],
	[ "kedileriyle", "kedi" ],
];
describe( "Test for stemming Turkish words", () => {
	it( "stems Turkish words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataTR ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );

