/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Definite articles:
		"az", "a",
		// Indefinite article:
		"egy",
		// Conjunctions:
		"és", "se", "sem", "vagy", "de",
		// Adverbs:
		"aztán", "ezután", "azután", "majd", "ezek után", "nagyon", "kicsit", "nagy", "kevés", "sok", "sokan", "kevesen", "jól",
		// Demonstrative pronouns:
		"ez", "ezek", "az", "azok", "néhány", "aki", "ami",
		// Personal pronouns:
		"én", "mi", "ő", "ők",
		// Demonstrative pronouns:
		"ini", "itu", "hal", "ia",
		// Transition words:
		"azonban", "ám", "ha", "szerintem", "míg", "bár", "habár", "hát", "ha", "amennyiben", "mivel", "azonban", "amíg", "azért", "ezért",
		// Interrogatives:
		"mi", "mit", "miért", "meddig", "mikor", "hány", "mennyi", "ki", "kit", "merre", "hogy", "hogyan", "miként", "hol",
		"honnan", "hová", "mivel", "milyen",
		// Interjections:
		"ó", "óh", "jaj",
		// Miscellaneous:
		"ne", "nem", "hát", "nos",
	];
}
