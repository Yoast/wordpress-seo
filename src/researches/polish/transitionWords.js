/** @module config/transitionWords */

let singleWords = [ "aby", "abym", "abyśmy", "abyś", "abyście", "acz", "aczkolwiek", "albowiem", "ale", "aliści",
	"bo", "bowiem", "bynajmniej", "choć", "chociaż", "chociażby", "czyli", "dlatego", "dodatkowo", "dopóki", "dotychczas",
	"faktycznie", "gdy", "gdyż", "jakkolwiek", "iż", "jednak", "jednakże", "jeśli", "kiedy", "lecz", "mianowicie", "mimo",
	"np", "najpierw", "następnie", "natomiast", "ni", "niemniej", "niż", "notabene", "oczywiście", "ogółem",
	"ostatecznie", "owszem", "podobnie", "podsumowując", "pokrótce", "pomimo", "ponadto", "ponieważ", "poprzednio",
	"potem", "później", "przecież", "przeto", "przynajmniej", "raczej", "również", "rzeczywiście", "skoro", "także",
	"też", "toteż", "tudzież", "tymczasem", "wedle", "według", "więc", "właściwie", "wobec", "wpierw", "wprawdzie",
	"wreszcie", "wskutek", "wstępnie", "wszakże", "wszelako", "zamiast", "zanim", "zarówno", "zaś", "zatem", "zresztą",
	"zwłaszcza", "żeby", "żebym", "żebyś", "żebyście", "żebyśmy" ];

let multipleWords = [ "a konkretnie", "a propos", "aby wrocić do rzeczy", "analogicznie do", "bacząc na to że",
	"bądź co bądź", "bez wątpienia", "bez względu", "biorąc pod uwagę", "choćby", "chodzi o to", "chyba że", "co do",
	"co gorsza", "co prawda", "co się tyczy", "co ważniejsze", "co więcej", "dzięki czemu", "dzięki któremu", "dzięki której",
	"dzięki którym", "dzięki temu", "faktem jest że", "inaczej mówiąc", "innymi słowy", "jak dotąd", "jak już mówiłam",
	"jak już mówiłem", "jak już wspomniano", "jak widać", "jako przykład", "jednym słowem", "jeśli chodzi o", "jeżeli chodzi o",
	"konkretnie to", "krótko mówiąc", "łącznie z", "mając to na uwadzę", "mam na myśli", "mamy na myśli",
	"mówiąc w skrócie", "na celu", "na dłuższą metę", "na dodatek", "na koniec", "na końcu", "na przykład", "na skutek",
	"na wstęp", "na wypadek gdyby", "na zakończenie", "nade wszystko", "należy pamiętać", "nawiasem mówiąc",
	"nie mówiąc już", "nie mówiąc o tym", "nie pomijając", "nie schodząc z tematu", "nie wspominając już",
	"nie wspominając o", "nie wspominając to", "nie wspominając że", "nie zważając na", "o ile", "o tyle",
	"od czasu do czasu", "od momentu", "odnośnie do", "ogólnie mówiąc", "ogólnie rzecz biorąc", "oprócz tego",
	"oznacza to że", "po czwarte", "po drugie", "po piąte", "po pierwsze", "po to", "po trzecie", "pod warunkiem",
	"podczas gdy", "podczas kiedy", "podobnym sposobem", "ponad wszystko", "poza tym", "prawdę mówiąc",
	"prawdę powiedziawszy", "prędzej czy później", "przechodząc do", "przede wszystkim", "przez co", "przez tą",
	"przez tego", "przez to", "przy tym", "przypuściwszy że", "raz na jakiś czas", "rzecz jasna", "ściśle biorąc",
	"ściśle mówiąc", "skutkiem tego", "tak czy inaczej", "tak czy owak", "tak naprawdę", "takich jak", "takie jak",
	"to znaczy", "tym samym", "w celu", "w ciągu", "w dodatku", "w efekcie", "w innych słowach", "w istocie", "w każdym razie",
	"w końcu", "w konsekwencji", "w kwestii", "w międzyczasie", "w nadziei że", "w obawie że", "w odróżnieniu",
	"w podobny sposób", "w podsumowaniu", "w przeciwieństwie do", "w przeciwnym razie", "w przypadku", "w rezultacie",
	"w rozumieniu że", "w rzeczy samej", "w rzeczywistości", "w skrócie", "w szczególności", "w takim razie",
	"w ten sposób", "w tych okolicznościach", "w tym przypadku", "w wyniku", "w wyniku tego", "w związku z tym",
	"wbrew pozorom", "włącznie z", "wracając do rzeczy", "wracając do tematu", "wręcz przeciwnie", "z drugiej strony",
	"z drugiej zaś strony", "z jednej strony", "z mocy że", "z obawy że", "z pewnością", "z powodu", "z przyczyny",
	"z tą intencją", "z tego powodu", "z uwagi że", "zacznijmy od", "zakładając że", "ze względu na", "ze względu że",
	"zważywszy na to", "zważywszy że" ];

/**
 * Returns an list with transition words to be used by the assessments.
 * @returns {Object} The list filled with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};
