import stem from "../../../src/languageProcessing/languages/es/morphology/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataES = getMorphologyData( "es" ).es;

const wordsToStem = [
	// Input a word that ends in -s but is not a plural.
	[ "caos", "caos" ],
	[ "gas", "gas" ],
	[ "martes", "martes" ],
	[ "microondas", "microondas" ],
	[ "jesús", "jesus" ],
	// Input noun with: singular: -z, plural: -ces
	[ "actriz", "actriz" ],
	[ "actrices", "actriz" ],
	[ "luz", "luz" ],
	[ "luces", "luz" ],
	[ "voz", "voz" ],
	[ "voces", "voz" ],
	// Input a word that ends with a clitic pronoun and is on the list of words that end like pronouns suffixes but are not verbs.
	[ "anime", "anim" ],
	[ "abuela", "abuel" ],
	// Input a word that ends with a clitic pronoun and is a verb.
	[ "abofarse", "abof" ],
	// [ "mírame", "mir" ],
	// Input a word that does not ends with a clitic pronoun and is on the exceptions full forms list.
	[ "sacratísimo", "sagrad" ],
	[ "veamos", "ver" ],
	[ "libanesa", "libanes" ],
	[ "libanés", "libanes" ],
	[ "crudelísimas", "cruel" ],
	// Input a word that looks like a diminutive but is not.
	[ "acólito", "acolit" ],
	[ "amalecitas", "amalecit" ],
	// Input a word that is on the diminutive exceptions list for diminutives ending in -it-.
	[ "reicito", "rey" ],
	[ "realitito", "reality" ],
	[ "lucecita", "luz" ],
	[ "actricita", "actriz" ],
	[ "ciudadcita", "ciudad" ],
	[ "ciudadita", "ciudad" ],
	[ "raicitos", "raiz" ],
	[ "raicitas", "raiz" ],
	// Input a diminutive that is on the stem canonicalization exception list for nouns
	[ "ciudaduela", "ciudad" ],
	[ "ciudadela", "ciudad" ],
	[ "abejuela", "abej" ],
	[ "locuelo", "loc" ],
	// Input a word that is a typical diminutive and should be stemmed by the rules.
	[ "puertecita", "puert" ],
	[ "ventitas", "vent" ],
	[ "suavito", "suav" ],
	[ "vueltito", "vuelt" ],
	[ "vueltecito", "vuelt" ],
	[ "jovencitos", "joven" ],
	[ "amorcitos", "amor" ],
	[ "valsecito", "vals" ],
	[ "reyecito", "rey" ],
	[ "pianito", "pian" ],
	[ "gobiernito", "gobiern" ],
	[ "huesitos", "hues" ],
	[ "aparatito", "aparat" ],
	[ "paseítos", "pase" ],
	[ "jadeíta", "jade" ],
	// Input a word that ends in a suffix preceded by uy.
	[ "excluyendo", "exclu" ],
	[ "atribuyes", "atribu" ],
	// Input a word that undergoes stem modification changes.
	[ "recuerdan", "record" ],
	[ "comienzo", "comenz" ],
	// Input a word that ends in a common verb suffix.
	[ "saltaron", "salt" ],
	// [ "revocares", "revoc" ],
	// Input a word that ends in -os, -s, -a, -o, -á, -í,-ó, -é, -e.
	[ "agostinas", "agostin" ],
	[ "boboré", "bobor" ],
	// Input a word that is on the stems that belong together list.
	// [ "dollar", "dolar" ],
	// [ "chalets", "chale" ],
	// [ "sé", "sab" ],
	[ "quepa", "cab" ],
	// Input a word that ends in -en, -es, -éis, -emos and is not preceded by gu.
	[ "valéis", "val" ],
	[ "dirigen", "dirig" ],
	// Input a word that ends in -en, -es, -éis, -emos and is preceded by gu.
	[ "distinguen", "distingu" ],
	[ "alarguemos", "alarg" ],
	// Input a word that looks like a verb form but it's not.
	// [ "cabalgada", "cabalgad" ],
	// [ "abacerías", "abaceri" ],
	// Input a word that looks like a verb form and is on the list of stems that belong together.
	[ "san", "san" ],
	[ "virgen", "virgen" ],
	// Input a word that ends in -í, either a verb or a noun.
	[ "entendí", "entend" ],
	[ "marroquí", "marroqu" ],
	// Input an adverb that ends in -mente preceded by a consonant.
	[ "actualmente", "actual" ],
	[ "hábilmente", "habil" ],
	// Input an adverb that ends in -mente preceded by a vowel.
	[ "rápidamente", "rapid" ],
	[ "aparentemente", "aparent" ],
	// Input a word that ends in -mente but is not an adverb.
	[ "mentes", "ment" ],
	[ "fundamente", "fundament" ],
	// Input a superlative that ends in -ísimo, -ísima, ísimos, -ísimas and is preceded by bil.
	[ "notabilísimo", "notabl" ],
	[ "respetabilísimas", "respetabl" ],
	// Input a superlative that ends in -ísimo, -ísima, ísimos, -ísimas and is preceded by qu, gu.
	[ "riquísimo", "ric" ],
	[ "amiguísimas", "amig" ],
	// Input a superlative that ends in -ísimo, -ísima, ísimos, -ísimas and is preceded by c.
	[ "felicísimo", "feliz" ],
	[ "velocísimas", "veloz" ],
	// Input a superlative that ends in -ísimo, -ísima, ísimos, -ísimas and is preceded by i.
	[ "impiísima", "impi" ],
	/*
	 * Input a superlative that ends in -ísimo, -ísima, ísimos, -ísimas and is preceded by
	 * -b, -d, -f, -g, -h, -i, -l, -m, -n, -p, -q, -r, -s, -t, -v, -z, -x, -y, -w, -k, -j, -u.
	 */
	[ "rapidísimo", "rapid" ],
	[ "generalísimas", "general" ],
	// Input a superlative that ends in -érrimo, -érrima, -érrimos, érrimas.
	[ "genialérrima", "genial" ],
	[ "tristérrimo", "trist" ],
	// Exceptions in superlatives.
	[ "habilísima", "habil" ],
	[ "majérrimo", "majerrim" ],
	[ "cérrimo", "cerrim" ],
	[ "gérrimo", "gerrim" ],
	[ "torísimo", "torisim" ],
	[ "físima", "fisim" ],
	[ "dísima", "disim" ],
	// Input a word whose stem ends in ij ∧ suffix = {o, a, as, amos, áis, an}. [verbs in -igir]
	[ "dirijo", "dirig" ],
	[ "exijamos", "exig" ],
	[ "inflijo", "inflig" ],
	// Input a word whose stem ends in ij ∧ suffix = {o, a, as, amos, áis, an}. [verbs in -egir]
	[ "elija", "eleg" ],
	[ "corrijáis", "correg" ],
	[ "rijamos", "reg" ],
	[ "colijan", "coleg" ],
	// Input a word whose stem ends in ig ∧ suffix = {es, e, en, ió, ieron, iendo, [imp. & fut. subj suffixes]}. [verbs in -igir]
	[ "infligieras", "inflig" ],
	[ "transigió", "transig" ],
	[ "transijáis", "transig" ],
	// Input a word whose stem ends in ig ∧ suffix = {es, e, en, ió, ieron, iendo, [imp. & fut. subj suffixes]}. [verbs in -egir]
	[ "colegíamos", "coleg" ],
	[ "colige", "coleg" ],
	[ "registeis", "reg" ],
	[ "rigiera", "reg" ],
	// Input a word whose stem ends in zc ∧ suffix = {o, [pres. subj suffixes], a, as, amos, áis, an}.
	[ "conozco", "conoc" ],
	[ "conozcamos", "conoc" ],
	[ "traduzcamos", "traduc" ],
	[ "compadezco", "compadec" ],
	// Input a word whose stem ends in -c ∧ suffix = {é}.
	[ "lancé", "lanz" ],
	[ "visualicé", "visualiz" ],
	[ "empecé", "empez" ],
	/*
	 * Input a word whose stem ends in x: X = CVC(C) ∧ V = {i} ∧ suffix =
	 * {í, iste, ió, imos, isteis, ieron, amos, áis, iendo, [imp. & fut. subj suffixes], [pres. subj suffixes], e, o}.
	 */
	[ "sintió", "sent" ],
	[ "sugiriese", "suger" ],
	/*
	 * Input a word whose stem ends in x: X = CVC(C) ∧ V = {u} ∧ suffix =
	 * {í, iste, ió, imos, isteis, ieron, amos, áis, iendo, [imp. & fut. subj suffixes], [pres. subj suffixes], e, o}.
	 */
	[ "murieron", "mor" ],
	[ "durmió", "dorm" ],
	// Input a word whose stem contains ie (but not in the infinitive) ∧ suffix = {o, es, as, e, a, en, an}.
	[ "cierno", "cern" ],
	[ "aciertas", "acert" ],
	// Input a word whose stem contains ue (but not in the infinitive) ∧ suffix = {o, es, as, e, a, en, an}.
	[ "recuerdan", "record" ],
	[ "resuelves", "resolv" ],
	// Input a word whose stem contains ue in the infinitive.
	[ "quejan", "quej" ],
	[ "quemas", "quem" ],
	// Input a verb where stem ends on -í-, ú- and precedes -o, -as, -a, -an, -e, -es, -en.
	[ "espían", "espi" ],
	[ "envías", "envi" ],
	[ "consensúas", "consensu" ],
	[ "licúa", "licu" ],
	// Input a verb where stem ends on -qu-, -gu- and precedes -é, -e, -es, -emos, -éis, -en
	[ "apliques", "aplic" ],
	[ "ataquemos", "atac" ],
	[ "rebusques", "rebusc" ],
	[ "conjuguen", "conjug" ],
	[ "juzguéis", "juzg" ],
	// Exceptions for rules on stem-modifying verbs.
	[ "aguaste", "agu" ],
	[ "engreíais", "engre" ],
	[ "interdijese", "interdec" ],
	// Input a verb that has multiple stems.
	[ "compuesta", "compon" ],
	[ "compongo", "compon" ],
	[ "componer", "compon" ],
	// Input a verb that ends in quir.
	[ "desagua", "desagu" ],
	[ "desagüé", "desagu" ],
	// Input a verb that ends in guir.
	[ "autoextingo", "autoextingu" ],
	[ "autoextinguimos", "autoextingu" ],
	// Input a verb that ends in guar.
	[ "menguamos", "mengu" ],
	[ "mengüé", "mengu" ],
	// Input a verb that ends in ducir.
	[ "abducir", "abduc" ],
	[ "abduzco", "abduc" ],
	[ "abdujo", "abduc" ],
	[ "abdujerás", "abduc" ],
	[ "abdujeses", "abduc" ],
	// Input a verb that ends in seguir.
	[ "autoseguir", "autosegu" ],
	[ "autosiga", "autosegu" ],
	[ "autosiguemos", "autosegu" ],
	[ "autoseguid", "autosegu" ],
	// Input a verb that ends in sentir.
	[ "desconsentir", "desconsent" ],
	[ "desconsiento", "desconsent" ],
	[ "desconsintió", "desconsent" ],
	// Words that look like verb forms but aren't verbs.
	// Non-verb ending in -ió
	[ "chevió", "chevi" ],
	[ "cheviós", "chevi" ],
	// Non-verb ending in -irán
	[ "caguairán", "caguairan" ],
	[ "caguairanes", "caguairan" ],
	// Non-verb ending in -ái
	[ "samurái", "samurai" ],
	[ "samuráis", "samurai" ],
	// Non-verb ending in -ei
	[ "chatolei", "chatolei" ],
	// Non-verb ending in -éi
	[ "upéi", "upei" ],
	// Non-verb ending in -ir
	[ "mártir", "martir" ],
	[ "mártires", "martir" ],
	// Non-verb ending in -ír
	[ "hazmerreír", "hazmerreir" ],
	// Non-verb ending in -ada
	[ "abada", "abad" ],
	[ "abadas", "abad" ],
	// Non-verb ending in -ado
	[ "mercado", "mercad" ],
	[ "mercados", "mercad" ],
	// Non-verb ending in -imo
	[ "mínimo", "minim" ],
	[ "mínimos", "minim" ],
	// Non-verb ending in -emo
	[ "extremo", "extrem" ],
	[ "extremos", "extrem" ],
	// Non-verb ending in -ad
	[ "ciudad", "ciudad" ],
	[ "ciudades", "ciudad" ],
	// Non-verb ending in -ed
	[ "pared", "pared" ],
	[ "paredes", "pared" ],
	// Non-verb ending in -ie
	[ "serie", "seri" ],
	[ "series", "seri" ],
	// Non-verb ending in -ié
	[ "hincapié", "hincapi" ],
	[ "hincapiés", "hincapi" ],
	// Non-verb ending in -ando
	[ "contrabando", "contraband" ],
	[ "contrabandos", "contraband" ],
	// Non-verb ending in -ándo
	[ "cuándo", "cuand" ],
	// Non-verb ending in -aré
	[ "pagaré", "pagar" ],
	[ "pagarés", "pagar" ],
	// Non-verb ending in -eré
	[ "tereré", "terer" ],
	[ "tererés", "terer" ],
	// Non-verb ending in -ará
	[ "yarará", "yarar" ],
	[ "yararás", "yarar" ],
	// Non-verb ending in -erá
	[ "camerá", "camer" ],
	[ "camerás", "camer" ],
	// Non-verb ending in -irá
	[ "aragüirá", "aragüir" ],
	[ "aragüirás", "aragüir" ],
	// Non-verb ending in -ia
	[ "historia", "histori" ],
	[ "historias", "histori" ],
	// Non-verb ending in -id
	[ "apartheid", "apartheid" ],
	// Non-verb ending in -aba
	[ "guayaba", "guayab" ],
	[ "guayabas", "guayab" ],
	// Non-verb ending in -asta
	[ "canasta", "canast" ],
	[ "canastas", "canast" ],
	// Non-verb ending in -iste
	[ "quiste", "quist" ],
	[ "quistes", "quist" ],
	// Non-verb ending in -aste
	[ "contraste", "contrast" ],
	[ "contrastes", "contrast" ],
	// Non-verb ending in -ía
	[ "policía", "polici" ],
	[ "policías", "polici" ],
	// Non-verb ending in -an
	[ "eslogan", "eslogan" ],
	[ "eslóganes", "eslogan" ],
	// Non-verb ending in -en
	[ "imagen", "imagen" ],
	[ "imágenes", "imagen" ],
	// Non-verb ending in -er
	[ "mujer", "mujer" ],
	[ "mujeres", "mujer" ],
	// Non-verb ending in -iendo
	[ "arriendo", "arriend" ],
	[ "arriendos", "arriend" ],
	// Non-verb ending in -ieron
	[ "gobieron", "gobieron" ],
	// Non-verb ending in -iera
	[ "ingeniera", "ingenier" ],
	[ "ingenieras", "ingenier" ],
	// Non-verb ending in -aron
	[ "gatillaron", "gatillaron" ],
	// Non-verb ending in -ida
	[ "vida", "vid" ],
	[ "vidas", "vid" ],
	// Non-verb ending in -ido
	[ "partido", "part" ],
	[ "partidos", "part" ],
	// Non-verb ending in -amo
	[ "reclamo", "reclam" ],
	[ "reclamos", "reclam" ],
	// Non-verb ending in -ara
	[ "máscara", "mascar" ],
	[ "máscaras", "mascar" ],
	// Non-verb ending in -ere
	[ "títere", "titer" ],
	[ "títeres", "titer" ],
	// Non-verb ending in -ase
	[ "base", "bas" ],
	[ "bases", "bas" ],
	// Non-verb ending in -ar
	[ "hogar", "hogar" ],
	[ "hogares", "hogar" ],
	// Non-verb ending in -ya
	[ "playa", "play" ],
	[ "playas", "play" ],
	// Non-verb ending in -ye
	[ "rallye", "rally" ],
	// Non-verb ending in -yo
	[ "apoyo", "apoy" ],
	[ "apoyos", "apoy" ],
	// Non-verb ending in -yera
	[ "playera", "player" ],
	[ "playeras", "player" ],
	// Non-verb ending in -arán
	[ "catamarán", "catamaran" ],
	[ "catamaranes", "catamaran" ],
	// Non-verb ending in -erán
	[ "bumerán", "bumeran" ],
	// Non-verb ending in -asta
	[ "empaste", "empast" ],
	[ "empastes", "empast" ],
	// Non-verb ending in -iste
	[ "quiste", "quist" ],
	[ "quistes", "quist" ],
	// Non-verb ending in -ida
	[ "sólida", "solid" ],
	[ "sólidas", "solid" ],
	// Non-verb ending in -ido
	[ "antióxido", "antioxid" ],
	[ "antióxidos", "antioxid" ],
	// Input a word that looks like it ends on a personal pronoun but is not.
	// Word with no personal pronoun ending on -me
	[ "uniforme", "uniform" ],
	// Word with no personal pronoun ending on -se
	[ "concordiense", "concordiens" ],
	// Word with no personal pronoun ending on -le
	[ "doble", "dobl" ],
	// Word with no personal pronoun ending on -la
	[ "acerolas", "acerol" ],
	// Word with no personal pronoun ending on -lo
	[ "estrello", "estrell" ],
	// Word with no personal pronoun ending on -no
	[ "infernos", "infern" ],
];

const paradigms = [
	// A paradigm with various types of diminutive
	{ stem: "nariz", forms: [ "nariz", "naricitas", "narizotas" ] },
	{ stem: "murall", forms: [ "murallas", "murallitas", "murallotas" ] },
	{ stem: "azucar", forms: [ "azúcar", "azucarita", "azuquítar" ] },
	{ stem: "pared", forms: [ "pared", "paredcita", "parecita", "paredita", "paredilla" ] },
	{ stem: "ciudad", forms: [ "ciudadcita", "ciudadita", "ciudaduela", "ciudadela" ] },
	{ stem: "alegr", forms: [ "alegre", "alegrete", "alegreta" ] },
	{ stem: "mam", forms: [ "mama", "mamá", "mamaíta", "mamita", "mamacita", "mami" ] },
	{ stem: "pap", forms: [ "papa", "papá", "papaíto", "papito", "papacito", "papi" ] },
	{ stem: "bibliotec", forms: [ "biblioteca", "bibliotecita" ] },
	{ stem: "muñec", forms: [ "muñeca", "muñecas", "muñeco", "muñecos", "muñecito" ] },
	{ stem: "chalec", forms: [ "chaleco", "chalecos", "chalecito", "chalecitos" ] },
	{ stem: "chec", forms: [ "checo", "checos", "checito", "checitos" ] },
	{ stem: "jaquec", forms: [ "jaqueca", "jaquecas", "jaquecita", "jaquecitas" ] },
	{ stem: "videotec", forms: [ "videoteca", "videotecas", "videotecita", "videotecitas" ] },
	{ stem: "rey", forms: [ "reyecito", "reyecitos", "reicito", "reicitos", "reyito", "reyitos" ] },
	{ stem: "puert", forms: [ "puertecito", "puertecitos", "puertito", "puertitos" ] },
	{ stem: "beb", forms: [ "bebita", "bebitas", "bebecita", "bebecitas", "bebecito" ] },
	{ stem: "lunch", forms: [ "lonchecito", "lonchito", "lunchito" ] },

];


describe( "Test for stemming Spanish words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataES ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataES ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
