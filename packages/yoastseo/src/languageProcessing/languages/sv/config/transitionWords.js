/** @module config/transitionWords */

const singleWords = [ "alltså", "ändå", "annars", "ännu", "även", "avslutningsvis", "bl.a.", "d.v.s.", "då", "därav",
	"därefter", "däremot", "därför", "därmed", "därpå", "dessutom", "dock", "efteråt", "eftersom", "emellertid", "enligt",
	"exempelvis", "fastän", "följaktligen", "förrän", "först", "förutom", "huvudsakligen", "ifall", "inledningsvis", "innan",
	"jämförelsevis", "likadant", "likaså", "liksom", "medan", "men", "nämligen", "när", "oavsett", "också", "omvänt", "säkerligen",
	"således", "sålunda", "sammanfattningsvis", "sammantaget", "samt", "samtidigt", "särskilt", "såsom", "sist", "slutligen",
	"speciellt", "t.ex.", "tidigare", "tillika", "tills", "trots", "tvärtemot", "tvärtom", "tydligen", "varpå", "vidare",
	"uppenbarligen", "ytterligare" ];

const multipleWords = [ "å andra sidan", "å ena sidan", "allt som allt", "anledningen är", "anledningen blir", "annorlunda än",
	"av den orsaken", "av detta skäl", "beroende på", "bland annat", "därtill kommer", "det beror på att", "det vill säga",
	"det visar", "detta beror på", "detta går ut på att", "detta innebär att", "detta leder till", "detta medför att",
	"effekten blir", "efter ett tag", "ej heller", "en effekt av detta", "en förklaring till detta", "ett exempel på detta",
	"ett liknande exempel", "exakt som", "följden blir", "för att avrunda", "för all del", "för att förklara", "för att inte säga",
	"för att inte tala om", "för att klargöra", "för att poängtera", "för att säga det på ett annat sätt", "för att sammanfatta",
	"för att understryka", "för att visa", "för det andra", "för det första", "för det tredje", "förr eller senare", "för närvarande",
	"framför allt", "fram till nu", "har att göra med", "härav följer", "i båda fallen", "i det fallet", "i det hela",
	"i det här fallet", "i det långa loppet", "i enlighet med", "i förhållande till", "i fråga om", "i jämförelse med",
	"i kontrast till", "i likhet med", "i ljuset av", "i motsats till", "i och med", "i relation till", "i samband med",
	"i sin tur", "i själva verket", "i slutändan", "i stället för", "i syfte att", "i synnerhet", "i verkligheten",
	"icke desto mindre", "ihop med", "inte desto mindre", "jämfört med", "kan sammanfattas", "kort sagt", "konsekvensen av detta",
	"lika viktigt är", "målet är att", "med andra ord", "med anledning av", "med det i åtanke", "med det i tankarna",
	"med ett ord", "med hänsyn till", "med härledning av", "mot bakgrund av", "mot den bakgrunden", "när allt kommer omkring",
	"när det gäller", "närmare bestämt", "nu när", "orsaken är", "på det sättet", "på grund av", "på liknande sätt", "på så sätt",
	"på samma sätt", "resultatet blir", "så länge som", "så småningom", "så snart som", "sist men inte minst", "slutsatsen blir",
	"som antytt", "som en följd av", "som en konsekvens av", "som ett exempel på", "som ett resultat", "som jag tidigare antytt",
	"som konklusion kan", "som man kan se", "som nämnt", "som tidigare nämnts", "summa summarum", "tack vare", "till att börja med",
	"till dess", "till exempel", "till en början", "till följd av", "till sist", "till skillnad från", "till slut",
	"till största delen", "tillsammans med", "tvärt om", "under de omständigheterna", "under omständigheterna", "under tiden",
	"vad mera är", "viktigt att inse", "vilket innebär" ];

/**
 * Returns an list with transition words to be used by the assessments.
 * @returns {Object} The list filled with transition word lists.
 */
module.exports = function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};
