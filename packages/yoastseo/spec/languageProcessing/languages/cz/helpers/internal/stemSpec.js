import stem from "../../../../../../src/languageProcessing/languages/cz/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataCZ = getMorphologyData( "cz" ).cz;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -atech.
	[ "tématech", "tém" ],
	// Input a word ending in case suffix -ětem.
	[ "markrabětem", "markrab" ],
	// Input a word ending in case suffix -atům.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ech.
	[ "významech", "význam" ],
	// Input a word ending in case suffix -ich.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ích.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ého.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ěmu or -ěmi?
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -emi.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ému.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -eti.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -iho.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ího.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ími.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -imu.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ách.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ata.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -aty.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ých.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ama.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ami.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ové.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ovi.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ými.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -em.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -es.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ém.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ím.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ům.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -at.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ám.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -os.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -us.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -mi.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ou.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -e.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -i.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -í.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ě.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -u.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -y.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ů.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -a.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -o.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -á.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -é.
	[ "diplomatům", "diplom" ],
	// Input a word ending in case suffix -ý.
	[ "diplomatům", "diplom" ],
	// Input a word ending in possessive suffix -ov.
	[ "tématech", "tém" ],
	// Input a word ending in possessive suffix -ův.
	// [ "markrabětem", "markrab" ],
	// Input a word ending in possessive suffix -in.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ci.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ce.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -či.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -če.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -k.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -zi.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ze.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ži.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -že.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -h.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -čtě.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -čti.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -čtí.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ck.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ště.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -šti.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -ští.
	[ "diplomatům", "diplom" ],
	// Input a word ending in palatalise suffix -sk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in comparative suffix -ejš.
	[ "diplomatům", "diplom" ],
	// Input a word ending in comparative suffix -ějš.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -oušek.
	[ "tématech", "tém" ],
	// Input a word ending in diminutive suffix -eček.
	// [ "markrabětem", "markrab" ],
	// Input a word ending in diminutive suffix -éček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -iček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -íček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -enek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ének.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -inek
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ínek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -áček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -aček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -oček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -uček.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -anek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -onek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -unek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ánek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -éčk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ičk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -enk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -énk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ink.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ínk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -áčk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ačk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -očk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -učk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ank.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -onk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -unk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -átk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ánk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ušk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ék.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ík.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ik.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ák.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ak.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -ok.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -uk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in diminutive suffix -k.
	[ "diplomatům", "diplom" ],
	// Input a word ending in augmentative suffix -ajzn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in augmentative suffix -izn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in augmentative suffix -isk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in augmentative suffix -ák.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -obinec.
	[ "tématech", "tém" ],
	// Input a word ending in derivational suffix -ionář.
	// [ "markrabětem", "markrab" ],
	// Input a word ending in derivational suffix -ovisk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovstv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovišt.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovník.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ásek.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -loun
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -nost.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -teln.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovec.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovík.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovtv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovin.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -štin.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -enic.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -inec.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -itel.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -árn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ěnk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ián.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ist.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -isk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -išt.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -itb.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -írn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -och.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ost.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ovn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -oun.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -out.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ouš.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ušk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -kyn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -čan.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -kář.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -néř.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ník.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ctv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -stv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -áč.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ač.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -án.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -an.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ář.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -as.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ec.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -en.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ěn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -éř.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -íř.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ic.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -in.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ín.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -it.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -iv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ob.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ot.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ov.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -oň.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -ul.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -yn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -čk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -čn.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -dl.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -nk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -tv.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -tk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -vk.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -c.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -č.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -k.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -l.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -n.
	[ "diplomatům", "diplom" ],
	// Input a word ending in derivational suffix -t.
	[ "diplomatům", "diplom" ]
];

describe( "Test for stemming Czech words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataCZ ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

