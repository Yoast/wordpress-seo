import { singleWords as transitionWords } from "./transitionWords.js";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

const articles = [ "en", "ett", "det", "den", "de" ];

const cardinalNumerals = [ "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "tiotals", "elva", "tolv",
	"tretton", "fjorton", "femton", "sexton", "sjutton", "arton", "aderton", "nitton", "tjugo", "hundra", "hundratals",
	"tusen", "tusentals", "miljon", "miljoner", "miljontals", "miljard", "miljarder" ];

const ordinalNumerals = [ "första", "andra", "tredje", "fjärde", "femte", "sjätte", "sjunde", "åttonde", "nionde", "tionde",
	"elfte", "tolfte", "trettonde", "fjortonde", "femtonde", "sextonde", "sjuttonde", "artonde", "nittonde", "tjugonde" ];

const personalPronounsNominative = [ "jag", "du", "han", "hon", "hen", "vi", "ni" ];

const personalPronounsObjective = [ "mig", "dig", "honom", "henne", "oss", "er", "dem", "henom", "eder" ];

const reflexivePronouns = [ "sig", "sin", "sitt", "sina" ];

const possessivePronouns = [ "min", "mitt", "mina", "din", "ditt", "dina", "hans", "hennes", "dess", "ens", "vår", "vårt",
	"våra", "er", "ert", "era", "ers", "deras", "hens" ];

const demonstrativePronouns = [ "denne", "denna", "detta", "dessa", "här", "där", "varifrån", "därav", "hit", "dit", "vart",
	"hädan", "dädan", "vadan", "hän", "sen" ];

const relativePronouns = [ "som", "vilken", "vilket", "vilka", "vars", "då" ];

const interrogativePronouns = [ "vem", "vems", "vad" ];

const interrogativeProAdverbs = [ "hur", "varför" ];

const indefinitePronouns = [ "någon", "något", "några", "nån", "nåt", "ingen", "inget", "inga", "annan", "annat", "andra",
	"någonstans", "ingenstans", "annastans", "överallt", "någonstädes", "ingenstädes", "annorstädes", "allestädes",
	"någorlunda", "ingalunda", "annorlunda", "någonting", "ingenting", "allting", "all", "allt", "alla", "somlig",
	"somligt", "somliga", "mången", "månget", "man", "en", "ens" ];

const otherPronouns = [ "varandra", "varsin", "varsitt", "envar", "varannan", "vartannat" ];

const quantifiers = [ "andra", "åtskilliga", "bådadera", "både", "få", "fårre", "fåtalig", "fåtaliga", "flera", "flesta",
	"föga", "ganska", "icke", "inte", "lite", "litet", "många", "mer", "mera", "mest", "mindre", "minst", "mycket", "nog",
	"ollika", "tillräckligt", "vardera", "varje", "viss", "visst", "vissa", "visse" ];

const pronominalAdverbs = [ "bakåt", "bakifrån", "bortifrån", "däråt", "därav", "därhän", "däri", "därifrån", "därom",
	"därpå", "därtill", "däruti", "därvid", "ditåt", "dithän", "dittills", "efteråt", "förrut", "framåt", "hädenefter",
	"häråt", "härav", "härefter", "häremot", "häri", "härifrån", "härmed", "härom", "härpå", "härtill", "häruti", "härvid",
	"hitåt", "hittills", "ini", "inifrån", "intill", "inuti", "nedanför", "nedåt", "nedför", "nedtill", "uppåt", "uppför",
	"upptill", "varav", "varefter", "varemot", "varför", "varfrån", "vari", "varifrån", "varmed", "varom", "varpå",
	"varthän", "vartill", "varur", "varvid" ];

const auxiliaries = [ "behövande", "behöver", "behövt", "behövde", "bör", "börande", "borde", "bort", "brukade", "brukande",
	"brukar", "brukat", "fående", "får", "fått", "fick", "hade", "haft", "har", "hava", "havande", "kan", "kunde",
	"kunnande", "kunnat", "mådde", "mående", "mår", "måste", "mått", "måtte", "skall", "skulle", "varande", "velat",
	"viljande", "vill", "ville" ];

const auxiliariesInfinitive = [ "behöva", "böra", "bruka", "få", "ha", "kunna", "må", "ska", "vilja" ];

const copula = [ "är", "var", "varit", "vore", "blivit", "blivande", "blir", "bliver", "blev", "blitt", "funnits",
	"finnande", "finns", "fanns", "befunnit", "befinnande", "befinner", "befann", "tyckts", "tyckande", "tycks", "tycktes" ];

const copulaInfinitive = [ "vara", "bli", "finnas", "befinna", "tyckas" ];

const delexicalizedVerbs = [ "gående", "gällande", "gällde", "gäller", "gällt", "går", "gått", "gav", "ger", "gett", "gick",
	"givande", "giver", "gjorde", "gjort", "gör", "görande", "kom", "kommande", "kommer", "kommit", "ligger", "ligges", "lå",
	"ligget", "liggande", "ställer", "ställde", "ställt", "ställ", "ställande", "ställd", "ställas", "ställs", "ställes", "ställdes",
	"ställts", "tagande", "tager", "tagit", "tar", "tog", "utgör", "utgjorde", "utgjort", "utgörande", "utgjord", "utgöras",
	"utgörs", "utgöres", "utgjordes", "utgjorts" ];

const delexicalizedVerbsInfinitive = [ "gå", "gälla", "ge", "göra", "komma", "ligga", "ställa", "ta", "utgöra" ];

const interviewVerbs = [ "angav", "anger", "angett", "angiver", "angivit", "berättade", "berättar", "berättat", "föreslagit",
	"föreslår", "föreslått", "föreslog", "förklarade", "förklarar", "förklarat", "förstår", "förstått", "förstod",
	"frågade", "frågar", "frågat", "påstår", "påstått", "påstod", "sa", "sade", "säger", "sagt", "svarade", "svarar",
	"svarat", "talade", "talar", "talat", "tänker", "tänkt", "tänkte" ];

const interviewVerbsInfinitive = [ "ange", "berätta", "föreslå", "förklara", "förstå", "fråga", "påstå", "säga", "svara",
	"tala", "tänka" ];

const generalAdjectives = [ "äldre", "äldst", "äldsta", "äldste", "bäst", "bättre", "dålig", "dåliga", "dålige", "dåligt",
	"egen", "eget", "egna", "egne", "enkel", "enkelt", "enkla", "enklare", "enklast", "enklaste", "enkle", "fel", "gamla",
	"gamle", "gammal", "gammalt", "god", "goda", "godare", "godast", "godaste", "gode", "gott", "grundläggande", "hel",
	"hela", "helare", "helast", "helaste", "hele", "helt", "kort", "korta", "kortare", "kortast", "kortaste", "korte",
	"lång", "långa", "långe", "längre", "långsam", "långsamma", "långsammare", "långsammast", "långsammaste", "långsamme",
	"långsamt", "längst", "längsta", "längste", "långt", "liknande", "lilla", "lille", "liten", "litet", "mindre", "minst",
	"minsta", "minste", "möjlig", "möjliga", "möjligare", "möjligast", "möjligaste", "möjlige", "möjligt", "nödvändig",
	"nödvändiga", "nödvändigare", "nödvändigast", "nödvändigaste", "nödvändige", "nödvändigt", "normal", "normala",
	"normalare", "normalast", "normalaste", "normale", "normalt", "ny", "nya", "nyare", "nyast", "nyaste", "nye", "nytt",
	"olikt", "olika", "olike", "samma", "sämre", "sämst", "sämsta", "sämste", "särskild", "särskilda", "särskilde", "särskilt",
	"sen", "sena", "senare", "senast", "senaste", "sene", "sent", "små", "snabb", "snabba", "snabbare", "snabbast", "snabbaste",
	"snabbe", "snabbt", "stor", "stora", "store", "större", "störst", "största", "störste", "stort", "svår", "svåra", "svårare",
	"svårast", "svåraste", "svåre", "svårt", "tidig", "tidiga", "tidigare", "tidigast", "tidigaste", "tidige", "tidigt",
	"trevlig", "trevliga", "trevligare", "trevligast", "trevligaste", "trevlige", "trevligt", "ung", "unga", "unge",
	"ungt", "uppenbar", "uppenbara", "uppenbare", "uppenbart", "värre", "värst", "värsta", "värste", "verklig", "viktig",
	"viktiga", "viktigare", "viktigast", "viktigaste", "viktige", "viktigt", "yngre", "yngst", "yngsta", "yngste" ];

const generalAdverbs = [ "aldrig", "allmänt", "alltid", "delvis", "direkt", "huvudsakligen", "ibland", "långsamt",
	"mestadels", "nästan", "ofta", "relativt", "riktigt", "riktigare", "riktigast", "sällan", "snabbt", "ständigt", "väl", "vanligt" ];

const vagueNouns = [ "antal", "antalet", "antals", "antalets", "antalen", "antalens", "bit", "bitar", "bitarna", "bitarnas",
	"bitars", "biten", "bitens", "bits", "del", "delar", "delarna", "delarnas", "delars", "delen", "delens", "dels", "detalj",
	"detaljen", "detaljens", "detaljer", "detaljerna", "detaljernas", "detaljers", "detaljs", "exempel", "exempels", "exemplet",
	"exemplets", "exemplen", "exemplens", "person", "personen", "personens", "personer", "personerna", "personernas",
	"personers", "persons", "procent", "punkt", "punkten", "punktens", "punkter", "punkterna", "punkternas", "punkters",
	"sak", "saken", "sakens", "saker", "sakerna", "sakernas", "sakers", "saks", "sätt", "sätten", "sättens", "sättet",
	"sättets", "sätts", "skillnad", "skillnaden", "skillnadens", "skillnader", "skillnaderna", "skillnadernas",
	"skillnaders", "skillnads", "sort", "sorten", "sortens", "sorter", "sorterna", "sorternas", "sorters", "sorts",
	"tema", "teman", "temanas", "temans", "temas", "temat", "temats", "tid", "tiden", "tidens", "tider", "tiderna",
	"tidernas", "tiders", "tids", "ting", "tingen", "tingens", "tinget", "tingets", "tings" ];

const prepositions = [ "åt", "av", "bakom", "bland", "bortom", "bredvid", "cirka", "efter", "emellan", "emot", "enligt", "för",
	"före", "förutom", "framför", "från", "genom", "hos", "i", "igenom", "inom", "inuti", "längs", "med", "mellan", "mittemot",
	"mot", "nära", "nästa", "nedan", "ner", "olik", "om", "omkring", "ovanför", "ovanpå", "över", "på", "runt", "sedan",
	"som", "till", "tvärs", "tvärsöver", "under", "upp", "ur", "ut", "utan", "utanför", "utom", "via", "vid" ];

const intensifiers = [ "absolut", "alldeles", "allra", "bra", "fullständigt", "fullt", "ganska", "helt", "illa", "jätte",
	"rysligt", "så", "storligen", "totalt", "väldigt", "ytterst" ];

const coordinatingConjunctions = [ "eller", "och" ];

const subordinatingConjunctions = [ "att" ];

const timeWords = [ "år", "årens", "året", "årets", "års", "årtal", "årtalen", "årtalens", "årtaconst", "årtaconsts", "årtals", "dag",
	"dagar", "dagarna", "dagarnas", "dagars", "dagen", "dagens", "dags", "går", "idag", "månad", "månaden", "månadens", "månader",
	"månaderna", "månadernas", "månaders", "månads", "minut", "minuten", "minutens", "minuter", "minuterna", "minuternas",
	"minuters", "minuts", "morgon", "sekund", "sekunden", "sekundens", "sekunder", "sekunderna", "sekundernas", "sekunders",
	"sekunds", "timmar", "timmarna", "timmarnas", "timmars", "timme", "timmen", "timmens", "timmes", "vecka", "veckan",
	"veckans", "veckas", "veckor", "veckorna", "veckornas", "veckors" ];

const titles = [ "prof", "doc", "dr" ];

const interjections = [ "å", "aj", "aja", "fy", "grattis", "hej", "hu", "jaså", "javisst", "o", "oj", "ojdå", "prosit",
	"puh", "skål", "usch" ];

const recipeWords = [ "c", "cl", "cm", "dl", "g", "kg", "km", "krm", "l", "m", "mg", "ml", "mm", "msk", "pkt", "st", "tsk" ];

const miscellaneous = [ "förlåt", "ja", "jo", "ju", "m.m", "nej", "ok", "okej", "tack" ];


/**
 * Returns function words for Swedish.
 *
 * @returns {Object} Swedish function words.
 */

// These word categories are filtered at the ending of word combinations.
export const filteredAtEnding = transformWordsWithHyphens( [].concat( ordinalNumerals, generalAdjectives, generalAdverbs, auxiliariesInfinitive,
	delexicalizedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive ) );

// These word categories are filtered at the beginning and ending of word combinations.
export const filteredAtBeginningAndEnding = transformWordsWithHyphens( [].concat( articles, prepositions, coordinatingConjunctions,
	demonstrativePronouns, intensifiers, quantifiers, possessivePronouns ) );

// These word categories are filtered everywhere within word combinations.
export const filteredAnywhere = transformWordsWithHyphens( [].concat( transitionWords, personalPronounsNominative, personalPronounsObjective,
	reflexivePronouns, relativePronouns, interjections, cardinalNumerals, copula, auxiliaries, interviewVerbs,
	delexicalizedVerbs, indefinitePronouns, otherPronouns, subordinatingConjunctions,
	interrogativePronouns, interrogativeProAdverbs, miscellaneous, pronominalAdverbs,
	recipeWords, timeWords, titles, vagueNouns ) );

// This export contains all of the above words.
export const all = transformWordsWithHyphens( [].concat( articles, cardinalNumerals, ordinalNumerals, personalPronounsNominative,
	personalPronounsObjective, reflexivePronouns, possessivePronouns, demonstrativePronouns, relativePronouns, interrogativePronouns,
	interrogativeProAdverbs, indefinitePronouns, otherPronouns, quantifiers, pronominalAdverbs, auxiliaries,
	auxiliariesInfinitive, copula, copulaInfinitive, delexicalizedVerbs, delexicalizedVerbsInfinitive, interviewVerbs,
	interviewVerbsInfinitive, generalAdjectives, generalAdverbs, vagueNouns, prepositions, intensifiers,
	coordinatingConjunctions, subordinatingConjunctions, timeWords, titles, interjections, recipeWords, miscellaneous ) );

export default {
	filteredAtEnding,
	filteredAtBeginningAndEnding,
	filteredAnywhere,
	all,
};
