let filteredPassiveAuxiliaries = require( "./passivevoice/auxiliaries.js" )().filteredAuxiliaries;
let notFilteredPassiveAuxiliaries = require( "./passivevoice/auxiliaries.js" )().notFilteredAuxiliaries;
let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */

let articles = [ "el", "la", "los", "las" ];

let numerals = [ "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
	"catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte", "primero", "segundo", "tercero",
	"cuarto", "quinto", "sexto", "septimo", "octavo", "noveno", "décimo", "primero", "segundo", "tercero", "cuarto", "quinto",
	"sexto", "septimo", "octavo", "noveno", "vigésimo", "cien", "centena", "mil", "millon", "millones" ];

let personalPronounsNominative = [ "yo", "tú", "él", "ella", "ello", "nosotros", "nosotras", "vosotros", "vosotras",
	"ustedes", "ellos", "ellas" ];

let personalPronounsAccusative = [ "me", "te", "lo", "la", "se", "nos", "os", "los", "las", "les" ];

let personalPronounsGenitive = [ "mío", "míos", "mía", "mías", "tuyo", "tuyos", "tuya", "tuyas", "suyo", "suyos", "suya",
	"suyas", "nuestros", "nuestro", "nuestra", "nuestras", "vuestros", "vuestro", "vuestra", "vuestras", "suyo", "suyos",
	"suya", "suyas" ];

let personalPronounsPrepositional = [ "mí", "ti", "ud", "uds", "usted", "sí", "nosotros", "nosotras", "vosotros", "vosotras" ];

let personalPronounsComitative = [ "conmigo", "contigo", "consigo" ];

let demonstrativePronouns = [ "este", "ese", "aquel", "esta", "esa", "aquella", "estos", "esos", "aquellos", "estas",
	"esas", "aquellas" ];

let possessivePronouns = [ "mío", "míos", "mía", "mías", "nuestro", "nuestros", "nuestra", "nuestras", "tuyo", "tuyos", "tuya",
	"tuyas", "vuestro", "vuestros", "vuestra", "vuestras", "suyo", "suyos", "suya", "suyas", "suyo", "suyos", "suya", "suyas" ];

let quantifiers = [ "bastante", "bastantes", "mucho", "muchas", "mucha", "muchos", "demasiado", "demasiada", "demasiados", "demasiadas",
	"poco", "poca", "pocos", "pocas", "demás", "otros", "otras", "muy", "todo", "toda", "todos", "todas", "demasiado", "demasiados",
	"demasiada", "demasiadas" ];

let reflexivePronouns = [ "os" ];

let indefinitePronouns = [ "una", "alguien", "algo", "algún", "alguno", "alguna", "algunos", "algunas", "nadie", "nada", "ningún",
	"ninguno", "ninguna", "ningunos", "ningunas", "tanto", "tantos", "tanta", "tantas" ];

let interrogativeDeterminers = [ "que", "cuyas", "donde", "cual" ];

let interrogativePronouns = [ "cuyo" ];

/*
'Qué' is part of 'por qué' ('why'). The combination 'quien sea' ('whoever') is separated into two entries: 'quien' and 'sea'.
'quira' is part of 'cuando quiera' ('whenever').
 */
let interrogativeProAdverbs = [ "quién", "quiénes", "qué", "cuál", "cuáles", "cuánto", "cuántos", "cuánta", "cuántas", "dónde", "cómo",
	"qué", "cuando", "dondequiera", "quien", "sea", "quiera", "comoquiera", "quienquiera", "cualquier", "cuantos", "cuanto", "cualesquiera" ];

let locativeAdverbs = [ "hay", "allí", "ahí", "allá", "aquí", "acá", "adónde", "delante", "detrás", "encima", "debajo", "dentro",
	"fuera", "adelante", "atrás", "arriba", "arriba", "abajo", "adentro", "afuera" ];

let otherAuxiliaries = [ "he", "has", "ha", "hay", "hemos", "habéis", "han", "hube", "hubiste", "hubo", "hubimos", "hubisteis",
	"hubieron", "había", "habías", "habíamos", "habíais", "habían", "habría", "habrías", "habríais", "habrían", "habré", "habrás", "habrá",
	"habremos", "habréis", "habrán", "haya", "hayas", "hayamos", "hayáis", "hayan", "hubiera", "hubieras", "hubiéramos", "hubierais",
	"hubieran", "hubiese", "hubieses", "hubiésemos", "hubieseis", "hubiesen", "hubiere", "hubieres", "hubiéremos", "hubiereis", "hubieren",
	"habed", "habido", "debo", "debes", "debe", "debemos", "debéis", "deben", "debí", "debiste", "debió", "debimos", "debisteis", "debieron",
	"debía", "debías", "debíamos", "debíais", "debían", "debería", "deberías", "deberíamos", "deberíais", "deberían", "deberé", "deberás",
	"deberá", "deberemos", "deberéis", "deberán", "deba", "debas", "debamos", "debáis", "deban", "debiera", "debieras", "debiéramos",
	"debierais", "debieran", "debiese", "debieses", "debiésemos", "debieseis", "debiesen", "debiere", "debieres", "debiéremos", "debiereis",
	"debieren", "debed", "debido", "empiezo", "empiezas", "empieza", "empezáis", "empiezan", "empecé", "empezaste", "empezó",
	"empezamos", "empezasteis", "empezaron", "empezaba", "empezabas", "empezábamos", "empezabais", "empezaban", "empezaría", "empezarías",
	"empezaríamos", "empezaríais", "empezarían", "empezaré", "empezarás", "empezará", "empezaremos", "empezaréis", "empezarán", "empiece",
	"empieces", "empecemos", "empecéis", "empiecen", "empezara", "empezaras", "empezáramos", "empezarais", "empezaran", "empezase",
	"empezases", "empezásemos", "empezaseis", "empezasen", "empezare", "empezares", "empezáremos", "empezareis", "empezaren",
	"empezad", "empezado", "comienzo", "comienzas", "comienza", "comenzamos", "comenzáis", "comienzan", "comencé", "comenzaste", "comenzó",
	"comenzasteis", "comenzaron", "comenzaba", "comenzabas", "comenzábamos", "comenzabais", "comenzaban", "comenzaría",
	"comenzarías", "comenzaríamos", "comenzaríais", "comenzarían", "comenzaré", "comenzarás", "comenzará", "comenzaremos", "comenzaréis",
	"comenzarán", "comience", "comiences", "comencemos", "comencéis", "comiencen", "comenzara", "comenzaras", "comenzáramos", "comenzarais",
	"comenzaran", "comenzase", "comenzases", "comenzásemos", "comenzaseis", "comenzasen", "comenzare", "comenzares", "comenzáremos",
	"comenzareis", "comenzaren", "comenzad", "comenzado", "sigo", "sigues", "sigue", "seguimos", "seguis", "siguen", "seguí",
	"seguiste", "siguió", "seguisteis", "siguieron", "seguía", "seguías", "seguíamos", "seguíais", "seguían", "seguiría",
	"seguirías", "seguiríamos", "seguiríais", "seguirían", "seguiré", "seguirás", "seguirá", "seguiremos", "seguiréis",
	"seguirán", "siga", "sigas", "sigamos", "sigáis", "sigan", "siguiera", "siguieras", "siguiéramos", "siguierais", "siguieran",
	"siguiese", "siguieses", "siguiésemos", "siguieseis", "siguiesen", "siguiere", "siguieres", "siguiéremos", "siguiereis", "siguieren",
	"seguid", "seguido", "tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen", "tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis",
	"tuvieron", "tenía", "tenías", "teníamos", "teníais", "tenían", "tendría", "tendrías", "tendríamos", "tendríais", "tendrían", "tendré",
	"tendrás", "tendrá", "tendremos", "tendréis", "tendrán", "tenga", "tengas", "tengamos", "tengáis", "tengan", "tuviera", "tuvieras",
	"tuviéramos", "tuvierais", "tuvieran", "tuviese", "tuvieses", "tuviésemos", "tuvieseis", "tuviesen", "tuviere", "tuvieres",
	"tuviéremos", "tuviereis", "tuvieren", "ten", "tened", "tenido", "ando", "andas", "andamos", "andáis", "andan", "anduve", "anduviste",
	"anduvo", "anduvimos", "anduvisteis", "anduvieron", "andaba", "andabas", "andábamos", "andabais", "andaban", "andaría", "andarías",
	"andaríamos", "andaríais", "andarían", "andaré", "andarás", "andará", "andaremos", "andaréis", "andarán", "ande", "andes", "andemos",
	"andéis", "anden", "anduviera", "anduvieras", "anduviéramos", "anduvierais", "anduvieran", "anduviese", "anduvieses", "anduviésemos",
	"anduvieseis", "anduviesen", "anduviere", "anduvieres", "anduviéremos", "anduviereis", "anduvieren", "andad", "andado", "quedo", "quedas",
	"queda", "quedamos", "quedáis", "quedan", "quedé", "quedasteis", "quedaron", "quedaba", "quedabas", "quedábamos", "quedabais",
	"quedaban", "quedaría", "quedarías", "quedaríamos", "quedaríais", "quedarían", "quedaré", "quedarás", "quedará", "quedaremos", "quedaréis",
	"quedarán", "quede", "quedes", "quedemos", "quedéis", "queden", "quedara", "quedaras", "quedáramos", "quedarais", "quedaran", "quedase",
	"quedases", "quedásemos", "quedaseis", "quedasen", "quedare", "quedares", "quedáremos", "quedareis", "quedaren", "quedad", "quedado",
	"hallo", "hallas", "halla", "hallamos", "halláis", "hallan", "hallé", "hallaste", "halló", "hallasteis", "hallaron", "hallaba", "hallabas",
	"hallábamos", "hallabais", "hallaban", "hallaría", "hallarías", "hallaríamos", "hallaríais", "hallarían", "hallaré", "hallarás", "hallará",
	"hallaremos", "hallaréis", "hallarán", "halle", "halles", "hallemos", "halléis", "hallen", "hallara", "hallaras", "halláramos", "hallarais",
	"hallaran", "hallase", "hallases", "hallásemos", "hallaseis", "hallasen", "hallare", "hallares", "halláremos", "hallareis", "hallaren",
	"hallad", "hallado", "vengo", "vienes", "viene", "venimos", "venis", "vienen", "vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron",
	"venía", "vanías", "verníamos", "veníais", "venían", "vendría", "vendrías", "vendríamos", "vendíais", "vendrían", "vendré", "vendrás",
	"vendrá", "vendremos", "vendréis", "vendrán", "venga", "vengas", "vengamos", "vengáis", "vengan", "viniera", "vinieras", "viniéramos",
	"vinierais", "vinieran", "viniese", "vinieses", "viniésemos", "vinieseis", "viniesen", "viniere", "vinieres", "viniéremos", "viniereis",
	"vinieren", "ven", "venid", "venido", "abro", "abres", "abre", "abrismos", "abrís", "abren", "abrí", "abriste", "abrió", "abristeis",
	"abrieron", "abría", "abrías", "abríais", "abrían", "abriría", "abrirías", "abriríamos", "abriríais", "abrirían", "abriré", "abrirás",
	"abrirá", "abriremos", "abriréis", "abrirán", "abra", "abras", "abramos", "abráis", "abran", "abriera", "abrieras", "abriéramos", "abrierais",
	"abrieran", "abriese", "abrieses", "abriésemos", "abrieseis", "abriesen", "abriere", "abrieres", "abriéremos", "abriereis", "abrieren",
	"abrid", "abierto", "voy", "vas", "va", "vamos", "vais", "van", "fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron", "iba",
	"ibas", "íbamos", "ibais", "iban", "iría", "irías", "iríamos", "iríais", "irían", "iré", "irás", "irá", "iremos", "iréis", "irán", "vaya",
	"vayas", "vayamos", "vayáis", "vayan", "fuera", "fueras", "fuéramos", "fuerais", "fueran", "fuese", "fueses", "fuésemos", "fueseis", "fuesen",
	"fuere", "fueres", "fuéremos", "fuereis", "fueren", "ve", "id", "ido", "acabo", "acabas", "acaba", "acabamos", "acabáis", "acaban",
	"acabé", "acabaste", "acabó", "acabasteis", "acabaron", "acababa", "acababas", "acabábamos", "acababais", "acababan", "acabaría",
	"acabarías", "acabaríamos", "acabaríais", "acabarían", "acabaré", "acabarás", "acabará", "acabaremos", "acabaréis", "acabarán", "acabe",
	"acabes", "acabemos", "acabéis", "acaben", "acabara", "acabaras", "acabáramos", "acabarais", "acabaran", "acabase", "acabases", "acabásemos",
	"acabaseis", "acabasen", "acabare", "acabares", "acabáremos", "acabareis", "acabaren", "acabad", "acabado", "llevo", "llevas", "lleva",
	"llevamos", "lleváis", "llevan", "llevé", "llevaste", "llevó", "llevasteis", "llevaron", "llevaba", "llevabas", "llevábamos",
	"llevabais", "llevaban", "llevaría", "llevarías", "llevaríamos", "llevaríais", "llevarían", "llevaré", "llevarás", "llevará", "llevaremos",
	"llevaréis", "llevarán", "lleve", "lleves", "llevemos", "llevéis", "lleven", "llevara", "llevaras", "lleváramos", "llevarais", "llevaran",
	"llevase", "llevases", "llevásemos", "llevaseis", "llevasen", "llevare", "llevares", "lleváremos", "llevareis", "llevaren", "llevad",
	"llevado", "alcanzo", "alcanzas", "alcanza", "alcanzamos", "alcanzáis", "alcanzan", "alcancé", "alcanzaste", "alcanzó",
	"alcanzasteis", "alcanzaron", "alcanzaba", "alcanzabas", "alcanzábamos", "alcanzabais", "alcanzaban", "alcanzaría", "alcanzarías",
	"alcanzaríamos", "alcanzaríais", "alcanzarían", "alcanzaré", "alcanzarás", "alcanzará", "alcanzaremos", "alcanzaréis", "alcanzarán",
	"alcance", "alcances", "alcancemos", "alcancéis", "alcancen", "alcanzara", "alcanzaras", "alcanzáramos", "alcanzarais", "alcanzaran",
	"alcanzase", "alcanzases", "alcanzásemos", "alcanzaseis", "alcanzasen", "alcanzare", "alcanzares", "alcanzáremos", "alcanzareis",
	"alcanzaren", "alcanzad", "alcanzado", "digo", "dices", "dice", "decimos", "decís", "dicen", "dije", "dijiste", "dijo", "dijimos",
	"dijisteis", "dijeron", "decía", "decías", "decíamos", "decíais", "decían", "diría", "dirías", "diríamos", "diríais", "dirían", "diré",
	"dirás", "dirá", "diremos", "diréis", "dirán", "diga", "digas", "digamos", "digáis", "digan", "dijera", "dijeras", "dijéramos", "dijerais",
	"dijeran", "dijese", "dijeses", "dijésemos", "dijeseis", "dijesen", "dijere", "dijeres", "dijéremos", "dijereis", "dijeren", "di", "decid",
	"dicho", "continúo", "continúas", "continúa", "continuamos", "continuáis", "continúan", "continué", "continuaste",
	"continuó", "continuasteis", "continuaron", "continuaba", "continuabas", "continuábamos", "continuabais", "continuaban",
	"continuaría", "continuarías", "continuaríamos", "continuaríais", "continuarían", "continuaré", "continuarás", "continuará", "continuaremos",
	"continuaréis", "continuarán", "continúe", "continúes", "continuemos", "continuéis", "continúen", "continuara", "continuaras",
	"continuáramos", "continuarais", "continuaran", "continuase", "continuases", "continuásemos", "continuaseis", "continuasen", "continuare",
	"continuares", "continuáremos", "continuareis", "continuaren", "continuad", "continuado", "resulto", "resultas", "resulta", "resultamos",
	"resultáis", "resultan", "resulté", "resultaste", "resultó", "resultasteis", "resultaron", "resultaba", "resultabas",
	"resultábamos", "resultabais", "resultaban", "resultaría", "resultarías", "resultaríamos", "resultaríais", "resultarían", "resultaré",
	"resultarás", "resultará", "resultaremos", "resultaréis", "resultarán", "resulte", "resultes", "resultemos", "resultéis", "resulten",
	"resultara", "resultaras", "resultáramos", "resultarais", "resultaran", "resultase", "resultases", "resultásemos", "resultaseis",
	"resultasen", "resultare", "resultares", "resultáremos", "resultareis", "resultaren", "resultad", "resultado", "puedo", "puedes",
	"puede", "podemos", "podéis", "pueden", "pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron", "podía", "podías", "podíamos",
	"podíais", "podían", "podría", "podrías", "podríamos", "podríais", "podrían", "podré", "podrás", "podrá", "podremos", "podréis", "podrán",
	"pueda", "puedas", "podamos", "podáis", "puedan", "pudiera", "pudieras", "pudiéramos", "pudierais", "pudieran", "pudiese", "pudieses",
	"pudiésemos", "pudieseis", "pudiesen", "pudiere", "pudieres", "pudiéremos", "pudiereis", "pudieren", "poded", "podido", "quiero",
	"quieres", "quiere", "queremos", "queréis", "quieren", "quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron", "quería",
	"querías", "queríamos", "queríais", "querían", "querría", "querrías", "querríamos", "querríais", "querrían", "querré", "querrás", "querrá",
	"querremos", "querréis", "querrán", "quiera", "quieras", "queramos", "queráis", "quieran", "quisiera", "quisieras", "quisiéramos",
	"quisierais", "quisieran", "quisiese", "quisieses", "quisiésemos", "quisieseis", "quisiesen", "quisiere", "quisieres", "quisiéremos",
	"quisiereis", "quisieren", "quered", "querido", "sé", "sabes", "sabe", "sabemos", "sabéis", "saben", "supe", "supiste", "supo",
	"supimos", "supisteis", "supieron", "sabía", "sabías", "sabíamos", "sabíais", "sabían", "sabría", "sabrías", "sabríamos", "sabríais",
	"sabrían", "sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán", "sepa", "sepas", "sepamos", "sepáis", "sepan", "supiera", "supieras",
	"supiéramos", "supierais", "supieran", "supiese", "supieses", "supiésemos", "supieseis", "supiesen", "supiere", "supieres", "supiéremos",
	"supiereis", "supieren", "sabed", "sabido", "suelo", "sueles", "suele", "solemos", "soléis", "suelen", "solí", "soliste", "solió", "solimos",
	"solisteis", "solieron", "solía", "solías", "solíamos", "solíais", "solían", "solería", "solerías", "soleríamos", "soleríais", "solerían",
	"soleré", "solerás", "solerá", "soleremos", "soleréis", "solerán", "suela", "suelas", "solamos", "soláis", "suelan", "soliera", "solieras",
	"soliéramos", "solierais", "solieran", "soliese", "solieses", "soliésemos", "solieseis", "soliesen", "soliere", "solieres", "soliéremos",
	"soliereis", "solieren", "soled", "solido", "necesito", "necesitas", "necesitamos", "necesitáis", "necesitan", "necesité",
	"necesitaste", "necesitó", "necesitasteis", "necesitaron", "necesitaba", "necesitabas", "necesitábamos", "necesitabais",
	"necesitaban", "necesitaría", "necesitarías", "necesitaríamos", "necesitaríais", "necesitarían", "necesitaré", "necesitarás", "necesitará",
	"necesitaremos", "necesitaréis", "necesitarán", "necesite", "necesites", "necesitemos", "necesitéis", "necesiten", "necesitara",
	"necesitaras", "necesitáramos", "necesitarais", "necesitaran", "necesitase", "necesitases", "necesitásemos", "necesitaseis", "necesitasen",
	"necesitare", "necesitares", "necesitáremos", "necesitareis", "necesitaren", "necesita", "necesitad", "necesitado" ];

let copula = [ "estoy", "estás", "está", "estamos", "estáis", "están", "estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis",
	"estuvieron", "estuba", "estabas", "estábamos", "estabais", "estaban", "estraría", "estarías", "estaríamos", "estaríais", "estarían",
	"estaré", "estarás", "estará", "estaremos", "estaréis", "estarán", "esté", "estés", "estemos", "estéis", "estén", "estuviera",
	"estuviese", "estuvieras", "estuviéramos", "estuvierais", "estuvieran", "estuvieses", "estuviésemos", "estuvieseis", "estuviesen",
	"estuviere", "estuvieres", "estuviéremos", "estuviereis", "estuvieren", "estad", "estado", "soy", "eres", "es", "somos", "sois", "son",
	"fui", "fuiste", "fuimos", "fuisteis", "fueron", "era", "eras", "éramos", "erais", "eran", "sería", "serías", "seríamos", "seríais",
	"serían", "seré", "serás", "seremos", "seréis", "serán", "sea", "seas", "seamos", "seáis", "sean", "fuera", "fueras", "fuéramos",
	"fuerais", "fueran", "fuese", "fueses", "fuésemos", "fueseis", "fuesen", "fuere", "fueres", "fuéremos", "fuereis", "fueren", "sé",
	"sed", "sido" ];

let prepositions = [ "a", "ante", "abajo", "adonde", "al", "allende", "alrededor", "amén", "ante", "antes", "arriba", "aun",
	"bajo", "cabe", "cabo", "como", "con", "conmigo", "consigo", "contigo", "contra", "cuando", "de", "dejante", "del",
	"dentro", "desde", "donde", "durante", "en", "encima", "entre", "excepto", "fuera", "hacia", "hasta", "incluso",
	"mediante", "menos", "más", "opuesto", "par", "para", "pero", "por", "próximo", "que", "salvo", "según", "sin",	"so",
	"sobre", "tras", "versus", "vía" ];

let prepositionalAdverbs = [ "cerca", "lejos", "arriba", "abajo", "debajo", "delante", "detrás" ];

let coordinatingConjunctions = [ "pero", "o", "y", "entonces", "pues", "e", "u", "sino", "ni", "bien", "sea", "ya",
	"ora", "estos", "aquellos", "así", "luego", "mas", "aunque" ];

/*
'Tanto' and 'como' together form 'tanto...como'. 'Ni' is part of 'ni...ni'. 'Bien' is part of 'bien...bien'.
 'Ora' is part of 'ora...ora'. 'Ya' is part of 'ya...ya'. 'Igual' is part of 'igual...que'. 'Menos' is part of 'menos...que'.
 */
let correlativeConjunctions = [ "tanto", "como", "ni", "ora", "ya", "igual", "menos" ];

let subordinatingConjunctions = [ "apenas", "aun", "conque", "como", "cuando", "mientras", "porque", "segun", "según", "si", "tan", "tal" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
let interviewVerbs = [ "say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating",
	"explain", "explains", "explained", "think", "thinks" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [ "siempre", "nunca", "ahora", "obviamente", "apenas", "quizá", "acaso", "inclusive", "probablemente",
	"seguramente", "jamás",
	"and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively",
	"expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays",
	"ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe",
	"probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply",
	"optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally",
	"elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently" ];

let intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
let delexicalisedVerbs = [ "seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes",
	"made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets",
	"setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant",
	"called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
let generalAdjectivesAdverbs = [ "ayer", "hoy", "mañana", "enfrente", "mal", "mejor", "peor", "más", "menos", "claro",
	"bueno",
	"new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best",
	"big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest",
	"least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher",
	"highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest",
	"short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual",
	"so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly",
	"continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar",
	"widely", "bad", "worse", "worst", "great" ];

let interjections = [ "oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha",
	"yikes" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl",
	"l", "mg", "g", "kg", "quart" ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
let vagueNouns = [ "thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times",
	"part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "idea", "theme",
	"person" ];

// 'No' is already included in the quantifier list.
let miscellaneous = [ "sí", "no", "%" ];

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, possessivePronouns, personalPronounsGenitive,
			personalPronounsPrepositional, personalPronounsComitative ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions ),
		verbs: filteredPassiveAuxiliaries.concat( notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs ),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat( interrogativePronouns, interrogativeProAdverbs ),
		passiveAuxiliaries: filteredPassiveAuxiliaries,
		transitionWords: transitionWords.concat( additionalTransitionWords ),
		miscellaneous: miscellaneous,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative,
			personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers, interrogativePronouns,
			interrogativeProAdverbs, locativeAdverbs, prepositionalAdverbs,
			filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, prepositions,
			coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords,
			additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous ),
	};
};
