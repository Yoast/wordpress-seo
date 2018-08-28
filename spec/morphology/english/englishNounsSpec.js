const nounData = require( "../../../js/morphology/english/englishMorphology.json" ).nouns;
const irregularNounsToTest = nounData.irregularNouns;
const regexNoun = nounData.regexNoun;

const getNounFormsWithPossessives = require(  "../../../js/morphology/english/getNounForms" ).getNounFormsWithPossessives;
const getNounForms = require(  "../../../js/morphology/english/getNounForms" ).getNounForms;
const checkPossessive = require(  "../../../js/morphology/english/getNounForms" ).checkPossessive;

const buildOneFormFromRegex  = require( "../../../js/morphology/morphoHelpers/buildFormFromRegex" ).buildOneFormFromRegex;
const buildTwoFormsFromRegex  = require( "../../../js/morphology/morphoHelpers/buildFormFromRegex" ).buildTwoFormsFromRegex;
const createRulesFromJsonArrays = require( "../../../js/morphology/morphoHelpers/createRulesFromJsonArrays" );

const regularNounsToTest = [
	[ "word", "words" ],
	[ "horse", "horses" ],
	[ "knife", "knives" ],
	[ "lolly", "lollies" ],
	[ "fly", "flies" ],
	[ "buy", "buys" ],
	[ "half", "halves" ],
	[ "scarf", "scarves" ],
	[ "handkerchief", "handkerchieves" ],
	[ "boss", "bosses" ],
	[ "ex", "exes" ],
	[ "man", "men" ],
	[ "candyman", "candymen" ],
	[ "crisis", "crises" ],
	[ "analytics", "analytics" ],
	[ "sickness", "sicknesses" ],
	[ "policeman", "policemen" ],
	[ "berry", "berries" ],
	[ "activity", "activities" ],
	[ "daisy", "daisies" ],
	[ "church", "churches" ],
	[ "fox", "foxes" ],
	[ "knife", "knives" ],
	[ "half", "halves" ],
	[ "scarf", "scarves" ],
	[ "chief", "chiefs" ],
	[ "spoof", "spoofs" ],
	[ "solo", "solos" ],
	[ "studio", "studios" ],
	[ "zoo", "zoos" ],
	[ "embryo", "embryos" ],
	[ "roof", "roofs" ],
	[ "proof", "proofs" ],
	[ "chief", "chiefs" ],
	[ "leaf", "leaves" ],
	[ "loaf", "loaves" ],
	[ "thief", "thieves" ],
	[ "hive", "hives" ],
	[ "move", "moves" ],
	[ "rodeo", "rodeos" ],
	[ "pox", "poxes" ],

	// Latin: um - a
	[ "orbitum", "orbita" ],
	[ "paraphrenelium", "paraphrenelia" ],
	[ "scriptorium", "scriptoria" ],
	[ "tintinnabulum", "tintinnabula" ],
	[ "rostrum", "rostra" ],

	// Latin: sis - ses
	[ "abdominocentesis", "abdominocenteses" ],
	[ "abiogenesis", "abiogeneses" ],
	[ "acanthocytosis", "acanthocytoses" ],
	[ "acantholysis", "acantholyses" ],
	[ "acetolysis", "acetolyses" ],
	[ "acidosis", "acidoses" ],
	[ "acrocyanosis", "acrocyanoses" ],
	[ "adenomatosis", "adenomatoses" ],
	[ "aerobiosis", "aerobioses" ],
	[ "aesthesis", "aestheses" ],
	[ "agenesis", "ageneses" ],
	[ "agranulocytosis", "agranulocytoses" ],
	[ "alcoholysis", "alcoholyses" ],
	[ "analysis", "analyses" ],
	[ "analyzis", "analyzes" ],
	[ "catalysis", "catalyses" ],
	[ "crisis", "crises" ],
	[ "deixis", "deixes" ],
	[ "dermatosis", "dermatoses" ],
	[ "dermostosis", "dermostoses" ],
	[ "diaeresis", "diaereses" ],
	[ "diæresis", "diæreses" ],
	[ "diagenesis", "diageneses" ],
	[ "diagnosis", "diagnoses" ],
	[ "dialysis", "dialyses" ],
	[ "diagnosis", "diagnoses" ],
	[ "diaresis", "diareses" ],
	[ "diathesis", "diatheses" ],
	[ "diegesis", "diegeses" ],
	[ "dieresis", "diereses" ],
	[ "diagnosis", "diagnoses" ],
	[ "diparesis", "dipareses" ],
	[ "diuresis", "diureses" ],
	[ "dysgenesis", "dysgeneses" ],
	[ "dyshidrosis", "dyshidroses" ],
	[ "dyskeratosis", "dyskeratoses" ],
	[ "eisegesis", "eisegeses" ],
	[ "ekstasis", "ekstases" ],
	[ "electrophoresis", "electrophoreses" ],
	[ "electrosynthesis", "electrosyntheses" ],
	[ "ellipsis", "ellipses" ],
	[ "embryogenesis", "embryogeneses" ],
	[ "emphasis", "emphases" ],
	[ "endometriosis", "endometrioses" ],
	[ "endoprosthesis", "endoprostheses" ],
	[ "endostosis", "endostoses" ],
	[ "endosymbiosis", "endosymbioses" ],
	[ "entasis", "entases" ],
	[ "enthesis", "entheses" ],
	[ "enuresis", "enureses" ],
	[ "epenthesis", "epentheses" ],
	[ "epexegesis", "epexegeses" ],
	[ "epicrisis", "epicrises" ],
	[ "epigenesis", "epigeneses" ],
	[ "epileptogenesis", "epileptogeneses" ],
	[ "epipubis", "epipubes" ],
	[ "epistasis", "epistases" ],
	[ "epistaxis", "epistaxes" ],
	[ "episymbiosis", "episymbioses" ],
	[ "epitasis", "epitases" ],
	[ "epithesis", "epitheses" ],
	[ "epizeuxis", "epizeuxes" ],
	[ "erythrocytosis", "erythrocytoses" ],
	[ "esthesis", "estheses" ],
	[ "ethnogenesis", "ethnogeneses" ],
	[ "etiopathogenesis", "etiopathogeneses" ],
	[ "exegesis", "exegeses" ],
	[ "exocytosis", "exocytoses" ],
	[ "haematolysis", "haematolyses" ],
	[ "haemochromatosis", "haemochromatoses" ],
	[ "haemodialysis", "haemodialyses" ],
	[ "haemolysis", "haemolyses" ],
	[ "haemostasis", "haemostases" ],
	[ "hemarthrosis", "hemarthroses" ],
	[ "hemiparesis", "hemipareses" ],
	[ "hemipenis", "hemipenes" ],
	[ "hemochromatosis", "hemochromatoses" ],
	[ "hemodialysis", "hemodialyses" ],
	[ "hemolysis", "hemolyses" ],
	[ "hemostasis", "hemostases" ],
	[ "heterosis", "heteroses" ],
	[ "hidrosis", "hidroses" ],
	[ "histiocytosis", "histiocytoses" ],
	[ "histogenesis", "histogeneses" ],
	[ "homeostasis", "homeostases" ],
	[ "hydroarthrosis", "hydroarthroses" ],
	[ "hydrogenolysis", "hydrogenolyses" ],
	[ "hydrolysis", "hydrolyses" ],
	[ "hydropyrolysis", "hydropyrolyses" ],
	[ "hyperkeratosis", "hyperkeratoses" ],
	[ "hyperkinesis", "hyperkineses" ],
	[ "hyperostosis", "hyperostoses" ],
	[ "hypnosis", "hypnoses" ],
	[ "hypochondriasis", "hypochondriases" ],
	[ "hypodermoclysis", "hypodermoclyses" ],
	[ "hypogenesis", "hypogeneses" ],
	[ "hypomelanosis", "hypomelanoses" ],
	[ "hypophysis", "hypophyses" ],
	[ "hypostasis", "hypostases" ],
	[ "hypothesis", "hypotheses" ],
	[ "hypotyposis", "hypotyposes" ],
	[ "hysteresis", "hystereses" ],
	[ "hæmochromatosis", "hæmochromatoses" ],
	[ "iatrogenesis", "iatrogeneses" ],
	[ "iconostasis", "iconostases" ],
	[ "interaxis", "interaxes" ],
	[ "iridodialysis", "iridodialyses" ],
	[ "iridotasis", "iridotases" ],
	[ "metalepsis", "metalepses" ],
	[ "metamorphosis", "metamorphoses" ],
	[ "metanalysis", "metanalyses" ],
	[ "metaphysis", "metaphyses" ],
	[ "metapophysis", "metapophyses" ],
	[ "metastasis", "metastases" ],
	[ "metathesis", "metatheses" ],
	[ "metempsychosis", "metempsychoses" ],
	[ "metensomatosis", "metensomatoses" ],
	[ "microanalysis", "microanalyses" ],
	[ "microgenesis", "microgeneses" ],
	[ "micrometastasis", "micrometastases" ],
	[ "mid-life crisis", "mid-life crises" ],
	[ "miosis", "mioses" ],
	[ "misanalysis", "misanalyses" ],
	[ "misdiagnosis", "misdiagnoses" ],
	[ "mitosis", "mitoses" ],
	[ "morphosis", "morphoses" ],
	[ "mucolipidosis", "mucolipidoses" ],
	[ "narcoanalysis", "narcoanalyses" ],
	[ "narcosis", "narcoses" ],
	[ "naris", "nares" ],
	[ "necrobiosis", "necrobioses" ],
	[ "necrosis", "necroses" ],
	[ "neoangiogenesis", "neoangiogeneses" ],
	[ "nephrocalcinosis", "nephrocalcinoses" ],
	[ "nephrosclerosis", "nephroscleroses" ],
	[ "nephrosis", "nephroses" ],
	[ "neurapophysis", "neurapophyses" ],
	[ "neuraxis", "neuraxes" ],
	[ "neurocysticercosis", "neurocysticercoses" ],
	[ "neurofibromatosis", "neurofibromatoses" ],
	[ "neurohypophysis", "neurohypophyses" ],
	[ "neuroprosthesis", "neuroprostheses" ],
	[ "neurosis", "neuroses" ],
	[ "neurotmesis", "neurotmeses" ],
	[ "nocardiosis", "nocardioses" ],
	[ "parenthesis", "parentheses" ],
	[ "penis", "penes" ],
	[ "periegesis", "periegeses" ],
	[ "phaeohyphomycosis", "phaeohyphomycoses" ],
	[ "phagocytosis", "phagocytoses" ],
	[ "phakomatosis", "phakomatoses" ],
	[ "phasis", "phases" ],
	[ "pheresis", "phereses" ],
	[ "phimosis", "phimoses" ],
	[ "phlogosis", "phlogoses" ],
	[ "prognosis", "prognoses" ],
	[ "radiodiagnosis", "radiodiagnoses" ],
	[ "radionecrosis", "radionecroses" ],
	[ "reanalysis", "reanalyses" ],
	[ "restenosis", "restenoses" ],
	[ "resynthesis", "resyntheses" ],
	[ "reticulocytosis", "reticulocytoses" ],
	[ "reticuloendotheliosis", "reticuloendothelioses" ],
	[ "reticulohistiocytosis", "reticulohistiocytoses" ],
	[ "retinoschisis", "retinoschises" ],
	[ "rhabdomyolysis", "rhabdomyolyses" ],
	[ "spermatogenesis", "spermatogeneses" ],
	[ "sphingolipidosis", "sphingolipidoses" ],
	[ "spondylolisthesis", "spondylolistheses" ],
	[ "stenosis", "stenoses" ],
	[ "sternochondroscapularis", "sternochondroscapulares" ],
	[ "steroidogenesis", "steroidogeneses" ],
	[ "subanalysis", "subanalyses" ],
	[ "sycosis", "sycoses" ],
	[ "syllepsis", "syllepses" ],
	[ "symbiogenesis", "symbiogeneses" ],
	[ "symbiosis", "symbioses" ],
	[ "symphysis", "symphyses" ],
	[ "synaeresis", "synaereses" ],
	[ "synapophysis", "synapophyses" ],
	[ "synapsis", "synapses" ],
	[ "synaxis", "synaxes" ],
	[ "syncrisis", "syncrises" ],
	[ "synecphonesis", "synecphoneses" ],
	[ "syneresis", "synereses" ],
	[ "synizesis", "synizeses" ],
	[ "synkinesis", "synkineses" ],
	[ "synneurosis", "synneuroses" ],
	[ "synopsis", "synopses" ],
	[ "tachyphylaxis", "tachyphylaxes" ],
	[ "telangiectasis", "telangiectases" ],
	[ "telediagnosis", "telediagnoses" ],
	[ "telekinesis", "telekineses" ],
	[ "teleoanalysis", "teleoanalyses" ],
	[ "tenolysis", "tenolyses" ],
	[ "teratogenesis", "teratogeneses" ],
	[ "testis", "testes" ],
	[ "thanatopsis", "thanatopses" ],
	[ "theileriasis", "theileriases" ],
	[ "thermotaxis", "thermotaxes" ],
	[ "thesis", "theses" ],

	// Latin: ix/ex/yx/ax/ux - ices
	[ "cortex", "cortices" ],
	[ "neocortex", "neocortices" ],
	[ "pontifex", "pontifices" ],
	[ "mesovertex", "mesovertices" ],
	[ "adjutrix", "adjutrices" ],
	[ "subappendix", "subappendices" ],
	[ "calyx", "calyces" ],
	[ "protothorax", "protothoraces" ],
	[ "crux", "cruces" ],

	// Latin: inx/ynx/yx - inges/ynges/yges
	[ "archæopteryx", "archæopteryges" ],
	[ "coccyx", "coccyges" ],
	[ "electrolarynx", "electrolarynges" ],
	[ "epipharynx", "epipharynges" ],
	[ "hydrosalpinx", "hydrosalpinges" ],
	[ "hypopharynx", "hypopharynges" ],
	[ "iynx", "iynges" ],
	[ "jynx", "jynges" ],
	[ "larynx", "larynges" ],
	[ "meninx", "meninges" ],
	[ "mesosalpinx", "mesosalpinges" ],
	[ "nasopharynx", "nasopharynges" ],
	[ "oropharynx", "oropharynges" ],
	[ "pharynx", "pharynges" ],
	[ "phorminx", "phorminges" ],
	[ "pyosalpinx", "pyosalpinges" ],
	[ "salpinx", "salpinges" ],
	[ "sphinx", "sphinges" ],

	// Latin: us - i
	[ "alumnus", "alumni" ],
	[ "bacillus", "bacilli" ],
	[ "hippopotamus", "hippopotami" ],
	[ "modulus", "moduli" ],
	[ "focus", "foci" ],

	// Latin: itis - itides
	[ "adenitis", "adenitides" ],
	[ "adnexitis", "adnexitides" ],
	[ "aortitis", "aortitides" ],
	[ "appendicitis", "appendicitides" ],
	[ "arteritis", "arteritides" ],
	[ "arthritis", "arthritides" ],
	[ "bronchitis", "bronchitides" ],
	[ "bursitis", "bursitides" ],
	[ "carditis", "carditides" ],
	[ "cellulitis", "cellulitides" ],
	[ "cerebritis", "cerebritides" ],
	[ "cholangitis", "cholangitides" ],
	[ "conjunctivitis", "conjunctivitides" ],
	[ "cystitis", "cystitides" ],
	[ "dermatitis", "dermatitides" ],
	[ "dermatomyositis", "dermatomyositides" ],
	[ "encephalitis", "encephalitides" ],
	[ "encephalomyelitis", "encephalomyelitides" ],
	[ "endocarditis", "endocarditides" ],
	[ "enteritis", "enteritides" ],
	[ "epididymitis", "epididymitides" ],
	[ "esophagitis", "esophagitides" ],
	[ "folliculitis", "folliculitides" ],
	[ "gastritis", "gastritides" ],
	[ "gastroenterocolitis", "gastroenterocolitides" ],
	[ "glomerulitis", "glomerulitides" ],
	[ "glomerulonephritis", "glomerulonephritides" ],
	[ "hypophysitis", "hypophysitides" ],
	[ "iridocyclitis", "iridocyclitides" ],
	[ "iritis", "iritides" ],
	[ "keratitis", "keratitides" ],
	[ "leptomeningitis", "leptomeningitides" ],
	[ "lymphangitis", "lymphangitides" ],
	[ "mammitis", "mammitides" ],
	[ "mastitis", "mastitides" ],
	[ "mastoiditis", "mastoiditides" ],
	[ "meningitis", "meningitides" ],
	[ "meningoencephalitis", "meningoencephalitides" ],
	[ "metritis", "metritides" ],
	[ "mucositis", "mucositides" ],
	[ "myositis", "myositides" ],
	[ "nephritis", "nephritides" ],
	[ "neuritis", "neuritides" ],
	[ "oligoarthritis", "oligoarthritides" ],
	[ "orchitis", "orchitides" ],
	[ "osteitis", "osteitides" ],
	[ "osteomyelitis", "osteomyelitides" ],
	[ "otitis", "otitides" ],
	[ "panarthritis", "panarthritides" ],
	[ "pancreatitis", "pancreatitides" ],
	[ "panniculitis", "panniculitides" ],
	[ "parametritis", "parametritides" ],
	[ "parotitis", "parotitides" ],
	[ "pericarditis", "pericarditides" ],
	[ "perichondritis", "perichondritides" ],
	[ "perinephritis", "perinephritides" ],
	[ "peripancreatitis", "peripancreatitides" ],
	[ "peritonitis", "peritonitides" ],
	[ "perityphlitis", "perityphlitides" ],
	[ "pharyngitis", "pharyngitides" ],
	[ "phlebitis", "phlebitides" ],
	[ "photodermatitis", "photodermatitides" ],
	[ "pleuritis", "pleuritides" ],
	[ "pneumonitis", "pneumonitides" ],
	[ "polyarteritis", "polyarteritides" ],
	[ "polyarthritis", "polyarthritides" ],
	[ "polyradiculitis", "polyradiculitides" ],
	[ "proctitis", "proctitides" ],
	[ "prostatitis", "prostatitides" ],
	[ "pyelitis", "pyelitides" ],
	[ "pyelonephritis", "pyelonephritides" ],
	[ "radiculitis", "radiculitides" ],
	[ "rhinitis", "rhinitides" ],
	[ "rhinosinusitis", "rhinosinusitides" ],
	[ "salpingitis", "salpingitides" ],
	[ "spondylarthritis", "spondylarthritides" ],
	[ "spondylitis", "spondylitides" ],
	[ "spondyloarthritis", "spondyloarthritides" ],
	[ "stomatitis", "stomatitides" ],
	[ "synovitis", "synovitides" ],
	[ "tendinitis", "tendinitides" ],
	[ "tendonitis", "tendonitides" ],
	[ "tendovaginitis", "tendovaginitides" ],
	[ "tenosynovitis", "tenosynovitides" ],
	[ "thrombophlebitis", "thrombophlebitides" ],
	[ "tonsillitis", "tonsillitides" ],
	[ "ureteritis", "ureteritides" ],
	[ "urethritis", "urethritides" ],
	[ "urocystitis", "urocystitides" ],
	[ "uveitis", "uveitides" ],
	[ "vaginitis", "vaginitides" ],
	[ "vasculitis", "vasculitides" ],
	[ "ventriculitis", "ventriculitides" ],
	[ "vesiculitis", "vesiculitides" ],
	[ "vulvitis", "vulvitides" ],
	[ "vulvovaginitis", "vulvovaginitides" ],
];

const hispanicNounsToTest = [
	[ "buffalo", "buffalos", "buffaloes" ],
	[ "potato", "potatos", "potatoes" ],
	[ "tomato", "tomatos", "tomatoes" ],
	[ "torpedo", "torpedos", "torpedoes" ],
	[ "veto", "vetos", "vetoes" ],
	[ "mosquito", "mosquitos", "mosquitoes" ],
	[ "embargo", "embargos", "embargoes" ],
	[ "hero", "heros", "heroes" ],
	[ "avocado", "avocados", "avocadoes" ],
	[ "banjo", "banjos", "banjoes" ],
	[ "cargo", "cargos", "cargoes" ],
	[ "flamingo", "flamingos", "flamingoes" ],
	[ "fresco", "frescos", "frescoes" ],
	[ "ghetto", "ghettos", "ghettoes" ],
	[ "halo", "halos", "haloes" ],
	[ "mango", "mangos", "mangoes" ],
	[ "domino", "dominoes", "dominos" ],
	[ "memento", "mementos", "mementoes" ],
	[ "motto", "mottos", "mottoes" ],
	[ "tornado", "tornados", "tornadoes" ],
	[ "tuxedo", "tuxedos", "tuxedoes" ],
	[ "volcano", "volcanos", "volcanoes" ],
];

const possessivesToBaseToTest = [
	[ "word", "word's" ],
	[ "words", "words'" ],
	[ "words", "words's" ],
	[ "chateau", "chateau's" ],
	[ "chateaux", "chateaux's" ],
	[ "mango", "mango's" ],
	[ "mangos", "mangos's" ],
	[ "mangoes", "mangoes's" ],
	[ "Tomas", "Tomas's" ],
	[ "Tomas", "Tomas'" ],
];

const possessivesFormationToTest = [
	[ "word", "words", "word's", "words'", "words's" ],
	[ "horse", "horses", "horse's", "horses'", "horses's"  ],
	[ "chateau", "chateaux", "chateaux's", "chateau's" ],
	[ "mango", "mangos",  "mangoes", "mangoes's", "mangos's", "mango's", "mangoes'", "mangos'" ],
	[ "Tomas", "Tomas'", "Tomas's" ],
	[ "rostrum", "rostra", "rostrum's", "rostra's" ],
	[ "cortex", "cortices", "cortex's", "cortices's", "cortices'" ],
];

let receivedForms = [];

describe( "Test for getting all possible word forms for regular words", function() {
	regularNounsToTest.forEach( function( paradigm ) {
		it( "returns an array of word forms for a regular singular", function() {
			receivedForms = getNounForms( paradigm[ 0 ], nounData );

			paradigm.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a regular plural", function() {
			receivedForms = getNounForms( paradigm[ 1 ], nounData );

			paradigm.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for hispanic words", function() {
	hispanicNounsToTest.forEach( function( paradigm ) {
		it( "returns an array of word forms for a hispanic singular", function() {
			receivedForms = getNounForms( paradigm[ 0 ], nounData );

			paradigm.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a hispanic plural with -os", function() {
			receivedForms = getNounForms( paradigm[ 1 ], nounData );

			paradigm.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a hispanic plural with -oes", function() {
			receivedForms = getNounForms( paradigm[ 2 ], nounData );

			paradigm.forEach( function( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );
} );

describe( "Test for getting two types of plural word forms for hispanic words", function() {
	hispanicNounsToTest.forEach( function( paradigm ) {
		it( "returns two possible plural word forms for a hispanic singular", function() {
			receivedForms = buildTwoFormsFromRegex( paradigm[ 0 ], createRulesFromJsonArrays( regexNoun.hispanic ) );
			expect( receivedForms ).toContain( paradigm[ 1 ] );
			expect( receivedForms ).toContain( paradigm[ 2 ] );
		} );
	} );
} );

describe( "Test for not getting plural form", function() {
	it( "returns nothing for a plural form of an empty string", function() {
		receivedForms = getNounForms( "", nounData );
		expect( receivedForms ).toEqual( [ "" ] );
	} );
} );

describe( "Test for getting all possible word forms for irregular words", function() {
	irregularNounsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for an irregular word", function() {
				receivedForms = getNounForms( wordInParadigm, nounData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for a possessive", function() {
	possessivesToBaseToTest.forEach( function( paradigm ) {
		const base = paradigm[ 0 ];
		const possessive = paradigm[ 1 ];
		it( "returns if the word is a possessive", function() {
			expect( checkPossessive( base, createRulesFromJsonArrays( regexNoun.possessiveToBase ) ) || false ).toEqual( false );
			expect( checkPossessive( possessive, createRulesFromJsonArrays( regexNoun.possessiveToBase ) ) || false ).toEqual( true );
		} );
	} );
} );

describe( "Test for getting the base from a possessive", function() {
	possessivesToBaseToTest.forEach( function( paradigm ) {
		const base = paradigm[ 0 ];
		const possessive = paradigm[ 1 ];
		it( "returns the base for a possessive word", function() {
			const receivedForm = buildOneFormFromRegex( possessive, createRulesFromJsonArrays( regexNoun.possessiveToBase ) );
			expect( receivedForm ).toContain( base );
		} );
	} );
} );

describe( "Test for getting all possible word forms (including possessives)", function() {
	possessivesFormationToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a word", function() {
				receivedForms = getNounFormsWithPossessives( wordInParadigm, nounData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );
