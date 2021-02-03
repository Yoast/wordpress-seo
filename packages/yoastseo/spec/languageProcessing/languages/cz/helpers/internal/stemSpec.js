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
	[ "jejich", "jej" ],
	// Input a word ending in case suffix -ích.
	[ "nejlepších", "nejlepš" ],
	// Input a word ending in case suffix -ého.
	[ "filmového", "film" ],
	// Input a word ending in case suffix -ěmi.
	[ "zeměmi", "zem" ],
	// Input a word ending in case suffix -emi.
	[ "hranicemi", "hranice" ],
	// Input a word ending in case suffix -ému.
	[ "výraznému", "výraz" ],
	// Input a word ending in case suffix -eti.
	[ "čtyřiceti", "čtyřice" ],
	// Input a word ending in case suffix -iho.
	[ "roliho", "rol" ],
	// Input a word ending in case suffix -ího.
	[ "mezinárodního", "mezinárod" ],
	// Input a word ending in case suffix -ími.
	[ "vyznamenáními", "vyznamen" ],
	// Input a word ending in case suffix -imu.
	[ "režimu", "reži" ],
	// Input a word ending in case suffix -ách.
	[ "Čechách", "čech" ],
	// Input a word ending in case suffix -ata.
	[ "přijata", "přij" ],
	// Input a word ending in case suffix -aty.
	[ "diplomaty", "diplom" ],
	// Input a word ending in case suffix -ých.
	[ "obecných", "obec" ],
	// Input a word ending in case suffix -ama.
	[ "očičkama", "oči" ],
	// Input a word ending in case suffix -ami.
	[ "přehradami", "přehrad" ],
	// Input a word ending in case suffix -ové.
	[ "autobusové", "autobus" ],
	// Input a word ending in case suffix -ovi.
	[ "klíčoví", "klí" ],
	// Input a word ending in case suffix -ými.
	[ "dochovanými", "dochov" ],
	// Input a word ending in case suffix -em.
	[ "architektem", "architek" ],
	// Input a word ending in case suffix -es.
	[ "čerkes", "čer" ],
	// Input a word ending in case suffix -ém.
	[ "novelizovaném", "novelizova" ],
	// Input a word ending in case suffix -ím.
	[ "dnešním", "dneš" ],
	// Input a word ending in case suffix -ům.
	[ "záznamům", "záznam" ],
	// Input a word ending in case suffix -at.
	[ "jednat", "jed" ],
	// Input a word ending in case suffix -ám.
	[ "snahám", "snah" ],
	// Input a word ending in case suffix -os.
	[ "výnos", "výn" ],
	// Input a word ending in case suffix -us.
	[ "bilingvismus", "bilingvism" ],
	// Input a word ending in case suffix -mi.
	[ "některými", "někter" ],
	// Input a word ending in case suffix -ou.
	[ "hospodářskou", "hospodářs" ],
	// Input a word ending in case suffix -e.
	[ "rozvoje", "rozvoj" ],
	// Input a word ending in case suffix -i.
	[ "koni", "kon" ],
	// Input a word ending in case suffix -í.
	[ "mající", "mají" ],
	// Input a word ending in case suffix -ě.
	[ "relativně", "relativ" ],
	// Input a word ending in case suffix -u.
	[ "severu", "sever" ],
	// Input a word ending in case suffix -y.
	[ "ochrany", "ochr" ],
	// Input a word ending in case suffix -ů.
	[ "států", "stá" ],
	// Input a word ending in case suffix -a.
	[ "jedna", "jed" ],
	// Input a word ending in case suffix -o.
	[ "jedno", "jed" ],
	// Input a word ending in case suffix -á.
	[ "odmítá", "odmí" ],
	// Input a word ending in case suffix -é.
	[ "každé", "každ" ],
	// Input a word ending in case suffix -ý.
	[ "přirozený", "přiroze" ],
	// Input a word ending in possessive suffix -ov.
	[ "učitelova", "učite" ],
	// Input a word ending in possessive suffix -ův.
	[ "manželův", "manže" ],
	// Input a word ending in possessive suffix -in.
	[ "dceřin", "dceř" ],
	// Input a word ending in palatalised suffix -ci.
	[ "", "" ],
	// Input a word ending in palatalised suffix -ce.
	[ "", "" ],
	// Input a word ending in palatalised suffix -či.
	[ "", "" ],
	// Input a word ending in palatalised suffix -če.
	[ "", "" ],
	// Input a word ending in palatalised suffix -k.
	[ "", "" ],
	// Input a word ending in palatalised suffix -zi.
	[ "", "" ],
	// Input a word ending in palatalised suffix -ze.
	[ "", "" ],
	// Input a word ending in palatalised suffix -ži.
	[ "", "" ],
	// Input a word ending in palatalised suffix -že.
	[ "", "" ],
	// Input a word ending in palatalised suffix -h.
	[ "", "" ],
	// Input a word ending in palatalised suffix -čtě.
	[ "", "" ],
	// Input a word ending in palatalised suffix -čti.
	[ "", "" ],
	// Input a word ending in palatalised suffix -čtí.
	[ "", "" ],
	// Input a word ending in palatalised suffix -ck.
	[ "automatické", "automat" ],
	// Input a word ending in palatalised suffix -ště.
	[ "", "" ],
	// Input a word ending in palatalised suffix -šti.
	[ "", "" ],
	// Input a word ending in palatalised suffix -ští.
	[ "", "" ],
	// Input a word ending in palatalised suffix -sk.
	[ "", "" ],
	// Input a word ending in comparative suffix -ejš.
	[ "dolejš", "dol" ],
	// Input a word ending in comparative suffix -ějš.
	[ "nejbezpečnějš", "nejbezpe" ],
	// Input a word ending in diminutive suffix -oušek.
	[ "modroušek", "modr" ],
	// Input a word ending in diminutive suffix -eček.
	[ "domeček", "dom" ],
	// Input a word ending in diminutive suffix -éček.
	[ "cédéček", "céd" ],
	// Input a word ending in diminutive suffix -iček.
	[ "kočiček", "koči" ],
	// Input a word ending in diminutive suffix -íček.
	[ "pešíček", "peš" ],
	// Input a word ending in diminutive suffix -enek.
	[ "pálenek", "pál" ],
	// Input a word ending in diminutive suffix -ének.
	[ "kamének", "kam" ],
	// Input a word ending in diminutive suffix -inek
	[ "palačinek", "palači" ],
	// Input a word ending in diminutive suffix -ínek.
	[ "šulínek", "šul" ],
	// Input a word ending in diminutive suffix -áček.
	[ "obláček", "obl" ],
	// Input a word ending in diminutive suffix -aček.
	[ "stříkaček", "stří" ],
	// Input a word ending in diminutive suffix -oček.
	[ "baboček", "bab" ],
	// Input a word ending in diminutive suffix -uček.
	[ "oblouček", "oblo" ],
	// Input a word ending in diminutive suffix -anek.
	[ "pražanek", "praž" ],
	// Input a word ending in diminutive suffix -onek.
	[ "salonek", "sal" ],
	// Input a word ending in diminutive suffix -unek.
	[ "okounek", "oko" ],
	// Input a word ending in diminutive suffix -ánek.
	[ "kulhánek", "kulh" ],
	// Input a word ending in diminutive suffix -éčk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ičk.
	[ "skleničk", "skle" ],
	// Input a word ending in diminutive suffix -enk.
	[ "příklenk", "pří" ],
	// Input a word ending in diminutive suffix -énk.
	[ "okénk", "oké" ],
	// Input a word ending in diminutive suffix -ink.
	[ "trénink", "tré" ],
	// Input a word ending in diminutive suffix -ínk.
	[ "podmínk", "pod" ],
	// Input a word ending in diminutive suffix -áčk.
	[ "přemáčk", "přem" ],
	// Input a word ending in diminutive suffix -ačk.
	[ "nekuřačk", "nekuř" ],
	// Input a word ending in diminutive suffix -očk.
	[ "pobočk", "pob" ],
	// Input a word ending in diminutive suffix -učk.
	[ "měkkoučk", "měkko" ],
	// Input a word ending in diminutive suffix -ank.
	[ "fašank", "faš" ],
	// Input a word ending in diminutive suffix -onk.
	[ "šešonk", "šeš" ],
	// Input a word ending in diminutive suffix -unk.
	[ "šalunk", "šal" ],
	// Input a word ending in diminutive suffix -átk.
	[ "zvířátk", "zvíř" ],
	// Input a word ending in diminutive suffix -ánk.
	[ "pozvánk", "pozv" ],
	// Input a word ending in diminutive suffix -ušk.
	[ "zkoušk", "zko" ],
	// Input a word ending in diminutive suffix -ek.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ék.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ík.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ik.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ák.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ak.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ok.
	[ "", "" ],
	// Input a word ending in diminutive suffix -uk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -k.
	// [ "naviják", "navijá" ],
	// Input a word ending in augmentative suffix -ajzn.
	[ "", "" ],
	// Input a word ending in augmentative suffix -izn.
	[ "", "" ],
	// Input a word ending in augmentative suffix -isk.
	[ "", "" ],
	// Input a word ending in augmentative suffix -ák.
	[ "", "" ],
	// Input a word ending in derivational suffix -obinec.
	[ "chudobinec", "chud" ],
	// Input a word ending in derivational suffix -ionář.
	[ "milionář", "mil" ],
	// Input a word ending in derivational suffix -ovisk.
	[ "", "" ],
	// Input a word ending in derivational suffix -ovstv.
	[ "mistrovstv", "mistr" ],
	// Input a word ending in derivational suffix -ovišt.
	[ "pracovišt", "prac" ],
	// Input a word ending in derivational suffix -ovník.
	// [ "pracovník", "prac" ],
	// Input a word ending in derivational suffix -ásek.
	// [ "petrásek", "petr" ],
	// Input a word ending in derivational suffix -loun
	[ "vztekloun", "vztek" ],
	// Input a word ending in derivational suffix -nost.
	[ "společnost", "společ" ],
	// Input a word ending in derivational suffix -teln.
	[ "neuvěřiteln", "neuvěři" ],
	// Input a word ending in derivational suffix -ovec.
	[ "sportovec", "sport" ],
	// Input a word ending in derivational suffix -ovík.
	// [ "šalgovík", "šalg" ],
	// Input a word ending in derivational suffix -ovtv.
	[ "", "" ],
	// Input a word ending in derivational suffix -ovin.
	[ "těstovin", "těst" ],
	// Input a word ending in derivational suffix -štin.
	[ "slovenštin", "slovenš" ],
	// Input a word ending in derivational suffix -enic.
	[ "židenic", "žid" ],
	// Input a word ending in derivational suffix -inec.
	[ "zvěřinec", "zvěř" ],
	// Input a word ending in derivational suffix -itel.
	[ "ředitel", "řed" ],
	// Input a word ending in derivational suffix -árn.
	[ "legendárn", "legend" ],
	// Input a word ending in derivational suffix -ěnk.
	[ "doplněnk", "dopln" ],
	// Input a word ending in derivational suffix -ián.
	[ "indián", "ind" ],
	// Input a word ending in derivational suffix -ist.
	[ "kořist", "koř" ],
	// Input a word ending in derivational suffix -isk.
	[ "", "" ],
	// Input a word ending in derivational suffix -išt.
	[ "pracovišt", "prac" ],
	// Input a word ending in derivational suffix -itb.
	[ "", "" ],
	// Input a word ending in derivational suffix -írn.
	[ "", "" ],
	// Input a word ending in derivational suffix -och.
	[ "běloch", "běl" ],
	// Input a word ending in derivational suffix -ost.
	[ "možnost", "mož" ],
	// Input a word ending in derivational suffix -ovn.
	[ "sportovn", "sport" ],
	// Input a word ending in derivational suffix -oun.
	[ "bručoun", "bruč" ],
	// Input a word ending in derivational suffix -out.
	[ "přesunout", "přesun" ],
	// Input a word ending in derivational suffix -ouš.
	[ "chocholouš", "chochol" ],
	// Input a word ending in derivational suffix -ušk.
	[ "", "" ],
	// Input a word ending in derivational suffix -kyn.
	[ "přítelkyn", "přítel" ],
	// Input a word ending in derivational suffix -čan.
	[ "vesničan", "vesni" ],
	// Input a word ending in derivational suffix -kář.
	[ "zahrádkář", "zahrád" ],
	// Input a word ending in derivational suffix -néř.
	[ "platnéř", "plat" ],
	// Input a word ending in derivational suffix -ník.
	// [ "ročník", "roč" ],
	// Input a word ending in derivational suffix -ctv.
	[ "účetnictv", "účetni" ],
	// Input a word ending in derivational suffix -stv.
	[ "zemědělstv", "zeměděl" ],
	// Input a word ending in derivational suffix -áč.
	[ "květináč", "květin" ],
	// Input a word ending in derivational suffix -ač.
	[ "přepínač", "přepín" ],
	// Input a word ending in derivational suffix -án.
	[ "připsán", "přips" ],
	// Input a word ending in derivational suffix -an.
	[ "dušan", "duš" ],
	// Input a word ending in derivational suffix -ář.
	[ "komentář", "koment" ],
	// Input a word ending in derivational suffix -as.
	[ "nečas", "neč" ],
	// Input a word ending in derivational suffix -ec.
	[ "jazykovědec", "jazykověd" ],
	// Input a word ending in derivational suffix -en.
	[ "květen", "květ" ],
	// Input a word ending in derivational suffix -ěn.
	[ "propuštěn", "propušt" ],
	// Input a word ending in derivational suffix -éř.
	[ "bankéř", "bank" ],
	// Input a word ending in derivational suffix -íř.
	[ "krejčíř", "krejč" ],
	// Input a word ending in derivational suffix -ic.
	[ "čarodějnic", "čarodějn" ],
	// Input a word ending in derivational suffix -in.
	[ "dřevin", "dřev" ],
	// Input a word ending in derivational suffix -ín.
	[ "slavičín", "slavič" ],
	// Input a word ending in derivational suffix -it.
	[ "vytvořit", "vytvoř" ],
	// Input a word ending in derivational suffix -iv.
	[ "", "" ],
	// Input a word ending in derivational suffix -ob.
	[ "způsob", "způs" ],
	// Input a word ending in derivational suffix -ot.
	[ "nečistot", "nečist" ],
	// Input a word ending in derivational suffix -ov.
	[ "havířov", "hav" ],
	// Input a word ending in derivational suffix -oň.
	[ "broskvoň", "broskv" ],
	// Input a word ending in derivational suffix -ul.
	[ "přesunul", "přesun" ],
	// Input a word ending in derivational suffix -yn.
	[ "všechyn", "všech" ],
	// Input a word ending in derivational suffix -čk.
	[ "zmáčk", "zmá" ],
	// Input a word ending in derivational suffix -čn.
	[ "společn", "spole" ],
	// Input a word ending in derivational suffix -dl.
	[ "předvedl", "předve" ],
	// Input a word ending in derivational suffix -nk.
	[ "", "" ],
	// Input a word ending in derivational suffix -tv.
	[ "", "" ],
	// Input a word ending in derivational suffix -tk.
	[ "", "" ],
	// Input a word ending in derivational suffix -vk.
	[ "", "" ],
	// Input a word ending in derivational suffix -c.
	[ "majíc", "mají" ],
	// Input a word ending in derivational suffix -č.
	[ "sazeč", "saze" ],
	// Input a word ending in derivational suffix -k.
	[ "černotisk", "černotis" ],
	// Input a word ending in derivational suffix -l.
	[ "začal", "zača" ],
	// Input a word ending in derivational suffix -n.
	[ "možn", "mož" ],
	// Input a word ending in derivational suffix -t.
	[ "vyhrát", "vyhrá" ]
];

describe( "Test for stemming Czech words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataCZ ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

