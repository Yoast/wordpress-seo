import transitionWordsFactory from "./transitionWords.js";

const transitionWords = transitionWordsFactory().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher.
 *
 * @returns {Array} The array filled with exceptions.
 */

const articles = [ "o", "a", "os", "as", "um", "uns", "uma", "umas" ];

// "um" is already included in the articles.
const cardinalNumerals = [
	"uma", "duas", "dois", "três", "cuatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze",
	"treze", "quatorze", "catorze", "quinze", "dezesseis", "dezessete", "dezasseis", "dezassete", "dezoito", "dezenove", "dezanove",
	"vinte", "cem", "cento", "mil", "milhão", "milhões", "bilhão", "bilhões",
];

const ordinalNumerals = [
	"primeiro", "primeiros", "primeira", "primeiras", "segundo", "segunda", "segundos", "segundas", "terceiro",
	"terceira", "terceiros", "terceiras", "quarto", "quartos", "quarta", "quartas", "quinto", "quintos", "quinta", "quintas",
	"sexto", "sextos", "sexta", "sextas", "sétimo", "sétimos", "sétima", "sétimas", "oitavo", "oitavos", "oitava", "oitavas",
	"nono", "nonos", "nona", "nonas", "décimo", "décimos", "décima", "décimas", "vigésimo", "vigésimos", "vigésima", "vigésimas",
];

const personalPronounsNominative = [ "eu", "tu", "ele", "ela", "nós", "vós", "você", "vocês", "eles", "elas" ];

// "o", "a", "os", "as" are already included in the articles.
const personalPronounsAccusative = [ "me", "te", "lhe", "nos", "vos", "lhes" ];

const personalPronounsPrepositional = [ "dele", "dela", "deles", "delas", "nele", "nela", "neles", "nelas", "mim", "ti", "si" ];

const personalPronounsComitative = [ "conmigo", "contigo", "consigo", "convosco", "conosco", "connosco" ];

const reflexivePronouns = [ "se" ];

const demonstrativePronouns = [
	"aquilo", "àquele", "àquela", "àqueles", "àquelas", "àquilo", "este", "estes", "esta", "estas",
	"àqueles", "aqueles", "aquele", "aquela", "aquelas", "aquilo", "esse", "esses", "essa", "essas", "isto", "isso",
];

const possessivePronouns = [
	"minhas", "tuas", "suas", "minha", "tua", "sua", "minhas", "tuas", "suas", "vossa", "vossas", "meu",
	"meus", "teu", "teus", "seu", "seus", "nosso", "nossos", "nossa", "nossas",
];

const quantifiers = [
	"apenas", "vário", "vários", "vária", "várias", "mais", "muito", "muitos", "muita", "muitas", "puoco", "puocos", "puoca",
	"puocas", "bastante", "todo", "todos", "toda", "todas",
];

const indefinitePronouns = [
	"alguma", "algumas", "nenhuns", "nenhumas", "todo", "toda", "todas", "outro", "outra", "outros", "outras",
	"qualquer", "quaisquer", "outrem", "tudo", "nada", "algo", "tanto", "tanta", "tantos", "tantas", "quanto", "quanta", "quantos",
	"quantas", "ninguém", "cada",
];

const interrogativePronouns = [ "quais", "qual", "quem", "cujo", "cuja", "cujos", "cujas" ];

const interrogativeProAdverbs = [ "como", "porque", "quanto", "quanta", "onde", "quando", "quão", "quantos", "quantas", "donde", "aonde", "que" ];

const locativeAdverbs = [ "cá", "além", "aqui", "ali", "lá", "acolá", "aí" ];

const otherAuxiliaries = [
	"tenho", "tens", "tem", "temos", "tendes", "têm", "tive", "tiveste", "teve", "tivemos", "tivestes", "tiveram",
	"tínhamos", "tínheis", "tinham", "tivera", "tiveras", "tivéramos", "tivéreis", "tiveram", "terei", "terás", "terá", "teremos",
	"tereis", "terão", "teria", "terias", "teríamos", "teríeis", "teriam", "tenha", "tenhas", "tenhamos", "tenhais", "tenham", "tivesse",
	"tivesses", "tivéssemos", "tivésseis", "tivessem", "tiver", "tiveres", "tivermos", "tiverdes", "tiverem", "tende", "teres", "termos",
	"terdes", "terem", "tido", "hei", "hás", "há", "havemos", "hemos", "haveis", "heis", "hão", "houve", "houveste", "houvemos", "houvestes",
	"houveram", "havia", "havias", "havíamos", "havíeis", "haviam", "houvera", "houveras", "houvéramos", "houvéreis", "houveram", "haverei",
	"haverás", "haverá", "haveremos", "havereis", "haverão", "haveria", "haverias", "haveríamos", "haveríeis", "haveriam", "haja", "hajas",
	"hajamos", "hajais", "hajam", "houvesse", "houvesses", "houvéssemos", "houvésseis", "houvessem", "houver", "houveres", "houvermos",
	"houverdes", "houverem", "havei", "hajais", "haveres", "havermos", "haverdes", "haverem", "havido", "poder", "posso", "podes", "pode",
	"podemos", "podeis", "podem", "pude", "pudeste", "pôde", "pudemos", "pudestes", "puderam", "podia", "podias", "podia", "podíamos", "podíeis",
	"podiam", "pudera", "puderas", "pudéramos", "pudéreis", "puderam", "poderei", "poderás", "poderá", "poderemos", "podereis", "poderão",
	"poderia", "poderias", "poderíamos", "poderíeis", "poderiam", "possa", "possas", "possamos", "possais", "possam", "pudesse", "pudesses",
	"pudéssemos", "pudésseis", "pudessem", "puder", "puderes", "pudermos", "puderdes", "puderem",
];

const otherAuxiliariesInfinitive = [ "ter", "haver" ];

const copula = [
	"sou", "és", "é", "somos", "sois", "são", "fui", "foste", "foi", "fomos", "fostes", "foram", "era", "eras", "éramos", "éreis", "eram",
	"fôramos", "fôreis", "fora", "foras", "foram", "serei", "serás", "será", "seremos", "sereis", "serão", "seria", "serias", "seríamos",
	"seríeis", "seriam", "seja", "sejas", "seja", "sejamos", "sejais", "sejam", "fosse", "fosses", "fôssemos", "fôsseis", "fossem", "for",
	"fores", "formos", "fordes", "forem", "sê", "sede", "sermos", "serdes", "serem", "seres", "sido", "estou", "está", "estamos", "estás",
	"estás", "estais", "estão", "estive", "estiveste", "esteve", "estivemos", "estivestes", "estiveram", "estava", "estavas", "estávamos",
	"estáveis", "estavam", "estivera", "estiveras", "estivéramos", "estivéreis", "estiveram", "estarei", "estarás", "estará", "estaremos",
	"estareis", "estarão", "estaria", "estarias", "estaríamos", "estaríeis", "estariam", "esteja", "estejas", "estejamos", "estejais",
	"estejam", "estivesse", "estivesses", "estivéssemos", "estivésseis", "estivessem", "estiver", "estiveres", "estivermos", "estiverdes",
	"estiverem", "estai", "estejas", "estejais", "estares", "estarmos", "estardes", "estarem", "estado",
];

const copulaInfinitive = [ "estar", "ser" ];

const prepositions = [
	"a", "ante", "antes", "após", "até", "através", "com", "contra", "depois", "desde", "sem", "entre", "para", "pra",
	"perante", "sob", "sobre", "trás", "de",
	"por", "em", "ao", "à", "aos", "às", "do", "da", "dos", "das", "dum", "duma", "duns", "dumas", "no", "na", "nos", "nas", "num", "numa",
	"nuns", "numas", "pelo", "pela", "pelos", "pelas", "deste", "desse", "daquele", "desta", "dessa", "daquela", "destes", "desses",
	"daqueles", "destas", "dessas", "daquelas", "neste", "nesse", "naquele", "nesta", "nessa", "naquela", "nestes", "nesses", "naqueles",
	"nestas", "nessas", "naquelas", "disto", "disso", "daquilo", "nisto", "nisso", "naquilo", "durante",
];

const coordinatingConjunctions = [ "também", "e", "ou", "nem" ];

const subordinatingConjunctions = [
	"agora", "conforme", "conquanto", "contanto", "embora", "enquanto", "então", "entretanto", "malgrado",
	"mas", "pois", "porém", "porquanto", "porque", "senão", "contudo",
];

// These verbs are frequently used in interviews to indicate questions and answers.
const interviewVerbs = [
	"diz", "dizem", "disse", "disseram", "dizia", "diziam", "reivindica", "reivindicam", "reivindicou", "reivindicaram",
	"reivindicava", "reivindicavam", "requer", "requerem", "requereu", "requereram", "requeria", "requeriam", "afirma", "afirmam",
	"afirmou", "afirmaram", "afirmava", "afirmavam", "reivindica", "reivindicam", "reivindicou", "reivindicaram", "reivindicava",
	"reivindicavam", "perguntam", "perguntou", "perguntaram", "perguntava", "perguntavam", "explica", "explicam", "explicou", "explicaram",
	"explicava", "explicavam", "relata", "relatam", "relatou", "relataram",
];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [
	"provavelmente", "imediatamente", "ocasionalmente", "indubitavelmente", "para", "possivelmente",
	"logo", "simultaneamente", "exceto", "inquestionavelmente",
];

const intensifiers = [
	"extremamente", "bem", "completamente", "totalmente", "grandemente", "seriamente", "absolutamente", "bastante",
	"sobremodo", "sobremaneira", "tão",
];

// These verbs convey little meaning.
const delexicalizedVerbs = [
	"dou", "dás", "dá", "damos", "dais", "dão", "dei", "deu", "demos", "deram", "dava", "davas", "dávamos", "dáveis",
	"davam", "dera", "deras", "déramos", "déreis", "deram", "darei", "darás", "dará", "daremos", "dareis", "darão", "daria", "darias",
	"daríamos", "daríeis", "dariam", "dê", "dês", "dêmos", "deis", "deem", "déssemos", "désseis", "dessem", "der", "deres", "dermos", "derdes",
	"derem", "dai", "deis", "dares", "darmos", "dardes", "darem", "fazendo", "faço", "fazes", "faz", "fazemos", "fazeis", "fazem", "fiz",
	"fizeste", "fez", "fizemos", "fizestes", "fizeram", "fazia", "fazias", "fazíamos", "fazíeis", "faziam", "fizera", "fizeras", "fizéramos",
	"fizéreis", "farei", "farás", "fará", "faremos", "fareis", "faria", "farias", "faríamos", "faríeis", "fariam", "faça", "faças", "façamos",
	"façais", "façam", "fizesse", "fizesses", "fizéssemos", "fizésseis", "fizessem", "fizer", "fizeres", "fizermos", "fizerdes", "fizerem",
	"fazei", "fazeres", "fazermos", "fazerdes", "fazerem",
];

const delexicalizedVerbsInfinitive = [ "dar", "fazer" ];

/*
 * These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 * Keyword combinations containing these adjectives/adverbs are fine.
 */
const generalAdjectivesAdverbs = [
	"devagar", "rapidamente", "grande", "grandes", "depressa", "claramente", "effectivamente", "realmente",
	"exclusivamente", "simplesemente", "somente", "unicamente", "lentamente", "raramente", "certamente", "talvez", "actualmente", "dificilmente",
	"principalmente", "gerlamente", "enorme", "enormes", "pequeno", "pequena", "pequenos", "pequenas", "minúsculo", "minúsculos", "minúscula",
	"minúsculas", "velho", "velhos", "velha", "velhas", "lindo", "linda", "lindos", "lindas", "alto", "alta", "altos", "altas", "baixo", "baixa",
	"baixos", "baixas", "longo", "longa", "longos", "longas", "curto", "curta", "curtos", "curtas", "fácil", "fáceis", "difícil", "difíceis",
	"simples", "mesmo", "mesma", "mesmos", "mesmas", "mêsmo", "mêsmos", "mêsma", "mêsmas", "cedo", "tarde", "importante", "importantes", "capaz",
	"capazes", "certo", "certa", "certos", "certas", "usual", "usuals", "ultimamente", "possível", "possíveis", "comum", "comuns", "freqüentemente",
	"constantemente", "continuamente", "diretamente", "levemente", "algures", "semelhante", "semelhantes", "similar", "similares", "sempre", "ainda",
	"já", "atrás", "depois",
];

// "grande", "velho" and "pequeno" can appear both before and after nouns and are therefore on both lists.
const generalAdjectivesPreceding = [
	"pior", "melhor", "melhores", "bom", "boa", "bons", "boas", "bonito", "bonita", "bonitos", "bonitas", "grande",
	"grandes", "pequeno", "pequena", "pequenos", "pequenas", "velho", "velhos", "velha", "velhas", "mau", "má", "maus", "más",
];

const interjections = [ "ai", "ah", "ih", "alô", "oi", "olá", "ui", "uf", "psiu", "mau", "olha", "viva", "uau", "wow", "oh", "shi" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ "kg", "mg", "gr", "g", "km", "m", "l", "ml", "cl" ];

// "segundo" is already included in cardinal numbers.
const timeWords = [
	"segundos", "minuto", "minutos", "hora", "horas", "dia", "dias", "semana", "semanas", "mes", "meses", "ano", "anos", "hoje",
	"amanhã", "ontem",
];

const vagueNouns = [
	"caso", "casos", "coisa", "coisas", "detalhe", "detalhes", "forma", "formas", "jeito", "jeitos",
	"maneira", "maneiras", "modo", "modos", "suijeto", "sujeitos", "tópico", "tópicos", "vez", "vezes",
];

const miscellaneous = [ "sim", "não", "ok", "amém", "etc", "euro", "euros", "adeus", "jeitos" ];

const titles = [ "sr", "sra", "sras", "dr", "dra", "prof" ];

/**
 * Returns the Portuguese function words.
 *
 * @returns {Object} Portuguese function words.
 */
export default function() {
	return {
		// These word categories are filtered at the beginning of word combinations.
		filteredAtBeginning: generalAdjectivesAdverbs,

		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, otherAuxiliariesInfinitive, copulaInfinitive, delexicalizedVerbsInfinitive,
			generalAdjectivesPreceding ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers,
			quantifiers, possessivePronouns ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, cardinalNumerals, personalPronounsNominative, personalPronounsAccusative,
			personalPronounsPrepositional, personalPronounsComitative, reflexivePronouns, indefinitePronouns, interrogativePronouns,
			interrogativeProAdverbs, locativeAdverbs, otherAuxiliaries, copula, subordinatingConjunctions, interviewVerbs, additionalTransitionWords,
			delexicalizedVerbs, interjections, recipeWords, timeWords, vagueNouns, miscellaneous, titles ),

		// These word categories cannot directly precede a passive participle.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, personalPronounsAccusative, possessivePronouns,
			indefinitePronouns, interrogativeProAdverbs, cardinalNumerals, ordinalNumerals, delexicalizedVerbs, delexicalizedVerbsInfinitive,
			interviewVerbs ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, personalPronounsNominative, personalPronounsAccusative,
			personalPronounsPrepositional, personalPronounsComitative, reflexivePronouns, demonstrativePronouns, possessivePronouns, quantifiers,
			indefinitePronouns, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive,
			copula, copulaInfinitive, prepositions, coordinatingConjunctions, subordinatingConjunctions, interviewVerbs, additionalTransitionWords,
			intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, generalAdjectivesAdverbs, generalAdjectivesPreceding, interjections,
			recipeWords, timeWords, vagueNouns, miscellaneous, titles ),
	};
}
