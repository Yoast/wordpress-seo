import stem from "../../../src/languageProcessing/languages/it/helpers/internal/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataIT = getMorphologyData( "it" ).it;

const wordsToStem = [
	// Suffixes for which we have no examples as they are extremely unusual: -istà, -istì, -istè, -ià, -iè, -iì.
	// Input a noun with an irregular plural.
	[ "uomini", "uom" ],
	// Input an adjective with an irregular plural.
	[ "ampli", "amp" ],
	// Input a masculine plural noun.
	[ "cani", "can" ],
	// Input a masculine singular noun.
	[ "cane", "can" ],
	// Input a feminine plural noun.
	[ "finestre", "finestr" ],
	// Input a feminine singular noun.
	[ "finestra", "finestr" ],
	// Input a short singular noun with stem structure VCC.
	// [ "asso", "ass" ],
	// Input an absolute superlative adjective.
	[ "bellissimo", "bell" ],
	[ "tristissima", "trist" ],
	[ "ricchissime", "ricc" ],
	[ "decoratissimo", "decor" ],
	[ "fornitissimo", "forn" ],
	// Input an absolute superlative adverb ending in -mente.
	[ "fortissimamente", "fort" ],
	// Abolute superlative adjective that undergoes stem canonicalization.
	[ "tesissimi", "tend" ],
	// Input a diminutive.
	// [ "casina", "cas" ],
	// Input an irregular diminutive for a noun.
	[ "ovetto", "uov" ],
	// Input an irregular diminutive for an adjective.
	[ "dolciastro", "dolc" ],
	// Input an irregular diminutive for a verb.
	[ "scribacchiare", "scriv" ],
	// Input a short singular feminine adjective.
	[ "cara", "car" ],
	// Input a short singular masculine adjective.
	[ "caro", "car" ],
	// Input a short plural feminine adjective.
	[ "care", "car" ],
	// Input a short plural masculine adjective.
	[ "cari", "car" ],
	// Input an adverb.
	// Input a singular feminine adjective.
	[ "carina", "carin" ],
	// Input a singular masculine adjective.
	[ "carino", "carin" ],
	// Input a plural feminine adjective.
	[ "carine", "carin" ],
	// Input a plural masculine adjective.
	[ "carini", "carin" ],
	// Input an adverb ending in -mente.
	[ "lentamente", "lent" ],
	// Input an adverb ending in -ativamente.
	[ "qualitativamente", "qualit" ],
	// Input an adverb ending in -ivamente.
	[ "presuntivamente", "presunt" ],
	// Input an adverb ending in -osamente.
	[ "scandalosamente", "scandal" ],
	// Input an adverb ending in -icamente.
	[ "periodicamente", "period" ],
	// Input a noun ending in -icazione.
	[ "fortificazione", "fortif" ],
	// Input a noun ending in -icazioni.
	[ "fortificazioni", "fortif" ],
	// Input a noun ending in -icatore.
	[ "verificatore", "verif" ],
	// Input a noun ending in -icatori.
	[ "verificatori", "verif" ],
	// Input a noun ending in -azione.
	[ "combinazione", "combin" ],
	// Input a noun ending in -azioni.
	[ "combinazioni", "combin" ],
	// Input a noun ending in -atore.
	[ "combinatore", "combin" ],
	// Input a noun ending in -atori.
	[ "combinatori", "combin" ],
	// Input a noun ending in -logia.
	[ "cardiologia", "cardiolog" ],
	// Input a noun ending in -logie.
	[ "cardiologia", "cardiolog" ],
	// Input a noun ending in -uzione.
	[ "evoluzione", "evolu" ],
	// Input a noun ending in -uzioni.
	[ "evoluzioni", "evolu" ],
	// Input a noun ending in -usione.
	[ "illusione", "illusion" ],
	// Input a noun ending in -usioni.
	[ "illusioni", "illusion" ],
	// Input a noun ending in -enza.
	[ "rimanenza", "rimanent" ],
	// Input a noun ending in -enze.
	[ "rimanenze", "rimanent" ],
	// Input a noun ending in -amento.
	[ "insegnamento", "insegn" ],
	// Input a noun ending in -amenti.
	[ "insegnamenti", "insegn" ],
	// Words originally stemmed to "port" get canonicalized to "porg".
	[ "portamento", "porg" ],
	[ "portamenti", "porg" ],
	// Input a noun ending in -imento.
	[ "approfondimento", "approfond" ],
	// Input a noun ending in -imenti.
	[ "approfondimenti", "approfond" ],
	// Input an adverb ending in -amente.
	[ "serenamente", "seren" ],
	// Input a noun ending in -atrice.
	[ "incantatrice", "incant" ],
	// Input a noun ending in -atrici.
	[ "incantatrici", "incant" ],
	// Input an adjective ending in -abile.
	[ "desiderabile", "desider" ],
	// Input an adjective ending in -abili.
	[ "desiderabili", "desider" ],
	// Input an adjective ending in -ibile.
	[ "digeribile", "diger" ],
	// Input an adjective ending in -ibili.
	[ "digeribili", "diger" ],
	// Input an adjective ending in -ante.
	[ "ignorante", "ignor" ],
	// Input an adjective ending in -anti.
	[ "ignoranti", "ignor" ],
	// Input a noun ending in -anza.
	[ "rimostranza", "rimostr" ],
	// Input a noun ending in -anze.
	[ "rimostranze", "rimostr" ],
	// Input a plurar adjective ending in -iche.
	[ "malinconiche", "malincon" ],
	// Input a plurar noun ending in -ichi.
	[ "incarichi", "incar" ],
	// Input a noun ending in -ismo.
	[ "sillogismo", "sillog" ],
	// Input a noun ending in -ismi.
	[ "sillogismi", "sillog" ],
	// Input a noun ending in -ista.
	[ "periodista", "period" ],
	// Input a noun ending in -iste.
	[ "periodiste", "period" ],
	// Input a noun ending in -isti.
	[ "periodisti", "period" ],
	// Input an adjective ending in -ico.
	[ "simpatico", "simpat" ],
	// Input an adjective ending in -ica.
	[ "simpatica", "simpat" ],
	// Input an adjective ending in -ice.
	[ "infelice", "infel" ],
	// Input an adjective ending in -ici.
	[ "infelici", "infel" ],
	// Input an adjective ending in -oso.
	[ "muscoloso", "muscol" ],
	// Input an adjective ending in -osi.
	[ "muscolosi", "muscol" ],
	// Input an adjective ending in -osa.
	[ "muscolosa", "muscol" ],
	// Input an adjective ending in -ose.
	[ "muscolose", "muscol" ],
	// Input a noun ending in -abilità.
	[ "applicabilità", "applic" ],
	// Input a noun ending in -icità.
	[ "periodicità", "period" ],
	// Input a noun ending in -ività.
	[ "obiettivitá", "obiett" ],
	// Input a noun ending in -ità.
	[ "personalità", "personal" ],
	// Input an adjective ending in -icativa.
	[ "esemplificativa", "esemplif" ],
	// Input an adjective ending in -icativo.
	[ "esemplificativo", "esemplif" ],
	// Input an adjective ending in -icativi.
	[ "esemplificativi", "esemplif" ],
	// Input an adjective ending in -icative.
	[ "esemplificative", "esemplif" ],
	// Input an adjective ending in -ativa.
	[ "dimostrativa", "dimostr" ],
	// Input an adjective ending in -ativo.
	[ "dimostrativo", "dimostr" ],
	// Input an adjective ending in -ativi.
	[ "dimostrativi", "dimostr" ],
	// Input an adjective ending in -ative.
	[ "dimostrative", "dimostr" ],
	// Input an adjective ending in -iva.
	[ "corrosiva", "corros" ],
	// Input an adjective ending in -ivo.
	[ "corrosivo", "corros" ],
	// Input an adjective ending in -ivi.
	[ "corrosivi", "corros" ],
	// Input an adjective ending in -ive.
	[ "corrosive", "corros" ],
	// Changes a stem ending in -ch to -c.
	[ "antiche", "antic" ],
	// Changes a stem ending in -gh to -g.
	[ "luoghi", "luog" ],
	// Input a noun ending in -ia.
	[ "regia", "reg" ],
	// Input a noun ending in -ie.
	[ "regie", "reg" ],
	// A verb form ending in -ii.
	[ "arrossii", "arross" ],
	// Input a noun ending in -io.
	[ "ventaglio", "ventagl" ],
	// Input a verb form ending in -iò
	[ "allacciò", "allacc" ],
	// Input a verb form ending in -à
	[ "aprirà", "aprir" ],
	[ "tendé", "tend" ],
	// Input a verb form ending in -ì
	[ "arrossì", "arross" ],
	//  Input a verb form ending in -ò
	[ "articolò", "articol" ],
	//  A suffix (-ativo in the example) does not get stemmed if not found in the right region.
	[ "stativo", "stat" ],
	//  Returns the word if no suffixes are found.
	[ "alcol", "alcol" ],
	// Participles ending in -uto.
	[ "conceduto", "conced" ],
	[ "venuto", "ven" ],
	// Participles ending in -ito.
	[ "insistito", "insist" ],
	// Irregular participles stemmed to a canonical stem.
	[ "acces", "accend" ],
	[ "esplos", "esplod" ],
	[ "risolt", "risolv" ],
];

const paradigms = [
	// A verb paradigm in are.
	{
		stem: "impar",
		forms: [
			"imparo",
			"imparano",
			"imparavo",
			"imparavi",
			"imparava",
			"imparavamo",
			"imparavate",
			"imparavano",
			"imparai",
			// "imparasti",
			"imparò",
			"imparammo",
			"impararono",
			"imparerò",
			"imparerai",
			"imparerà",
			"impareremo",
			"imparerete",
			"impareranno",
			"imparerei",
			"impareresti",
			"imparerebbe",
			"impareremmo",
			"imparereste",
			"imparerebbero",
			"impariate",
			"imparassi",
			"imparasse",
			"imparassimo",
			// "imparaste",
			"imparassero",
			"impara",
			"impari",
			"impariamo",
			"imparate",
			// "imparino",
			"imparare",
			"imparante",
			"imparato",
			"imparando",
		],
	},
	// A verb paradigm in ere.
	{
		stem: "corr",
		forms: [
			"corro",
			"corre",
			"corrono",
			"correvo",
			"correvi",
			"correva",
			"correvamo",
			"correvate",
			"correvano",
			"corsi",
			// "corresti",
			"corse",
			"corremmo",
			// "corsero",
			"correrò",
			"correrai",
			"correrà",
			"correremo",
			"correrete",
			"correranno",
			"correrei",
			"correresti",
			"correrebbe",
			"correremmo",
			"correreste",
			"correrebbero",
			"corriate",
			// "corressi",
			// "corresse",
			// "corressimo",
			// "correste",
			"corressero",
			"corri",
			"corra",
			"corriamo",
			"correte",
			"corrano",
			"correre",
			// "corrente",
			"corso",
			"correndo",
		],
	},
	// A verb paradigm in ire.
	{
		stem: "dorm",
		forms: [
			"dormi",
			"dormo",
			"dorme",
			"dormiamo",
			"dormite",
			"dormono",
			"dormivo",
			"dormivi",
			"dormiva",
			"dormivamo",
			"dormivate",
			"dormivano",
			"dormii",
			// "dormisti",
			"dormì",
			"dormimmo",
			// "dormiste",
			"dormirono",
			"dormirò",
			"dormirai",
			"dormirà",
			"dormiremo",
			"dormirete",
			"dormiranno",
			"dormirei",
			"dormiresti",
			"dormirebbe",
			"dormiremmo",
			"dormireste",
			"dormirebbero",
			"dorma",
			"dorma",
			"dorma",
			"dormiamo",
			"dormiate",
			"dormano",
			// "dormissi",
			// "dormisse",
			// "dormissimo",
			// "dormiste",
			"dormissero",
			"dormi",
			"dorma",
			"dormiamo",
			"dormite",
			"dormano",
			"dormire",
			// "dormente",
			// "dormiente",
			"dormito",
			"dormendo",
		],
	},
	/*
	 * A verb paradigm with a pronoun ending.
	 * "Portare" receives the stem "porg" because its stem "port" is seen as part of the "porgere" paradigm. This doesn't
	 * impede the functionality except leading to forms of "porgere" being collapsed with forms of "portare". This
	 * has a low real-life impact in keyphrase recogniton.
	 */
	{   stem: "porg",
		forms: [
			"portarglieli",
			"portarglielo",
			"portargliene",
			"portargliela",
			"portargliele",
			"portarsene",
			"portartene",
			"portarcela",
			"portarcele",
			"portarceli",
			"portarcelo",
			"portarcene",
			"portarvela",
			"portarvele",
			"portarveli",
			"portarvelo",
			"portarvene",
			"portarmela",
			"portarmele",
			"portarmeli",
			"portarmelo",
			"portarmene",
			"portartela",
			"portartele",
			"portarteli",
			"portartelo",
			"portargli",
			"portarci",
			"portarla",
			"portarle",
			"portarli",
			"portarlo",
			"portarmi",
			"portarne",
			"portarsi",
			"portarti",
			"portarvi",
		],
	},
];

describe( "Test for stemming Italian words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataIT ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataIT ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
