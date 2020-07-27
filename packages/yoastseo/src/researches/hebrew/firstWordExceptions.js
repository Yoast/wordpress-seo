/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
export default function() {
	return [
		// Indefinite articles:
		"אחד", "כמה", "מעטים",
		// Numbers 1-10 (feminine-masculine pairs):
		"אֶחָד", "אַחַת", "שְׁנַיִם", "שְׁתַּיִם", "שְׁלֹשָׁה", "שָׁלֹשׁ", "אַרְבָּעָה", "אַרְבַּע", "חֲמִשָּׁה", "חָמֵשׁ", "שִׁשָּׁה",
		"שֵׁשׁ", "שִׁבְעָה", "שֶׁבַע", "שְׁמוֹנָה", "שְׁמוֹנֶה", "תִּשְׁעָה", "תֵּשַׁע", "עֲשָׂרָה", "עֶשֶׂר",
		// Demonstrative pronouns:
		"זֶה", "זֺאת", "אֵלֶּה", "אוּה", "הִיא", "אֵלֶּה", "הֵמָּה", "הֵם", "הֵנָּה",
	];
}
