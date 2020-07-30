/** @module config/transitionWords */

const singleWords = [ "كذلك", "ولكن", "ولذلك", "حاليا", "أخيرا", "بالطبع", "ثم" ];
const multipleWords = [ "إلا إذا", "إلا أن", "إلى آخره", "إلى الأبد", "إلى أن", "آن لك أن", "آن له أن", "آن لعلي", "بعد ذلك",
	"بما أن", "بما فيه", "حتى لا", "حتى لو", "عليك أن", "علينا أن", "عليه أن", "عليكم أن", "على محمد أن", "فيما بعد", "لا أحد",
	"لا بأس أن", "لا بد من", "لا بد من أن", "لا سيما", "لا شيء", "لا غير", "لا هذا ولا ذاك", "له أن", "لها أن", "لك أن", "لكم أن",
	"ما لم", "مع هذا ، مع ذلك", "من أجل أن", "من أجلك", "من أجلها", "من أجل سارة", "من أجل اليمن", "من دون ، بدون",
	"منذ ذلك الحين", "بالإضافة إلى ذلك", "في نهاية المطاف", "في الوقت الحالي", "علاوة على ذلك", "أنا أيضاً", "بدلا من ذلك",
	"في الواقع", "بناء على ذلك", "ومع ذلك", "في الحقيقة", "من ناحية أخرى", "لا يزال" ];

/**
 * Returns lists with Arabic transition words to be used by the assessments.
 * @returns {Object}                  The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
}
