const transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */


const cardinalNumerals = [ "czterech", "czterem", "czterema", "czternaście", "czternastce", "czternastek", "czternastka",
	"czternastką", "czternastkach", "czternastkami", "czternastkę", "czternastki", "czternastko", "czternastkom",
	"czternastoma", "czternastu", "cztery", "czwórce", "czwórek", "czwórka", "czwórką", "czwórkach", "czwórkami", "czwórkę",
	"czwórki", "czwórko", "czwórkom", "czworo", "dwa", "dwadzieścia", "dwanaście", "dwie", "dwiema", "dwóch", "dwójce",
	"dwoje", "dwójek", "dwójka", "dwójką", "dwójkach", "dwójkami", "dwójki", "dwójko", "dwójkom", "dwóm", "dwoma",
	"dwudziestce", "dwudziestek", "dwudziestka", "dwudziestką", "dwudziestkach", "dwudziestkami", "dwudziestkę",
	"dwudziestki", "dwudziestkom", "dwudziestoma", "dwudziestu", "dwunastce", "dwunastek", "dwunastka", "dwunastką",
	"dwunastkach", "dwunastkami", "dwunastkę", "dwunastki", "dwunastko", "dwunastkom", "dwunastoma", "dwunastu",
	"dziesiątce", "dziesiątek", "dziesiątka", "dziesiątką", "dziesiątkach", "dziesiątkami", "dziesiątkę", "dziesiątki",
	"dziesiątko", "dziesiątkom", "dziesięć", "dziesięcioma", "dziesięciu", "dziewiątce", "dziewiątek", "dziewiątka",
	"dziewiątką", "dziewiątkach", "dziewiątkami", "dziewiątkę", "dziewiątki", "dziewiątko", "dziewiątkom", "dziewięć",
	"dziewięcioma", "dziewięciorga", "dziewięciorgiem", "dziewięciorgu", "dziewięcioro", "dziewięciu", "dziewiętnaście",
	"dziewiętnastce", "dziewiętnastek", "dziewiętnastka", "dziewiętnastką", "dziewiętnastkach", "dziewiętnastkami",
	"dziewiętnastkę", "dziewiętnastki", "dziewiętnastkom", "dziewiętnastoma", "dziewiętnastu", "jeden", "jedenaście",
	"jedenastce", "jedenastek", "jedenastka", "jedenastką", "jedenastkach", "jedenastkami", "jedenastkę", "jedenastki",
	"jedenastko", "jedenastkom", "jedenastoma", "jedenastu", "jedna", "jedną", "jednego", "jednej", "jednemu", "jedno",
	"jednym", "jedynce", "jedynek", "jedynka", "jedynką", "jedynkach", "jedynkami", "jedynkę", "jedynki", "jedynko",
	"jedynkom", "miliard", "miliarda", "miliardach", "miliardami", "miliardem", "miliardom", "miliardów", "miliardowi",
	"miliardy", "miliardzie", "milion", "miliona", "milionach", "milionami", "milionem", "milionie", "milionom",
	"milionów", "milionowi", "miliony", "ósemce", "ósemek", "ósemka", "ósemką", "ósemkach", "ósemkami", "ósemkę", "ósemki",
	"ósemko", "ósemkom", "osiem", "osiemnaście", "osiemnastce", "osiemnastek", "osiemnastka", "osiemnastką", "osiemnastkach",
	"osiemnastkam", "osiemnastkę", "osiemnastki", "osiemnastko", "osiemnastkom", "osiemnastoma", "osiemnastu", "ośmioma",
	"ośmiorga", "ośmiorgiem", "ośmiorgu", "ośmioro", "ośmiu", "piątce", "piątek", "piątka", "piątką", "piątkach", "piątkami",
	"piątkę", "piątki", "piątko", "piątkom", "pięć", "pięcioma", "pięciorga", "pięciorgiem", "pięciorgu", "pięcioro",
	"pięciu", "piętnaście", "piętnastce", "piętnastek", "piętnastka", "piętnastką", "piętnastkach", "piętnastkami",
	"piętnastkę", "piętnastki", "piętnastko", "piętnastkom", "piętnastoma", "piętnastu", "raz", "setce", "setek", "setka",
	"setkach", "setkami", "setkę", "setki", "setkom", "siedem", "siedemnaście", "siedemnastce", "siedemnastek",
	"siedemnastka", "siedemnastką", "siedemnastkach", "siedemnastkami", "siedemnastkę", "siedemnastki", "siedemnastko",
	"siedemnastkom", "siedemnastoma", "siedemnastu", "siedmioma", "siedmiorga", "siedmiorgiem", "siedmiorgu", "siedmioro",
	"siedmiu", "siódemce", "siódemek", "siódemka", "siódemką", "siódemkach", "siódemkami", "siódemkę", "siódemki",
	"siódemko", "siódemkom", "sto", "stoma", "stu", "sześć", "sześcioma", "sześciorga", "sześciorgiem", "sześciorgu",
	"sześcioro", "sześciu", "szesnaście", "szesnastce", "szesnastek", "szesnastka", "szesnastką", "szesnastkach",
	"szesnastkami", "szesnastkę", "szesnastki", "szesnastko", "szesnastkom", "szesnastoma", "szesnastu", "szóstce",
	"szóstek", "szóstka", "szóstką", "szóstkach", "szóstkami", "szóstkę", "szóstki", "szóstko", "szóstkom", "trójce",
	"troje", "trójek", "trójka", "trójką", "trójkach", "trójkami", "trójki", "trójko", "trójkom", "trzech", "trzem",
	"trzema", "trzy", "trzynaście", "trzynastce", "trzynastek", "trzynastka", "trzynastką", "trzynastkach", "trzynastkami",
	"trzynastkę", "trzynastki", "trzynastko", "trzynastkom", "trzynastoma", "trzynastu", "tysiąc", "tysiąca", "tysiącach",
	"tysiącami", "tysiące", "tysiącem", "tysiącom", "tysiącowi", "tysiącu", "tysięcy" ];

const ordinalNumerals = [ "czternaści", "czternasta", "czternastą", "czternaste", "czternastego", "czternastej", "czternastemu",
	"czternasty", "czternastych", "czternastym", "czternastymi", "czwarci", "czwarta", "czwartą", "czwarte", "czwartego",
	"czwartej", "czwartemu", "czwarty", "czwartych", "czwartym", "czwartymi", "drudzy", "druga", "drugą", "drugi", "drugich",
	"drugie", "drugiego", "drugiej", "drugiemu", "drugim", "drugimi", "dwudzieści", "dwudziesta", "dwudziestą",
	"dwudzieste", "dwudziestego", "dwudziestej", "dwudziestemu", "dwudziesty", "dwudziestych", "dwudziestym",
	"dwudziestymi", "dwunaści", "dwunasta", "dwunastą", "dwunaste", "dwunastego", "dwunastej", "dwunastemu", "dwunasty",
	"dwunastych", "dwunastym", "dwunastymi", "dziesiąci", "dziesiąta", "dziesiątą", "dziesiąte", "dziesiątego",
	"dziesiątej", "dziesiątemu", "dziesiąty", "dziesiątych", "dziesiątym", "dziesiątymi", "dziewiąci", "dziewiąta",
	"dziewiątą", "dziewiąte", "dziewiątego", "dziewiątej", "dziewiątemu", "dziewiąty", "dziewiątych", "dziewiątym",
	"dziewiątymi", "dziewiętnaści", "dziewiętnasta", "dziewiętnastą", "dziewiętnaste", "dziewiętnastego", "dziewiętnastej",
	"dziewiętnastemu", "dziewiętnasty", "dziewiętnastych", "dziewiętnastym", "dziewiętnastymi", "jedenaści", "jedenasta",
	"jedenastą", "jedenaste", "jedenastego", "jedenastej", "jedenastemu", "jedenasty", "jedenastych", "jedenastym",
	"jedenastymi", "osiemnaści", "osiemnasta", "osiemnastą", "osiemnaste", "osiemnastego", "osiemnastej", "osiemnastemu",
	"osiemnasty", "osiemnastych", "osiemnastym", "osiemnastymi", "ósma", "ósmą", "ósme", "ósmego", "ósmej", "ósmemu",
	"óśmi", "ósmy", "ósmych", "ósmym", "ósmymi", "piąci", "piąta", "piątą", "piąte", "piątego", "piątej", "piątemu",
	"piąty", "piątych", "piątym", "piątymi", "pierwsi", "pierwsza", "pierwszą", "pierwsze", "pierwszego", "pierwszej",
	"pierwszemu", "pierwszy", "pierwszych", "pierwszym", "pierwszymi", "piętnaści", "piętnasta", "piętnastą", "piętnaste",
	"piętnastego", "piętnastej", "piętnastemu", "piętnasty", "piętnastych", "piętnastym", "piętnastymi", "siedemnaści",
	"siedemnasta", "siedemnastą", "siedemnaste", "siedemnastego", "siedemnastej", "siedemnastemu", "siedemnasty",
	"siedemnastych", "siedemnastym", "siedemnastymi", "siódma", "siódmą", "siódme", "siódmego", "siódmej", "siódmemu",
	"siódmi", "siódmy", "siódmych", "siódmym", "siódmymi", "szesnaści", "szesnasta", "szesnastą", "szesnaste", "szesnastego",
	"szesnastej", "szesnastemu", "szesnasty", "szesnastych", "szesnastymi", "szóści", "szósta", "szóstą", "szóste",
	"szóstego", "szóstej", "szóstemu", "szósty", "szóstych", "szóstym", "szóstymi", "trzeci", "trzecia", "trzecią",
	"trzecich", "trzecie", "trzeciego", "trzeciej", "trzeciemu", "trzecim", "trzecimi", "trzynaści", "trzynasta",
	"trzynastą", "trzynaste", "trzynastego", "trzynastej", "trzynastemu", "trzynasty", "trzynastych", "trzynastym",
	"trzynastymi" ];

const personalPronounsNominative = [ "ja", "my", "on", "ona", "one", "oni", "ono", "ty", "wy" ];

const personalPronounsAccusative = [ "cię", "ciebie", "go", "ich", "ją", "je", "jego", "mnie", "nas", "nią", "nich", "nie",
	"niego", "was" ];

const personalPronounsGenitive = [ "jej", "niej" ];

const personalPronounsDative = [ "mi", "ci", "im", "jemu", "mu", "nam", "niemu", "nim", "tobie", "wam" ];

const personalPronounsInstrumental = [ "mną", "nami", "nią", "nim", "nimi", "tobą", "wami" ];

const personalPronounsPast = [ "myśmy", "wyście", "żeście", "żeśmy" ];

const personalPronounsPrepositional = [ "doń", "nań", "zeń" ];

const possessivePronouns = [ "ich", "jego", "jej", "ma", "mą", "me", "mego", "mej", "memu", "moi", "moich", "moim",
	"moimi", "mój", "moja", "moją", "moje", "mojego", "mojej", "mojemu", "mych", "mym", "mymi", "nasi", "nasz",
	"nasza", "naszą", "nasze", "naszego", "naszej", "naszemu", "naszych", "naszym", "naszymi", "swa", "swą", "swe",
	"swego", "swej", "swemu", "swoi", "swoich", "swoim", "swoimi", "swój", "swoja", "swoją", "swoje", "swojego", "swojej",
	"swojemu", "swych", "swym", "swymi", "twa", "twą", "twe", "twego", "twej", "twemu", "twoi", "twoich", "twoim",
	"twoimi", "twój", "twoja", "twoją", "twoje", "twojego", "twojej", "twojemu", "twych", "twym", "twymi", "wasi",
	"wasz", "wasza", "waszą", "wasze", "waszego", "waszej", "waszemu", "waszych", "waszym", "waszymi" ];

const reflexivePronounsNominative = [ "się" ];

const reflexivePronounsOther = [ "siebie", "sobą" ];

const interrogativePronouns = [ "czyi", "czyich", "czyim", "czyimi", "czyj", "czyja", "czyją", "czyje", "czyjego", "czyjej",
	"czyjemu", "kim", "kogo", "komu", "kto" ];

const interrogativeProAdverbs = [ "czy", "czyś", "czyśbyś", "dlaczego", "dokąd", "dokądże", "dokądżeś", "gdzie", "gdzież",
	"gdzieżeś", "ile", "ileż", "jak", "jakbyś", "jakże", "jakżebyś", "jakżeś", "kiedy", "którędy", "którędyż", "skąd",
	"skądże", "skądżeś" ];

const interrogativeDeterminers = [ "co", "czego", "czemu", "czym", "jacy", "jaka", "jaką", "jaki", "jakich", "jakie",
	"jakiego", "jakiej", "jakiemu", "jakim", "jakimi", "która", "którą", "które", "którego", "której", "któremu",
	"który", "których", "którym", "którymi", "którzy" ];

const indefinitePronouns = [ "coś", "czegoś", "czemuś", "czyichkolwiek", "czyichś", "czyikolwiek", "czyimikolwiek",
	"czyimiś", "czyimkolwiek", "czyimkolwiem", "czyimś", "czyiś", "czyjakolwiek", "czyjąkolwiek", "czyjaś", "czyjąś",
	"czyjegokolwiek", "czyjegoś", "czyjejkolwiek", "czyjejś", "czyjekolwiek", "czyjemukolwiek", "czyjemuś", "czyjeś",
	"czyjkolwiek", "czymś", "dlaczegoś", "dokądkolwiek", "dokądś", "gdziekolwiek", "gdzieś", "ilekolwiek", "ileś",
	"jacykolwiek", "jacyś", "jakakolwiek", "jakąkolwiek", "jakaś", "jakąś", "jakichkolwiek", "jakichś", "jakiegokolwiek",
	"jakiegoś", "jakiejkolwiek", "jakiejś", "jakiekolwiek", "jakiemukolwiek", "jakiemuś", "jakieś", "jakikolwiek",
	"jakimikolwiek", "jakimkolwiek", "jakimś", "jakiś", "jakkolwiek", "jakoś", "każda", "każdą", "każde", "każdego",
	"każdej", "każdemu", "każdy", "każdym", "kiedykolwiek", "kiedyś", "kimkolwiek", "kimś", "kogokolwiek", "kogoś",
	"komukolwiek", "komuś", "ktokolwiek", "którakolwiek", "którąkolwiek", "któraś", "którąś", "którędykolwiek", "którędyś",
	"któregokolwiek", "któregoś", "którejkolwiek", "którejś", "którekolwiek", "któremukolwiek", "któremuś", "któreś",
	"którychkolwiek", "którychś", "którykolwiek", "którymikolwiek", "którymiś", "którymkolwiek", "którymś", "któryś",
	"którzykolwiek", "którzyś", "ktoś", "nawzajem", "nic", "niczego", "niczemu", "niczyi", "niczyich", "niczyim",
	"niczyimi", "niczyj", "niczyja", "niczyją", "niczyjego", "niczyjej", "niczyjemu", "niczym", "nikim", "nikogo",
	"nikogokolwiek", "nikomu", "nikt", "skądkolwiek", "skądś", "wszyscy", "wszyskiego", "wszystkich", "wszystkie",
	"wszystkiemu", "wszystkim", "wszystkimi", "wszystko", "żaden", "żadna", "żadną", "żadne", "żadnego", "żadnej",
	"żadnemu", "żadni", "żadnych", "żadnym", "żadnymi" ];

const demonstrativePronouns = [ "ci", "dlatego", "ów", "owa", "ową", "owe", "owego", "owej", "owemu", "owi", "owo", "owych",
	"owym", "stąd", "stamtąd", "ta", "tacy", "tak", "taka", "taką", "taki", "takich", "takie", "takiego", "takiej",
	"takiemu", "takim", "takimi", "tam", "tamci", "tamta", "tamtą", "tamte", "tamtego", "tamtej", "tamtemu", "tamten",
	"tamto", "tamtych", "tamtym", "tamtymi", "tą", "te", "tę", "tędy", "tego", "tegoż", "tej", "temu", "ten", "to", "tu", "tutaj",
	"tych", "tyle", "tyloma", "tylu", "tym", "tymi", "wtedy" ];

const quantifiers = [ "ciut", "część", "części", "częścią", "częściach", "częściami", "częściom", "dość", "dosyć", "dużo",
	"kilka", "kilkadziesiąt", "kilkanaście", "kilkaset", "kilknasty", "kilkoma", "kilku", "kilkudziesiąte",
	"kilkudziesiątego", "kilkudziesiątej", "kilkudziesiąty", "kilkudziesiątych", "kilkudziesiątym", "kilkudziesiątymi",
	"kilkudziesięcioma", "kilkudziesięciu", "kilkunasta", "kilkunastą", "kilkunaste", "kilkunastego", "kilkunastej",
	"kilkunastemu", "kilkunastoma", "kilkunastu", "kilkunastym", "kilkuset", "kilkustoma", "kiludziesiąta", "mało",
	"malutko", "mniej", "mnóstwa", "mnóstwem", "mnóstwie", "mnóstwo", "mnóstwu", "multum", "nadto", "najmniej",
	"najwięcej", "nieco", "niedużo", "niejednokroć", "niektóre", "niektórzy", "niektórych", "niektórym", "niektórymi",
	"niemało", "niewiele", "niewieloma", "niewielu", "oba", "obaj",
	"obie", "oboje", "obojga", "obojgiem", "obojgu", "obóm", "oboma", "obu", "obydwa", "obydwaj", "obydwie", "obydwiema",
	"obydwóch", "obydwoje", "obydwojgiem", "obydwojgu", "obydwóm", "obydwoma", "obydwu", "odrobiną", "odrobince",
	"odrobinę", "odrobinie", "odrobinką", "odrobinkę", "odrobinki", "odrobiny", "parę", "parędziesiąt", "parędziesięcioma",
	"parędziesięciu", "paręnaście", "paręnastoma", "paręnastu", "parokroć", "paroma", "paru", "parze", "pełno", "pół",
	"półczwarta", "połowa", "połową", "połowie", "połowy", "półtora", "półtorej", "sporo", "trochę", "trochu",
	"troszeczkę", "troszkę", "wcale", "więcej", "większość", "większości", "większością", "większościach", "większościami",
	"większościom", "wiele", "wielokrotnie", "wieloma", "wielu" ];

const adverbialGenitives = [ "czasem", "często", "nigdy", "rzadko", "zawsze" ];

const otherAuxiliaries = [ "chcą", "chcąc",
	"chcąca", "chcące", "chcący", "chce", "chcę", "chcecie", "chcemy", "chcesz", "chciał", "chciała", "chciałaby",
	"chciałabym", "chciałabyś", "chciałam", "chciałaś", "chciałby", "chciałbym", "chciałbyś", "chciałem", "chciałeś",
	"chciały", "chciałyby", "chciałybyście", "chciałybyśmy", "chciałyście", "chciałyśmy", "chcieli", "chcieliby",
	"chcielibyście", "chcieliście", "chcieliśmy", "chcono", "ma",
	"macie", "mają", "mając", "mam", "mamy", "masz", "miał", "miała", "miałaby", "miałabym", "miałabyś", "miałam",
	"miałaś", "miałby", "miałbym", "miałbyś", "miałem", "miałeś", "miało", "miałoby", "miały", "miałyby", "miałybyście",
	"miałybyśmy", "miałyście", "miałyśmy", "miano", "miej", "miejąca", "miejące", "miejący", "miejcie", "miejmy",
	"mieli", "mieliby", "mielibyście", "mielibyśmy", "mieliście", "mieliśmy", "mogą", "mogąc", "mogąca", "mogące",
	"mogący", "mogę", "mógł", "mogła", "mogłaby", "mogłabym", "mogłabyś", "mogłam", "mogłaś", "mógłby", "mógłbym",
	"mógłbyś", "mogłem", "mogłeś", "mogli", "mogliby", "moglibyście", "moglibyśmy", "mogliście", "mogliśmy", "mogły",
	"mogłyby", "mogłybyście", "mogłybyśmy", "mogłyście", "mogłyśmy", "może", "możecie", "możemy", "możesz", "można",
	"możnaby", "musi", "musiał", "musiała", "musiałaby", "musiałabym", "musiałabyś", "musiałam", "musiałaś", "musiałby",
	"musiałbym", "musiałbyś", "musiałem", "musiałeś", "musiało", "musiałoby", "musiały", "musiałyby", "musiałybyście",
	"musiałybyśmy", "musiałyście", "musiałyśmy", "musiano", "musicie", "musieli", "musieliby", "musielibyście",
	"musielibyśmy", "musieliście", "musieliśmy", "musimy", "musisz", "muszą", "musząc", "musząca", "muszące", "muszący",
	"muszę", "należy", "niech", "potrafi", "potrafią", "potrafiąc", "potrafiąca", "potrafiące", "potrafiący",
	"potraficie", "potrafię", "potrafiłaby", "potrafiłabym", "potrafiłabyś", "potrafiłam", "potrafiłaś", "potrafiłbym",
	"potrafiłbyś", "potrafiłem", "potrafiłeś", "potrafili", "potrafiliby", "potrafilibyście", "potrafilibyśmy",
	"potrafiliście", "potrafiliśmy", "potrafiło", "potrafiłoby", "potrafiłyby", "potrafiłybyście", "potrafiłybyśmy",
	"potrafiłyście", "potrafiłyśmy", "potrafimy", "potrafiono", "potrafisz", "powinien", "powinienem", "powinieneś",
	"powinna", "powinnam", "powinnaś", "powinne", "powinni", "powinniście", "powinniśmy", "powinnyście", "powinnyśmy",
	"pozostaje", "stają", "stając", "stająca", "stające", "stający", "staje", "staję", "stajecie",
	"stajemy", "stajesz", "stał", "stała", "stałaby", "stałabym", "stałabyś", "stałam", "stałaś", "stałby", "stałbym",
	"stałbyś", "stałem", "stałeś", "stali", "staliby", "stalibyście", "stalibyśmy", "staliście", "staliśmy", "stało",
	"stały", "stałyby", "stałybyście", "stałybyśmy", "stałyście", "stałyśmy", "stanie", "stano", "stawać", "stawając",
	"stawająca", "stawające", "stawający", "stawał", "stawała", "stawałaby", "stawałabym", "stawałabyś", "stawałabyście",
	"stawałam", "stawałaś", "stawałby", "stawałbym", "stawałbyś", "stawałem", "stawałeś", "stawali", "stawaliby",
	"stawalibyście", "stawalibyśmy", "stawaliście", "stawaliśmy", "stawały", "stawałyby", "stawałybyśmy", "stawałyście",
	"stawałyśmy", "stawano", "stawawszy", "stawszy", "trzeba", "warto", "wystarczy" ];

const passiveAuxiliaries = [ "bądź", "bądźcie", "bądźmy", "będą", "będąc", "będę", "będzie", "będziecie", "będziemy", "będziesz",
	"by", "był", "była", "byłaby", "byłabym", "byłabyś", "byłam", "byłaś", "byłby", "byłbym", "byłbyś", "byłem",
	"byłeś", "byli", "byliby", "bylibyście", "bylibyśmy", "byliście", "byliśmy", "było", "byłoby", "były", "byłyby",
	"byłybyście", "byłybyśmy", "byłyście", "byłyśmy", "bym", "byś", "byście", "byśmy", "byto", "bywało", "jest", "jestem",
	"jesteś", "jesteście", "jesteśmy", "są", "zostają", "zostając", "zostająca",
	"zostające", "zostający", "zostaje", "zostaję", "zostajecie", "zostajemy", "zostajesz", "został", "została",
	"zostałaby", "zostałabym", "zostałabyś", "zostałam", "zostałaś", "zostałby", "zostałbym", "zostałbyś", "zostałem",
	"zostałeś", "zostali", "zostaliby", "zostalibyście", "zostalibyśmy", "zostaliście", "zostaliśmy", "zostało",
	"zostaloby", "zostały", "zostałyby", "zostałybyście", "zostałybyśmy", "zostałyście", "zostałyśmy", "zostań", "zostaną",
	"zostańcie", "zostanę", "zostanie", "zostaniecie", "zostaniemy", "zostaniesz", "zostańmy", "zostawało", "zostawano",
	"zostawszy" ];

const passiveAuxiliariesInfinitive = [ "być", "zostać" ];

const otherAuxiliariesInfinitive = [ "chcieć", "mieć", "móc", "musieć", "potrafić", "stać" ];


const prepositions = [ "bez", "beze", "blisko", "daleko", "dla", "do", "dole", "dookoła", "górze", "jako", "koło", "ku",
	"między", "mimo", "na", "nad", "nade", "naokoło", "naprzeciwko", "niedaleko", "nieopodal", "niż", "o", "obok", "od", "ode",
	"około", "oprócz", "po", "pod", "podczas", "pode", "pomiędzy", "ponad", "poniżej", "poprzek", "poprzez", "pośród",
	"powyżej", "poza", "przeciw", "przeciwko", "przed", "przede", "przez", "przeze", "przy", "spodem", "spośród", "spoza", "u", "w",
	"wbrew", "we", "wedle", "wewnątrz", "wpół", "wraz", "wśród", "wzdłuż", "z", "za", "ze", "zza" ];

const prepositionalAdverbs = [ "bliska", "daleka", "przodu", "tyłu" ];

const coordinatingConjunctions = [ "albo", "ani", "bądź", "i", "lub", "oraz", "tylko" ];

const subordinatingConjunctions = [ "aż", "by", "czy", "gdyby", "jak", "jeśli", "jeżeli", "że" ];

// Ciągu is part of 'w ciągu' (during)
const additionalTransitionWords = [ "ano", "ciągu", "coraz", "dzięki", "chyba", "jakby", "jednocześnie", "jeszcze", "już",
	"nadal", "nagle", "znowu", "prawdopodobnie",
	"niestety", "dziś", "dzisiaj", "oczywiście", "względem", "m.in.", "właśnie", "zaraz" ];

const delexicalizedVerbs = [ "bierz", "bierzcie", "bierzecie", "bierzemy", "bierzesz", "bierzmy", "biorą", "biorąc",
	"biorąca", "biorące", "biorący", "biorę", "brał", "brała", "brałaby", "brałabym", "brałabyś", "brałam",
	"brałaś", "brałby", "brałbym", "brałbyś", "brałem", "brałeś", "brali", "braliby", "bralibyście", "bralibyśmy",
	"braliście", "braliśmy", "brało", "brałoby", "brały", "brałyby", "brałybyście", "brałybyśmy", "brałyście", "brałyśmy",
	"brany", "da", "dacie", "dadzą", "daj", "dają", "dając", "dająca", "dające", "dający", "dajcie", "daje",
	"daję", "dajecie", "dajemy", "dajesz", "dajmy", "dał", "dała", "dałaby", "dałabym", "dałabyś", "dałam", "dałaś",
	"dałby", "dałbym", "dałbyś", "dałem", "dałeś", "dali", "daliby", "dalibyście", "dalibyśmy", "daliście", "daliśmy",
	"dało", "dałoby", "dały", "dałyby", "dałybyście", "dałybyśmy", "dałyście", "dałyśmy", "dam", "damy", "dana", "dano",
	"dany", "dasz", "dawaj", "dawajcie", "dawajmy", "dawał", "dawała", "dawałaby", "dawałabym", "dawałabyś",
	"dawałam", "dawałaś", "dawałby", "dawałbym", "dawałbyś", "dawałem", "dawałeś", "dawali", "dawaliby", "dawalibyście",
	"dawalibyśmy", "dawaliście", "dawaliśmy", "dawało", "dawały", "dawałyby", "dawałybyście", "dawałybyśmy", "dawałyście",
	"dawałyśmy", "dawana", "dawane", "dawano", "dawany", "idą", "idąc", "idąca", "idące", "idący", "idę", "idź", "idźcie",
	"idzie", "idziecie", "idziemy", "idziesz", "idźmy", "rób", "róbcie", "robi", "robią", "robiąc", "robiąca",
	"robiące", "robiący", "robicie", "robię", "robił", "robiła", "robiłaby", "robiłabym", "robiłabyś", "robiłam",
	"robiłaś", "robiłby", "robiłbym", "robiłbyś", "robiłem", "robiłeś", "robili", "robilibiście", "robiliby", "robilibyśmy",
	"robiliście", "robiliśmy", "robiło", "robiły", "robiłyby", "robiłybyście", "robiłybyśmy", "robiłyście", "robiłyśmy",
	"robimy", "robiono", "robiony", "robisz", "róbmy", "stanowi", "stanowią", "stanowiły", "stanowili", "stoi", "stoicie",
	"stoimy", "stoisz", "stój", "stoją", "stojąc",
	"stojąca", "stojące", "stojący", "stójcie", "stoję", "stójmy", "świadczy", "szedł", "szedłby", "szedłbym", "szedłbyś",
	"szedłem", "szedłeś", "szła", "szłaby", "szłabym", "szłabyś", "szłam", "szłaś", "szli", "szliby", "szlibyście",
	"szlibyśmy", "szliście", "szliśmy", "szło", "szłoby", "szły", "szłyby", "szłybyście", "szłybyśmy", "szłyście",
	"uprawia", "uprawiacie", "uprawiają", "uprawiając", "uprawiająca", "uprawiające", "uprawiający",
	"uprawiał", "uprawiała", "uprawiałaby", "uprawiałabym", "uprawiałabyś", "uprawiałam", "uprawiałaś", "uprawiałby",
	"uprawiałbym", "uprawiałbyś", "uprawiałem", "uprawiałeś", "uprawiali", "uprawialiby", "uprawialibyście",
	"uprawialibyśmy", "uprawialiście", "uprawialiśmy", "uprawiało", "uprawiałoby", "uprawiały", "uprawiałyby",
	"uprawiałybyście", "uprawiałybyśmy", "uprawiałyście", "uprawiałyśmy", "uprawiam", "uprawiamy", "uprawiana",
	"uprawiane", "uprawiano", "uprawiany", "uprawiasz", "weź", "weźcie", "wezmą", "wezmę", "weźmie", "weźmiecie",
	"weźmiemy", "weźmiesz", "weźmy", "wykonuj", "wykonują", "wykonując", "wykonująca", "wykonujące", "wykonujący",
	"wykonujcie", "wykonuje", "wykonuję", "wykonujecie", "wykonujemy", "wykonujesz", "wykonujmy",
	"wykonywał", "wykonywała", "wykonywałaby", "wykonywałabym", "wykonywałabyś", "wykonywałam", "wykonywałaś",
	"wykonywałby", "wykonywałbym", "wykonywałbyś", "wykonywałem", "wykonywałeś", "wykonywali", "wykonywaliby",
	"wykonywalibyście", "wykonywalibyśmy", "wykonywaliście", "wykonywaliśmy", "wykonywało", "wykonywałoby", "wykonywały",
	"wykonywałyby", "wykonywałybyście", "wykonywałybyśmy", "wykonywałyście", "wykonywałyśmy", "wykonywana", "wykonywane",
	"wykonywany", "wziął", "wziąłby", "wziąłbym", "wziąłbyś", "wziąłem", "wziąłeś", "wziąwszy", "wzięła",
	"wzięłaby", "wzięłabym", "wzięłabyś", "wzięłam", "wzięłaś", "wzięli", "wzięliby", "wzięlibyście", "wzięlibyśmy",
	"wzięliście", "wzięliśmy", "wzięło", "wzięłoby", "wzięły", "wzięłyby", "wzięłybyście", "wzięłybyśmy", "wzięłyście",
	"wzięłyśmy", "zrób", "zróbcie", "zrobi", "zrobią", "zrobiąc", "zrobiąca", "zrobiące", "zrobiący", "zrobicie",
	"zrobię", "zrobił", "zrobiła", "zrobiłaby", "zrobiłabym", "zrobiłabyś", "zrobiłam", "zrobiłaś", "zrobiłby",
	"zrobiłbym", "zrobiłbyś", "zrobiłem", "zrobiłeś", "zrobili", "zrobilibiście", "zrobiliby", "zrobilibyśmy",
	"zrobiliście", "zrobiliśmy", "zrobiło", "zrobiły", "zrobiłyby", "zrobiłybyście", "zrobiłybyśmy", "zrobiłyście",
	"zrobiłyśmy", "zrobimy", "zrobiono", "zrobiony", "zrobisz", "zróbmy" ];

const delexicalisedVerbsInfinitive = [ "brać", "dać", "dawać", "iść", "robić", "stanowić", "uprawiać", "wykonywać", "wziąć",
	"zrobić" ];


const interviewVerbs = [ "informowali", "informowały", "informują", "informuje", "informuję", "mówi", "mówią", "mówię",
	"mówił", "mówiła", "mówili", "mówiły", "odpowiada", "odpowiadają", "odpowiadam", "odpowiedział",
	"odpowiedziała", "odpowiedziałam", "odpowiedziały", "odpowiedzieli", "odwiedziałam", "poinformowałam", "poinformowali",
	"poinformowały", "powiedział", "powiedziała", "powiedziałam", "powiedziały", "powiedzieli", "pyta", "pytać", "pytał",
	"pytała", "pytałam", "pytali", "pytały", "pytam", "sądzą", "sądzę", "sądzi", "sądzić", "sądziłam", "sądzili",
	"sądziły", "spytał", "spytała", "spytałam", "spytali", "spytały", "stwierdziały", "stwierdzieli", "stwierdził",
	"stwierdziła", "stwierdziłam", "twierdzą", "twierdzę", "twierdzi", "twierdziały", "twierdzić", "twierdzieli",
	"twierdził", "twierdziła", "twierdziłam", "uważa", "uważają", "uważał", "uważała", "uważali", "uważały", "uważam",
	"wyjaśnia", "wyjaśniać", "wyjaśniają", "wyjaśniam", "wyjaśnił", "wyjaśniła", "wyjaśnili", "wyjaśniły", "zapytał",
	"zapytała", "zapytałam", "zapytali", "zapytały", "zaznacza", "zaznaczają", "zaznaczam", "zaznaczył", "zaznaczyła",
	"zaznaczyłam", "zaznaczyli", "zaznaczyły" ];


const intensifiers = [ "bardziej", "bardzo", "całkiem", "całkowicie", "doskonale", "dość", "dosyć", "kompletnie", "najbardziej",
	"naprawdę", "nawet", "nieco", "niezbyt", "niezmiernie", "niezwykle", "ogromnie", "strasznie", "świetnie", "wielce",
	"wyjątkowo", "zbyt", "znacznie", "zupełnie" ];

const generalAdjectives = [ "cała", "całą", "całe", "całego", "całej", "całemu", "cali", "cały", "całych", "całym",
	"całymi", "ciekawa", "ciekawą", "ciekawe", "ciekawego", "ciekawej", "ciekawemu", "ciekawi", "ciekawy", "ciekawych",
	"ciekawym", "ciekawymi", "dłudzy", "długa", "długą", "długi", "długich", "długie", "długiego", "długiej", "długiemu",
	"długim", "długimi", "dłużsi", "dłuższa", "dłuższą", "dłuższe", "dłuższego", "dłuższej", "dłuższemu", "dłuższy",
	"dłuższych", "dłuższym", "dłuższymi", "dobra", "dobrą", "dobre", "dobrego", "dobrej", "dobremu", "dobry", "dobrych",
	"dobrym", "dobrymi", "dobrzy", "fajna", "fajną", "fajne", "fajnego", "fajnej", "fajnemu", "fajni", "fajny", "fajnych",
	"fajnym", "fajnymi", "główna", "główną", "główne", "głównego", "głównej", "głównemu", "główni", "główny", "głównych",
	"głównym", "głównymi", "inna", "inną", "inne", "innego", "innej", "innemu", "inni", "inny", "innych", "innym",
	"innymi", "krótcy", "krótka", "krótką", "krótki", "krótkich", "krótkie", "krótkiego", "krótkiej", "krótkiemu",
	"krótkim", "krótkimi", "krótsi", "krótsza", "krótszą", "krótsze", "krótszego", "krótszej", "krótszemu", "krótszych",
	"krótszym", "krótszymi", "łatwe", "łatwego", "łatwiejsze", "łatwym", "lepsi", "lepsza", "lepszą", "lepsze", "lepszego",
	"lepszej", "lepszemu", "lepszy", "lepszych", "lepszym", "lepszymi", "mała", "małą", "małe", "małego", "małej",
	"małemu", "mali", "mały", "małych", "małym", "małymi", "mniejsi", "mniejsza", "mniejszą", "mniejsze", "mniejszego",
	"mniejszej", "mniejszemu", "mniejszy", "mniejszych", "mniejszym", "mniejszymi", "najdłużsi", "najdłuższa",
	"najdłuższą", "najdłuższe", "najdłuższego", "najdłuższej", "najdłuższemu", "najdłuższy", "najdłuższych", "najdłuższym",
	"najdłuższymi", "najkrótsi", "najkrótsza", "najkrótszą", "najkrótsze", "najkrótszego", "najkrótszej", "najkrótszemu",
	"najkrótszych", "najkrótszym", "najkrótszymi", "najłatwiejsze", "najlepsi", "najlepsza", "najlepszą", "najlepsze",
	"najlepszego", "najlepszej", "najlepszemu", "najlepszych", "najlepszym", "najlepszymi", "najmniejsi", "najmniejsza",
	"najmniejszą", "najmniejsze", "najmniejszego", "najmniejszej", "najmniejszemu", "najmniejszy", "najmniejszych",
	"najmniejszym", "najmniejszymi", "najniżsi", "najniższa", "najniższą", "najniższe", "najniższego", "najniższej",
	"najniższemu", "najniższy", "najniższych", "najniższym", "najniższymi", "najtrudniejsze", "najwięksi", "największa",
	"największą", "największe", "największego", "największej", "największemu", "największych", "największym",
	"największymi", "najwyżsi", "najwyższa", "najwyższą", "najwyższe", "najwyższego", "najwyższej", "najwyższemu",
	"najwyższy", "najwyższych", "najwyższym", "najwyższymi", "następna", "następną", "następne", "następnego", "następnej",
	"następni", "następny", "następnych", "następnym", "następnymi", "niewłaściwa", "niewłaściwą", "niewłaściwe",
	"niewłaściwego", "niewłaściwej", "niewłaściwemu", "niewłaściwi", "niewłaściwy", "niewłaściwych", "niewłaściwym",
	"niewłaściwymi", "niscy", "niska", "niską", "niski", "niskich", "niskie", "niskiego", "niskiej", "niskiemu", "niskim",
	"niskimi", "niżsi", "niższa", "niższą", "niższe", "niższego", "niższej", "niższemu", "niższy", "niższych", "niższym",
	"niższymi", "ostatni", "ostatnia", "ostatnią", "ostatnich", "ostatnie", "ostatniego", "ostatniej", "ostatniemu",
	"ostatnim", "ostatnimi", "poprzedni", "poprzednia", "poprzednią", "poprzednich", "poprzednie", "poprzedniego",
	"poprzedniej", "poprzedniemu", "poprzednim", "poprzednimi", "sam", "sama", "samą", "same", "samego", "samej",
	"samemu", "sami", "samo", "samych", "samym", "samymi", "trudne", "trudnego", "trudniejsze", "trudnym", "więksi",
	"większa", "większą", "większe", "większego", "większej", "większemu", "większych", "większym", "większymi", "wielcy",
	"wielka", "wielką", "wielki", "wielkich", "wielkie", "wielkiego", "wielkiej", "wielkiemu", "wielkim", "wielkimi",
	"właściwa", "właściwą", "właściwe", "właściwego", "właściwej", "właściwemu", "właściwi", "właściwy", "właściwych",
	"właściwym", "właściwymi", "wysocy", "wysoka", "wysoką", "wysoki", "wysokich", "wysokie", "wysokiego", "wysokiej",
	"wysokiemu", "wysokim", "wysokimi", "wyżsi", "wyższa", "wyższą", "wyższe", "wyższego", "wyższej", "wyższemu",
	"wyższy", "wyższych", "wyższym", "wyższymi" ];

const generalAdverbs = [ "blisko", "bliżej", "ciągle", "ciężko", "czasami", "czasem", "częściej", "często", "dalej",
	"daleko", "dawniej", "dawno", "dobrze", "dopiero", "fajnie", "fajniej", "gorzej", "inaczej", "ładnie", "łatwiej", "łatwo",
	"lepiej", "najbliżej", "najczęściej", "najdalej", "najdawniej", "najfajniej", "najgorzej", "najłatwiej", "najlepiej",
	"najniżej", "najpóźniej", "najprościej", "najszybciej", "najtrudniej", "najwcześniej", "najwyżej", "naprawdę",
	"niedaleko", "niedawno", "nisko", "niżej", "ostatnio", "pewno", "póżniej", "późno", "prawie", "prościej", "prosto",
	"prostu", "szybciej", "szybko", "trochę", "trudniej", "trudno", "wcześnie", "wcześniej", "wolno", "wszędzie",
	"wysoko", "wyżej", "zazwyczaj", "źle" ];

const timeWords = [ "dni", "dnia", "dniach", "dniami", "dnie", "dzień", "dzisiaj", "godzin", "godzina", "godzinach",
	"godzinami", "godzinę", "godziny", "jutro", "lata", "latach", "latami", "miesiąc", "miesiąca", "miesiącach",
	"miesiącami", "miesiące", "miesiącem", "miesiącu", "miesięcy", "minut", "minuta", "minutach", "minutę", "minuty",
	"pojutrze", "przedwczoraj", "rok", "rokiem", "roku", "sekund", "sekunda", "sekundach", "sekundę", "sekundy",
	"tydzień", "tygodni", "tygodnia", "tygodniach", "tygodniami", "tygodnie", "tygodniu", "wczoraj" ];

const vagueNouns = [ "chwila", "chwilą", "chwilach", "chwilami", "chwile", "chwilę", "chwili", "chwilom", "część", "części",
	"częścią", "częściach", "częściami", "częściom", "momencie", "moment", "ogóle", "osób", "osoba", "osobą", "osobach", "osobami",
	"osobę", "osobie", "osobom", "osoby", "powód", "powodach", "powodami", "powodem", "powodom", "powodów", "powodowi",
	"powodu", "powody", "powodzie", "przypadkiem", "przypadku", "raz", "razach", "razami", "razem", "razie", "razom",
	"razów", "razowi", "razu", "razy", "rodzaj", "rodzajach", "rodzajami", "rodzajem", "rodzajom", "rodzajów",
	"rodzajowi", "rodzaju", "rzecz", "rzeczą", "rzeczach", "rzeczami", "rzeczom", "rzeczy", "sposób", "sposobem",
	"sprawa", "sprawą", "sprawach", "sprawami", "sprawę", "sprawie", "sprawom", "sprawy", "temacie", "temat", "tematach",
	"tematami", "tematem", "tematom", "tematów", "tematowi", "tematu", "tematy" ];

const titles = [ "dr", "dyr", "mgr", "p", "pan", "pani", "panie", "panowie", "prof" ];

const interjections = [ "a", "ach", "aha", "aj", "akurat", "ał", "aua", "auć", "ba", "brawo", "e", "ech", "ehe", "ehm", "ej",
	"ejże", "ekhm", "ekstra", "jej", "jejku", "łał", "och", "oh", "oho", "oj", "ojej", "ojejku", "phi", "precz", "super",
	"uwaga", "wow" ];


const measurementUnits = [ "°C", "°F", "ar", "ary", "arów", "arach", "c", "cl", "cm", "cm²", "cm³", "dag", "deka", "dl", "f",
	"ft", "g", "gram", "gramów", "gramy", "ha", "hektar", "hektary", "hektarów", "hektarach", "in", "kg", "kilo", "km",
	"km²", "cm³", "l", "litr", "litrów", "litry", "łyżeczka", "łyżeczkę", "łyżeczki", "łyżka", "łyżkę", "łyżki", "m",
	"m²", "m³", "mg", "ml", "mm", "mm²", "mm³", "szczypta", "szczyptę", "szczypty", "szklanka", "szklankę", "szklanki",
	"tuzin" ];

const miscellaneous = [ "nie", "no", "oto", "tak", "sobie", "ok", "okej" ];


export default function() {
	return {

		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, generalAdjectives, generalAdverbs, delexicalisedVerbsInfinitive,
			otherAuxiliariesInfinitive, passiveAuxiliariesInfinitive ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( prepositions, coordinatingConjunctions, demonstrativePronouns,
			quantifiers, intensifiers, possessivePronouns, reflexivePronounsNominative, reflexivePronounsOther ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, additionalTransitionWords, cardinalNumerals, personalPronounsNominative,
			personalPronounsAccusative, personalPronounsGenitive, personalPronounsDative, personalPronounsInstrumental,
			personalPronounsPast, personalPronounsPrepositional, interrogativePronouns, interrogativeProAdverbs,
			interrogativeDeterminers, indefinitePronouns, adverbialGenitives, prepositionalAdverbs,
			subordinatingConjunctions, delexicalizedVerbs, interviewVerbs, timeWords, vagueNouns, titles,
			interjections, measurementUnits, miscellaneous, otherAuxiliaries ),


		// These word categories cannot directly precede a passive participle.
		cannotDirectlyPrecedePassiveParticiple: [].concat( prepositions, personalPronounsPast, possessivePronouns,
			cardinalNumerals, ordinalNumerals, delexicalizedVerbs, delexicalisedVerbsInfinitive, interviewVerbs,
			interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs ),

		// These word categories cannot intervene between an auxiliary and a corresponding passive participle.
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, otherAuxiliariesInfinitive, reflexivePronounsNominative ),

		// This export contains all of the above words.
		all: [].concat( transitionWords, additionalTransitionWords, cardinalNumerals, personalPronounsNominative,
			personalPronounsAccusative, personalPronounsGenitive, personalPronounsDative, personalPronounsInstrumental,
			personalPronounsPast, personalPronounsPrepositional, interrogativePronouns, interrogativeProAdverbs,
			interrogativeDeterminers, indefinitePronouns, adverbialGenitives, otherAuxiliaries, prepositionalAdverbs,
			subordinatingConjunctions, delexicalizedVerbs, interviewVerbs, timeWords, vagueNouns, titles,
			interjections, measurementUnits, miscellaneous, passiveAuxiliaries, prepositions, coordinatingConjunctions, demonstrativePronouns,
			quantifiers, intensifiers, possessivePronouns, reflexivePronounsNominative, reflexivePronounsOther, ordinalNumerals, generalAdjectives,
			generalAdverbs, delexicalisedVerbsInfinitive, otherAuxiliariesInfinitive, passiveAuxiliariesInfinitive ),
	};
}
