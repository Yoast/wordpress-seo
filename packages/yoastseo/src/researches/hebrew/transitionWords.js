/** @module config/transitionWords */

const singleWords = [ "לכן", "משום‎", "בגלל", "מפני", "אחרי", "לפני", "חוץ", "בזכות", "כתוצאה", "הודות", "בשביל", "למרות‎", "בשל‎", "ו", "או", "אבל", "אולם", "אך",
	"אם", "גם", "רק", "אכן", "אלא", "עדיין", "כאשר", "אז", "לכן", "כבר", "אחרי", "לאחר", "לפני", "אפילו", "אף", "כך", "כדי", "על", "עד", "בשנת", "כמו", "כ", "שני",
	"באופן", "במהלך", "במקום", "וכן", "בעיקר", "במקום", "תחת", "מתוך", "מול", "כגון", "באמצעות", "מכן", "במשך", "ואף", "ועל", "לעתים", "למרות", "בנוסף", "בעקבות",
	"לפי", "בקרב", "כי", "בשל" ];
const multipleWords = [ "כתוצאה מכך", "כתוצאה מ", "בעקבות ה", "בעקבות זאת", "אלא אם כן", "בזמן ש", "מתי ש", "אף על פי ש", "אף על פי", "חוץ מ", "אחרי ש",
	"לפני ש", "בגלל ה", "הודות ל", "מפני ש" ];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
}
