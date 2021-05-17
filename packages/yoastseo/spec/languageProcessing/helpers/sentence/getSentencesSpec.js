import getSentences from "../../../../src/languageProcessing/helpers/sentence/getSentences.js";

import {
	paragraph1,
	paragraph2,
	listWordsLowerCaseProcessed,
	realWorldULExample1Processed,
	realWorldULExample2Processed,
	listWordsUpperCaseProcessed,
	listNestedProcessed,
	listSentencesProcessed,
	listParagraphsProcessed,
	listParagraphsAndSentencesProcessed,
} from "../sanitize/mergeListItemsSpec";

import { forEach } from "lodash-es";

/**
 * Helper to test sentence detection.
 *
 * @param {array} testCases Cases to test.
 *
 * @returns {void}
 */
function testGetSentences( testCases ) {
	forEach( testCases, function( testCase ) {
		expect( getSentences( testCase.input ) ).toEqual( testCase.expected );
	} );
}

describe( "Get sentences from text", function() {
	it( "returns sentences", function() {
		const sentence = "Hello. How are you? Bye";
		expect( getSentences( sentence ) ).toEqual( [ "Hello.", "How are you?", "Bye" ] );
	} );
	it( "returns sentences with digits", function() {
		const sentence = "Hello. 123 Bye";
		expect( getSentences( sentence ) ).toEqual( [ "Hello.", "123 Bye" ] );
	} );

	it( "returns sentences with abbreviations", function() {
		const sentence = "It was a lot. Approx. two hundred";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot.", "Approx. two hundred" ] );
	} );

	it( "returns sentences with a ! in it (should not be converted to . )", function() {
		const sentence = "It was a lot. Approx! two hundred";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot.", "Approx!", "two hundred" ] );
	} );

	it( "returns sentences with multiple sentence delimiters at the end", function() {
		const sentence = "Was it a lot!?!??! Yes, it was!";
		expect( getSentences( sentence ) ).toEqual( [ "Was it a lot!?!??!", "Yes, it was!" ] );
	} );

	it( "returns sentences with multiple periods at the end", function() {
		const sentence = "It was a lot... Approx. two hundred.";
		expect( getSentences( sentence ) ).toEqual( [ "It was a lot...", "Approx. two hundred." ] );
	} );

	it( "returns sentences, with :", function() {
		const sentence = "One. Two. Three: Four! Five.";
		expect( getSentences( sentence ).length ).toBe( 4 );
	} );

	it( "returns sentences with a text with H2 tags", function() {
		const text = "<h2>Four types of comments</h2>" +
			"The comments people leave on blogs can be divided into four types: " +
			"<h2>Positive feedback</h2>" +
			"First, the positive feedback. ";
		const expected = [ "Four types of comments", "The comments people leave on blogs can be divided into four types:",
			"Positive feedback", "First, the positive feedback." ];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "returns a sentence with incomplete tags", function() {
		const text = "<p>Some text. More Text.</p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text." ] );
	} );

	it( "returns a sentence with incomplete tags per sentence", function() {
		const text = "<p><span>Some text. More Text.</span></p>";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text." ] );
	} );

	it( "returns a sentence with incomplete tags with a link", function() {
		const text = "Some text. More Text with <a href='http://yoast.com'>a link</a>.";
		expect( getSentences( text ) ).toEqual( [ "Some text.", "More Text with <a href='http://yoast.com'>a link</a>." ] );
	} );

	it( "can deal with self-closing tags", function() {
		const text = "A sentence with an image <img src='http://google.com' />";
		expect( getSentences( text ) ).toEqual( [ "A sentence with an image <img src='http://google.com' />" ] );
	} );

	it( "can deal with newlines", function() {
		const testCases = [
			{
				input: "A sentence\nAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence<br />Another sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "A sentence\n\rAnother sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "<p>A sentence</p><p>Another sentence</p>",
				expected: [ "A sentence", "Another sentence" ],
			},
			{
				input: "<div>A sentence</div><div>Another sentence</div>",
				expected: [ "A sentence", "Another sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can deal with headings", function() {
		const testCases = [
			{
				input: "<h1>A sentence</h1>Another sentence",
				expected: [ "A sentence", "Another sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can detect sentences in parentheses", function() {
		const text = "First sentence. (Second sentence.) [Third sentence.]";
		const expected = [
			"First sentence.",
			"(Second sentence.)",
			"[Third sentence.]",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "should not split on parentheses", function() {
		const text = "A sentence with (parentheses).";
		const expected = [ "A sentence with (parentheses)." ];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "can detect sentences in brackets", function() {
		const text = "[First sentence. Second sentence.] Third sentence";
		const expected = [
			"[First sentence.",
			"Second sentence.]",
			"Third sentence",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "can deal with a longer text", function() {
		const text = "<p>As of today, you'll be able to buy our SEO copywriting training! Everyone who wants to learn how to write quality " +
			"and SEO-friendly content should definitely look into our online training. Through video tutorials, instructional videos " +
			"and lots of challenging questions we’ll teach you everything you need to know about SEO copywriting.  " +
			"If you start our training now, you'll receive $50 discount and pay only $249.</p><p>buyknop our seo copywriting training</p><p>" +
			"[promofilmpje seo copywriting invoegen]</p><h2>What will you learn?</h2><p>Our SEO copywriting training will take you " +
			"through all the steps of the copywriting process. We start by executing keyword research. After that, we'll teach you " +
			"how to prepare a blog post and give lots of tips on how to make your text nice and easy to read. Finally, we'll help you to optimize " +
			"your text for the search engines.</p><p>The SEO copywriting training contains 6 modules with lots of training video's, " +
			"texts, quizzes, and assignments.  You will have to do your own keyword research and write a genuine blog post. " +
			"You will receive feedback from a member of the Yoast-team on both of these assignments.</p><p>Read more about " +
			"the SEO copywriting training -- linken naar sales pagina</p><p> </p>";
		const expected = [
			"As of today, you'll be able to buy our SEO copywriting training!",
			"Everyone who wants to learn how to write quality and SEO-friendly content should definitely look into our online training.",
			"Through video tutorials, instructional videos and lots of challenging questions we’ll teach you everything " +
			"you need to know about SEO copywriting.",
			"If you start our training now, you'll receive $50 discount and pay only $249.",
			"buyknop our seo copywriting training",
			"[promofilmpje seo copywriting invoegen]",
			"What will you learn?",
			"Our SEO copywriting training will take you through all the steps of the copywriting process.",
			"We start by executing keyword research.",
			"After that, we'll teach you how to prepare a blog post and give lots of tips on how to make your text nice and easy to read.",
			"Finally, we'll help you to optimize your text for the search engines.",
			"The SEO copywriting training contains 6 modules with lots of training video's, texts, quizzes, and assignments.",
			"You will have to do your own keyword research and write a genuine blog post.",
			"You will receive feedback from a member of the Yoast-team on both of these assignments.",
			"Read more about the SEO copywriting training -- linken naar sales pagina",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );


	it( "ignores decimals with dots in them", function() {
		const testCases = [
			{
				input: "This is 1.0 complete sentence",
				expected: [ "This is 1.0 complete sentence" ],
			},
			{
				input: "This is 255.255.255.255 complete sentence",
				expected: [ "This is 255.255.255.255 complete sentence" ],
			},
			{
				input: "This is an IP (127.0.0.1) 1 sentence",
				expected: [ "This is an IP (127.0.0.1) 1 sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should not break on colons", function() {
		const testCases = [
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ],
			},
			{
				input: "This should be: one sentence",
				expected: [ "This should be: one sentence" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should always break on ;, ? and ! even when there is no capital letter", function() {
		const text = "First sentence; second sentence! third sentence? fourth sentence";
		const expected = [ "First sentence;", "second sentence!", "third sentence?", "fourth sentence" ];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "should match correctly with quotation", function() {
		const testCases = [
			{
				input: "First sentence. \"Second sentence\"",
				expected: [ "First sentence.", "\"Second sentence\"" ],
			},
			{
				input: "First sentence. 'Second sentence'",
				expected: [ "First sentence.", "'Second sentence'" ],
			},
			{
				input: "First sentence. ¿Second sentence?",
				expected: [ "First sentence.", "¿Second sentence?" ],
			},
			{
				input: "First sentence. ¡Second sentence!",
				expected: [ "First sentence.", "¡Second sentence!" ],
			},
		];

		testGetSentences( testCases );
	} );
	it( "should ignore non breaking spaces", function() {
		const testCases = [
			{
				input: "First sentence. Second sentence. &nbsp;",
				expected: [ "First sentence.", "Second sentence." ],
			},
		];

		testGetSentences( testCases );
	} );
	it( "should accept the horizontal ellipsis as sentence terminator", function() {
		const testCases = [
			{
				input: "This is the first sentence… Followed by a second one.",
				expected: [ "This is the first sentence…", "Followed by a second one." ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can deal with brackets", function() {
		const testCases = [
			{
				input: "This is a sentence (with blockends) and is still one sentence.",
				expected: [ "This is a sentence (with blockends) and is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends.) and is still one sentence.",
				expected: [ "This is a sentence (with blockends.) and is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends?) and is still one sentence.",
				expected: [ "This is a sentence (with blockends?) and is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends). this is still one sentence.",
				expected: [ "This is a sentence (with blockends). this is still one sentence." ],
			},
			// Second sentence starts with lower-case letter, but unlike a full stop, a "?" is an unambiguous sentence ending.
			{
				input: "This is a sentence (with blockends)? this is still one sentence.",
				expected: [ "This is a sentence (with blockends)?", "this is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). This is a second sentence.",
				expected: [ "This is a sentence (with blockends.).", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.)? This is a second sentence.",
				expected: [ "This is a sentence (with blockends.)?", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends?). This is a second sentence.",
				expected: [ "This is a sentence (with blockends?).", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.) This is a second sentence.",
				expected: [ "This is a sentence (with blockends.)", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends?) This is a second sentence.",
				expected: [ "This is a sentence (with blockends?)", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends) This is still one sentence.",
				expected: [ "This is a sentence (with blockends) This is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends). This is a second sentence.",
				expected: [ "This is a sentence (with blockends).", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends)? This is a second sentence.",
				expected: [ "This is a sentence (with blockends)?", "This is a second sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). this is still one sentence.",
				expected: [ "This is a sentence (with blockends.). this is still one sentence." ],
			},
			{
				input: "This is a sentence (with blockends?). this is still one sentence.",
				expected: [ "This is a sentence (with blockends?). this is still one sentence." ],
			},
			// Second sentence starts with lower-case letter, but unlike a full stop, a ? is an unambiguosu sentence ending
			{
				input: "This is a sentence (with blockends.)? this is a new sentence.",
				expected: [ "This is a sentence (with blockends.)?", "this is a new sentence." ],
			},
			{
				input: "This is a sentence (with blockends.). 1 this is a second sentence.",
				expected: [ "This is a sentence (with blockends.).", "1 this is a second sentence." ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "Correctly gets sentences with a '<' signs in the middle or at the start.", function() {
		const testCases = [
			{
				input: "This is a sentence with a < and is still one sentence.",
				expected: [ "This is a sentence with a < and is still one sentence." ],
			},
			{
				input: "This is a sentence. < This sentence begins with a smaller than sign.",
				expected: [ "This is a sentence.", "< This sentence begins with a smaller than sign." ],
			},
			{
				input: "This is a < sentence < with three '<' signs. This is another sentence.",
				expected: [ "This is a < sentence < with three '<' signs.", "This is another sentence." ],
			},
			{
				input: "This is a 10 < 20 signs. This is another sentence.",
				expected: [ "This is a 10 < 20 signs.", "This is another sentence." ],
			},
			{
				input: "This is a sentence <. This is another sentence.",
				expected: [ "This is a sentence <.", "This is another sentence." ],
			},
			{
				input: "This is a sentence. <",
				expected: [ "This is a sentence.", "<" ],
			},
			{
				input: "<",
				expected: [ "<" ],
			},
			{
				input: "Hey you! Obviously, 20.0 < 25.0 and 50.0 > 30.0. Do not tell anyone, it is a secret.",
				expected: [ "Hey you!", "Obviously, 20.0 < 25.0 and 50.0 > 30.0.", "Do not tell anyone, it is a secret." ],
			},
			{
				input: "Hey 40 < 50. However, 40 > 50.",
				expected: [ "Hey 40 < 50.", "However, 40 > 50." ],
			},
		];

		testGetSentences( testCases );
	} );
} );

describe( "Parse languages written right-to-left", function() {
	it( "parses a Hebrew text", function() {
		const text = "רקע היסטורי תאורטי\n" +
			"שלבי התפתחות ציורי ילדים נחקרים מאז שלהי המאה ה-19. בעבודות" +
			" המוקדמות שנערכו, תיארו החוקרים שלושה שלבים מרכזיים של התפתחות אמנותית: שלב השרבוט, שלב הסכימה והשלב" +
			" הנטורליסטי. ב-1921 יצר הפסיכולוג החינוכי סיריל ברט ((אנ')‏ Cyril Burt) חלוקה חדשה של התפתחות ציורי ילדים" +
			" לארבעה שלבים. אחריו, בשנת 1927, יצר ז'ורז'-אנרי לוקה ((צר') ‏Georges-Henri Luquet) שלבים, שבבסיסם" +
			" עומדת ההנחה שהילד מצייר באופן ריאליסטי זמן רב לפני שהוא מסוגל לצייר את מה שהוא רואה באמת. על בסיס" +
			" שלביו של לוקה, קבעו הפסיכולוגים ההתפתחותיים ז'אן פיאז'ה וברבל אינהלדר ((אנ')‏ Bärbel Inhelder) כי" +
			" התפתחות הציור מקבילה להתפתחותו האינטלקטואלית של הילד, המתבטאת בהתפתחות הראייה ההנדסית" +
			" והמרחבית (ארגון המרחב, שליטה ובקרה בעיצוב הקו), ובהתאם להתפתחות החשיבה. בשנת 1947 תיאר איש החינוך לאמנות" +
			" ויקטור לוונפלד ((אנ')‏ Viktor Lowenfeld) שישה שלבים עיקריים בהתפתחות הגרפית של ילדים, וזאת על בסיס עבודתו של" +
			" ברט ובדומה לתאוריית ההתפתחות הקוגניטיבית של פיאז'ה; עבודתו זו מהווה עד היום בסיס לבחינת התפתחות ציורי ילדים. \n";

		const expected = [
			"רקע היסטורי תאורטי",
			"שלבי התפתחות ציורי ילדים נחקרים מאז שלהי המאה ה-19.",
			"בעבודות המוקדמות שנערכו, תיארו החוקרים שלושה שלבים מרכזיים של התפתחות אמנותית: שלב השרבוט, שלב הסכימה והשלב הנטורליסטי.",
			"ב-1921 יצר הפסיכולוג החינוכי סיריל ברט ((אנ')‏ Cyril Burt) חלוקה חדשה של התפתחות ציורי ילדים לארבעה שלבים.",
			"אחריו, בשנת 1927, יצר ז'ורז'-אנרי לוקה ((צר') ‏Georges-Henri Luquet) שלבים, שבבסיסם עומדת ההנחה שהילד" +
			" מצייר באופן ריאליסטי זמן רב לפני שהוא מסוגל לצייר את מה שהוא רואה באמת.",
			"על בסיס שלביו של לוקה, קבעו הפסיכולוגים ההתפתחותיים ז'אן פיאז'ה וברבל אינהלדר ((אנ')‏ Bärbel Inhelder) " +
			"כי התפתחות הציור מקבילה להתפתחותו האינטלקטואלית של הילד, המתבטאת בהתפתחות הראייה " +
			"ההנדסית והמרחבית (ארגון המרחב, שליטה ובקרה בעיצוב הקו), ובהתאם להתפתחות החשיבה.",
			"בשנת 1947 תיאר איש החינוך לאמנות ויקטור לוונפלד ((אנ')‏ Viktor Lowenfeld) " +
			"שישה שלבים עיקריים בהתפתחות הגרפית של ילדים, וזאת על בסיס עבודתו של ברט ובדומה לתאוריית ההתפתחות הקוגניטיבית של פיאז'ה;",
			"עבודתו זו מהווה עד היום בסיס לבחינת התפתחות ציורי ילדים.",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "parses an RTL language text with brackets", function() {
		const testCases = [
			{
				input: "רקע (היסטורי) תאורטי.",
				expected: [ "רקע (היסטורי) תאורטי." ],
			},
			{
				input: "רקע (היסטורי.) תאורטי.",
				expected: [ "רקע (היסטורי.)", "תאורטי." ],
			},
			{
				input: "רקע (היסטורי). תאורטי.",
				expected: [ "רקע (היסטורי).", "תאורטי." ],
			},
			{
				input: "רקע (היסטורי)? תאורטי.",
				expected: [ "רקע (היסטורי)?", "תאורטי." ],
			},
			{
				input: "רקע (היסטורי?) תאורטי.",
				expected: [ "רקע (היסטורי?)", "תאורטי." ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "parses an Arabic text", function() {
		const text = "باتمان أو الرجل الوطواط هو شخصية خيالية لبطل كتب مصورة خارق من دي سي كومكس. ابتكر الشخصية الفنان" +
			" بوب كين والكاتب بيل فينغر. كان أول ظهور للشخصية في شهر مايو عام 1939. حين ظهر في العدد رقم" +
			" 27 من مجلة القصص المصورة ديتكتيف كومكس عام 1939 ومنذ ذلك الوقت أصبح هو وسوبرمان والرجل العنكبوت،" +
			" أشهر الأبطال الخارقين الخياليين، وقد ظهر كل منهم في عدة أفلام سينمائية ناجحة. شخصية باتمان السرية" +
			" هي بروس واين، الملياردير الأمريكي، والفتى اللعوب صاحب شركات واين التجارية وفاعل الخير الكبير. بعد" +
			" أن رأى والديه يقتلان على يد أحد اللصوص في صغره، أقسم أن يحارب الجريمة أنى وجدت وأن ينتقم من" +
			" المجرمين جميعا دون أن يصبح واحدا منهم، فلا يقتل أو يغتال أحدهم مهما حصل. فتدرب على فنون القتال" +
			" والتحري المختلفة منذ صغره، وصنع لنفسه بذلة مستوحاة من هيئة الخفافيش، واتخذ اسما مستعارا" +
			" مستوحى من الخفاش كذلك الأمر. مسقط رأس باتمان هو مدينة غوثام الخيالية، وهو يتعاون مع عدة" +
			" شخصيات رئيسية في سلسلة قصصه، منها ألفرد بنيوورث خادمه ومدبر منزله، والمفوض جيمس جوردون" +
			" رئيس شرطة المدينة، وعدد من محاربي الجريمة الآخرين مثل ربيبه روبن. لا يتمتع باتمان بأي قوة" +
			" خارقة، وإنما يعتمد على مهاراته التقنية والقتالية العالية، وذكائه الذي يصل إلى حد العبقرية،" +
			" وقدراته التحليلية، وثروته الهائلة، وقوة إرادته. برزت عبر السنوات عدة شخصيات شريرة مناوئة" +
			" لباتمان حقق بعضها شهرة واسعة بين محبي وهواة القصص المصورة، يبقى الجوكر أبرزها بلا منازع.";

		const expected = [
			"باتمان أو الرجل الوطواط هو شخصية خيالية لبطل كتب مصورة خارق من دي سي كومكس.",
			"ابتكر الشخصية الفنان بوب كين والكاتب بيل فينغر.",
			"كان أول ظهور للشخصية في شهر مايو عام 1939.",
			"حين ظهر في العدد رقم 27 من مجلة القصص المصورة ديتكتيف كومكس عام 1939 " +
			"ومنذ ذلك الوقت أصبح هو وسوبرمان والرجل العنكبوت، أشهر الأبطال الخارقين الخياليين، وقد ظهر كل منهم في عدة أفلام سينمائية ناجحة.",
			"شخصية باتمان السرية هي بروس واين، الملياردير الأمريكي، والفتى اللعوب صاحب شركات واين التجارية وفاعل الخير الكبير.",
			"بعد أن رأى والديه يقتلان على يد أحد اللصوص في صغره، أقسم أن يحارب الجريمة " +
			"أنى وجدت وأن ينتقم من المجرمين جميعا دون أن يصبح واحدا منهم، فلا يقتل أو يغتال أحدهم مهما حصل.",
			"فتدرب على فنون القتال والتحري المختلفة منذ صغره، وصنع لنفسه بذلة مستوحاة من هيئة الخفافيش، " +
			"واتخذ اسما مستعارا مستوحى من الخفاش كذلك الأمر.",
			"مسقط رأس باتمان هو مدينة غوثام الخيالية، وهو يتعاون مع عدة شخصيات رئيسية في سلسلة قصصه،" +
			" منها ألفرد بنيوورث خادمه ومدبر منزله، والمفوض جيمس جوردون رئيس شرطة المدينة، وعدد من محاربي الجريمة الآخرين مثل ربيبه روبن.",
			"لا يتمتع باتمان بأي قوة خارقة، وإنما يعتمد على مهاراته التقنية والقتالية العالية، " +
			"وذكائه الذي يصل إلى حد العبقرية، وقدراته التحليلية، وثروته الهائلة، وقوة إرادته.",
			"برزت عبر السنوات عدة شخصيات شريرة مناوئة لباتمان حقق بعضها شهرة واسعة بين محبي وهواة القصص المصورة، يبقى الجوكر أبرزها بلا منازع.",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "parses an Arabic text with Arabic question marks", function() {
		const text = " أنَّ منتخب مصر لكرة القدم" +
			" هو أول منتخب عربي وإفريقي يتأهل لكأس العالم، حيث تأهل للبطولة عام 1934؟ أنَّ النيتروجين يشكل" +
			" 78.08% من الغلاف الجوي؟ أنَّ صلاح الدين الأيوبي هو أول من لُقّب بخادم الحرمين الشريفين؟ أنَّ جامعة" +
			" أنديرا غاندي الوطنية المفتوحة هي أكبر جامعة في العالم من حيث عدد الملتحقين بها؟ أنَّ رفع كساء" +
			" الكعبة (في الصورة) المبطن بالقماش الأبيض في موسم الحج يُفعل لحمايتها من قطعها بآلات حادة للحصول على" +
			" قطع صغيرة طلبا للبركة أو الذكرى؟ أنَّ ليختنشتاين ألغت جيشها في عام 1868 لأنه كان مُكلفًا للغاية لها؟";

		const expected =    [
			"أنَّ منتخب مصر لكرة القدم هو أول منتخب عربي وإفريقي يتأهل لكأس العالم، حيث تأهل للبطولة عام 1934؟",
			"أنَّ النيتروجين يشكل 78.08% من الغلاف الجوي؟",
			"أنَّ صلاح الدين الأيوبي هو أول من لُقّب بخادم الحرمين الشريفين؟",
			"أنَّ جامعة أنديرا غاندي الوطنية المفتوحة هي أكبر جامعة في العالم من حيث عدد الملتحقين بها؟",
			"أنَّ رفع كساء الكعبة (في الصورة) المبطن بالقماش الأبيض في موسم الحج يُفعل لحمايتها " +
			"من قطعها بآلات حادة للحصول على قطع صغيرة طلبا للبركة أو الذكرى؟",
			"أنَّ ليختنشتاين ألغت جيشها في عام 1868 لأنه كان مُكلفًا للغاية لها؟",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "parses a Farsi text", function() {
		const text = "آرامگاه کوروش بزرگ که مقبرهٔ کوروش" +
			" دوم هخامنشی ملقب به کوروش بزرگ یا کوروش کبیر است، بنایی بی‌پیرایه ولی با معماری منحصربه‌فرد،" +
			" در فاصلهٔ حدود یک کیلومتری جنوب غربی کاخ‌های پاسارگاد است. این بنا از همه سوی دشت مرغاب پیداست،" +
			" به‌ویژه اگر از سمت جنوب غربی از راه باستانی گذر کنیم و از تنگهٔ بلاغی وارد دشت شویم، نخستین چیزی" +
			" که جلب توجه می‌کند آرامگاه کوروش است. این اثر در سال ۲۰۰۴ میلادی به عنوان زیر مجموعهٔ پاسارگاد" +
			" تحت شمارهٔ ۱۱۰۶ در میراث جهانی یونسکو ثبت شده‌است. آرامگاه کوروش تنها بنایی در پاسارگاد است که" +
			" توصیف آن در منابع یونانی آمده‌است. از قدیمی‌ترین توصیف‌های مربوط به آرامگاه کوروش می‌توان به توصیف" +
			" اریستوبولوس، یکی از همراهان اسکندر مقدونی در لشکرکشی‌اش به قلمرو هخامنشیان نام برد که توسط آریان" +
			" در کتاب آناباسیس اسکندر بدین شکل ثبت شده‌است: قسمت‌های پایینی آرامگاه از سنگ‌هایی تشکیل شده بود" +
			" که به شکل مربع بریده شده بودند و در کل یک قاعدهٔ مستطیلی شکل را تشکیل می‌دادند. بالای آرامگاه یک" +
			" اتاق سنگی بود که یک سقف و یک در داشت و به قدری باریک بود که یک مرد کوتاه قد به‌سختی می‌توانست داخل" +
			" اتاق شود. در داخل اتاق یک تابوت طلایی وجود داشت که پیکر کوروش را در داخل آن قرار داده بودند." +
			" یک نیمکت نیز با پایه‌هایی از طلا در کنار تابوت قرار داشت. یک پردهٔ بابلی پوشش آن (احتمالاً نیمکت) بود" +
			" و کف اتاق نیز با فرش پوشانده شده بود. یک شنل آستین‌دار و سایر لباس‌های بابلی روی آن قرار" +
			" داشتند. شلوارها و جامه‌های مادی در اتاق یافت می‌شد، بعضی تیره و بعضی به رنگ‌های دیگر بودند. گردن‌بند،" +
			" شمشیر، گوشواره‌های سنگی با تزیینات طلا و یک میز نیز در اتاق بودند. تابوت کوروش بین میز و نیمکت قرار داشت.";

		const expected = [
			"آرامگاه کوروش بزرگ که مقبرهٔ کوروش دوم هخامنشی ملقب به کوروش بزرگ یا کوروش کبیر است، " +
			"بنایی بی‌پیرایه ولی با معماری منحصربه‌فرد، در فاصلهٔ حدود یک کیلومتری جنوب غربی کاخ‌های پاسارگاد است.",
			"این بنا از همه سوی دشت مرغاب پیداست، به‌ویژه اگر از سمت جنوب غربی از راه باستانی گذر کنیم " +
			"و از تنگهٔ بلاغی وارد دشت شویم، نخستین چیزی که جلب توجه می‌کند آرامگاه کوروش است.",
			"این اثر در سال ۲۰۰۴ میلادی به عنوان زیر مجموعهٔ پاسارگاد تحت شمارهٔ ۱۱۰۶ در میراث جهانی یونسکو ثبت شده‌است.",
			"آرامگاه کوروش تنها بنایی در پاسارگاد است که توصیف آن در منابع یونانی آمده‌است.",
			"از قدیمی‌ترین توصیف‌های مربوط به آرامگاه کوروش می‌توان به توصیف اریستوبولوس، یکی از همراهان اسکندر مقدونی " +
			"در لشکرکشی‌اش به قلمرو هخامنشیان نام برد که توسط آریان در کتاب آناباسیس اسکندر بدین شکل ثبت شده‌است: قسمت‌های پایینی " +
			"آرامگاه از سنگ‌هایی تشکیل شده بود که به شکل مربع بریده شده بودند و در کل یک قاعدهٔ مستطیلی شکل را تشکیل می‌دادند.",
			"بالای آرامگاه یک اتاق سنگی بود که یک سقف و یک در داشت و به قدری باریک بود که یک مرد کوتاه قد به‌سختی می‌توانست داخل اتاق شود.",
			"در داخل اتاق یک تابوت طلایی وجود داشت که پیکر کوروش را در داخل آن قرار داده بودند.",
			"یک نیمکت نیز با پایه‌هایی از طلا در کنار تابوت قرار داشت.",
			"یک پردهٔ بابلی پوشش آن (احتمالاً نیمکت) بود و کف اتاق نیز با فرش پوشانده شده بود.",
			"یک شنل آستین‌دار و سایر لباس‌های بابلی روی آن قرار داشتند.",
			"شلوارها و جامه‌های مادی در اتاق یافت می‌شد، بعضی تیره و بعضی به رنگ‌های دیگر بودند.",
			"گردن‌بند، شمشیر، گوشواره‌های سنگی با تزیینات طلا و یک میز نیز در اتاق بودند.",
			"تابوت کوروش بین میز و نیمکت قرار داشت.",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );

	it( "parses an Urdu text", function() {
		const text = "موئن جو دڑو (سندھی:موئن جو دڙو اور اردو میں عموما" +
			"ً موہنجوداڑو بھی؛ انگریزی: Mohenjo-daro) وادی سندھ کی قدیم تہذیب کا ایک مرکز تھا۔ یہ لاڑکانہ سے بیس" +
			" کلومیٹر دور اور سکھر سے 80 کلومیٹر جنوب مغرب میں واقع ہے۔ یہ وادی،وادی سندھ کی تہذیب کے ایک" +
			" اور اہم مرکز ہڑپہ صوبہ پنجاب سے 686 میل دور ہے۔ یہ شہر 2600 قبل مسیح موجود تھا اور 1700 قبل" +
			" مسیح میں نامعلوم وجوہات کی بناء پر ختم ہو گیا۔ تاہم ماہرین کے خیال میں دریائے سندھ کے رخ کی" +
			" تبدیلی، سیلاب، بیرونی حملہ آور یا زلزلہ اہم وجوہات ہوسکتی ہیں۔ اسے قدیم مصر اور بین النہرین" +
			" کی تہذیبوں کا ہم عصر سمجھا جاتا ہے۔ 1980ء میں یونیسکو نے اسے یونیسکو عالمی ثقافتی ورثہ قرار دیا۔";

		const expected =     [
			"موئن جو دڑو (سندھی:موئن جو دڙو اور اردو میں عموماً موہنجوداڑو بھی؛ انگریزی: Mohenjo-daro) وادی سندھ کی قدیم تہذیب کا ایک مرکز تھا۔",
			"یہ لاڑکانہ سے بیس کلومیٹر دور اور سکھر سے 80 کلومیٹر جنوب مغرب میں واقع ہے۔",
			"یہ وادی،وادی سندھ کی تہذیب کے ایک اور اہم مرکز ہڑپہ صوبہ پنجاب سے 686 میل دور ہے۔",
			"یہ شہر 2600 قبل مسیح موجود تھا اور 1700 قبل مسیح میں نامعلوم وجوہات کی بناء پر ختم ہو گیا۔",
			"تاہم ماہرین کے خیال میں دریائے سندھ کے رخ کی تبدیلی، سیلاب، بیرونی حملہ آور یا زلزلہ اہم وجوہات ہوسکتی ہیں۔",
			"اسے قدیم مصر اور بین النہرین کی تہذیبوں کا ہم عصر سمجھا جاتا ہے۔",
			"1980ء میں یونیسکو نے اسے یونیسکو عالمی ثقافتی ورثہ قرار دیا۔",
		];

		const actual = getSentences( text );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "Get sentences from texts that have been processed for the keyphrase distribution assessment", function() {
	it( "parses merged list items containing single words as one sentence", function() {
		const testCases = [
			{
				input: listWordsLowerCaseProcessed,
				expected: [ "apple pear mango" ],
			},
			{
				input: listWordsUpperCaseProcessed,
				expected: [ "Apple Pear Mango" ],
			},
			{
				input: listNestedProcessed,
				expected: [ "jonagold golden delicious pear mango" ],
			},
		];

		testGetSentences( testCases );
	} );

	it( "parses merged list items containing sentences as multiple sentences", function() {
		const testCases = [
			{
				input: listSentencesProcessed,
				expected: [
					"This sentence is about an apple.",
					"This sentence is about a pear.",
					"This sentence is about a mango.",
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing single lower-case words and surrounding text", function() {
		const testCases = [
			{
				input: paragraph1 + listWordsLowerCaseProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"apple pear mango",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing single upper-case words and surrounding text", function() {
		const testCases = [
			{
				input: paragraph1 + listWordsUpperCaseProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"Apple Pear Mango",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing sentences and surrounding text", function() {
		const testCases = [
			{
				input: paragraph1 + listSentencesProcessed + paragraph2,
				expected: [
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					"In sit amet semper sem, id faucibus massa.",
					"This sentence is about an apple.",
					"This sentence is about a pear.",
					"This sentence is about a mango.",
					"Nam sit amet eros faucibus, malesuada purus at, mollis libero.",
					"Praesent at ante sit amet elit sollicitudin lobortis.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing paragraphs", function() {
		const testCases = [
			{
				input: listParagraphsProcessed,
				expected: [
					"This is step 1a of an instruction.",
					"This is step 1b of an instruction.",
					"This is step 2a.",
					"This is step 2b.",
					"This is step 3a.",
					"This is step 3b.",
					"This is step 4a.",
					"This is step 4b.",
				]
				,
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses merged list items containing paragraphs and sentences", function() {
		const testCases = [
			{
				input: listParagraphsAndSentencesProcessed,
				expected: [
					"This is step 1a of an instruction.",
					"This is step 1b of an instruction.",
					"This is the short step 2.",
					"This is the short step 3.",
					"This is step 4a.",
					"This is step 4b.",
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses a processed real world example list including various html tags", function() {
		const testCases = [
			{
				input: realWorldULExample1Processed,
				expected: [
					"Besides all of these great developments, you really should use the block editor now and stop using the classic editor.",
					"Let me give you an overview of simple and clear reasons.",
					"With the block editor:",
					"You will be able to build layouts that you can’t make in TinyMCE.",
					"Most of the stuff we did for our<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\"" +
					">recent digital story</a> required <em>no coding</em>.",
					"Plugins like <a href=\"https://wordpress.org/plugins/grids/\">Grids</a> make it even easier to make very smooth designs.",
					"You can make FAQs and HowTo’s that’ll look awesome in search results.",
					"<span style=\", sans-serif\">Our Yoast SEO Schema blocks are already providing an SEO advantage that is unmatched.",
					"For instance, check out our free <a href=\"https://yoast.com/how-to-build-an-faq-page/\">FAQ</a> and " +
					"<a href=\"https://yoast.com/wordpress/plugins/seo/howto-schema-content-block/\">How-to</a> blocks.",
					"</span> Simple things like images next to paragraphs and other things that could be painful in TinyMCE have become" +
					" so much better in Gutenberg.",
					"Want multiple columns?",
					"You can have them, like that, without extra coding.",
					"Speaking of things you couldn’t do without plugins before: you can now embed tables in your content," +
					" just by adding a table block.",
					"No plugins required.",
					"Creating custom blocks is relatively simple, and allows people to do 90% of the custom things " +
					"they would do with plugins in the past, but easier.",
					"It becomes even easier when you use a plugin like <a href=\"https://www.advancedcustomfields.com/pro/\">ACF Pro</a> or" +
					" <a href=\"https://getblocklab.com\">Block Lab</a> to build those custom blocks.",
					"Custom blocks, or blocks you’ve added with plugins, can be easily found by users just by clicking the + sign in the editor.",
					"Shortcodes, in the classic editor, didn’t have such a discovery method.",
					"Re-usable blocks allow you to easily create content you can re-use across posts or pages, see this <a href=\"https://" +
					"www.wpbeginner.com/beginners-guide/how-to-create-a-reusable-block-in-wordpress/\">nice tutorial on WP Beginner</a>.",
					"There are many more nice features;",
					"please share yours in the comments!",
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses a processed real world example with nested lists; please note: since some list items in this example " +
		"don't end with a full stop, these get incorrectly merged into one sentence with the following list item." +
		"This might lead to false positives when matching keyphrases.", function() {
		const testCases = [
			{
				input: realWorldULExample2Processed,
				expected: [
					"On the <strong>General</strong> tab: Make sure your store address is correct and that you’ve limited selling " +
					"to your country and location Enable or disable tax calculation if needed Enable or disable the use of coupon codes " +
					"if needed Pick the correct currency On the <strong>Product</strong> tab: Select the page where you want the shop " +
					"to appear Want users to leave reviews on your product?",
					"Activate that option here On Inventory: Disable stock management unless you need it On the <strong>Payments</strong> tab: " +
					"Pick an easy payment option, like cash on delivery or bank transfer If needed, you can add more complex payment providers " +
					"like PayPal On the <strong>Accounts</strong> tab: Allow guest checkout Allow account creation if needed Select " +
					"the Privacy policy Review the other options on this page carefully, you may need them On the <strong>Emails</strong> tab: " +
					"Check the different email templates and activate the ones you want to use.",
					"For every email, change the text to match what you want to say Scroll down to check the sender options Also adapt " +
					"the email template to fit your brand Skip the <strong>Integrations</strong> tab On the <strong>Advanced</strong> tab: " +
					"Map the essential pages for your shop, i.e. the cart, checkout, account page and terms and conditions.",
					"You can make these pages in WordPress: Add the `[woocommerce_cart]` shortcode to the cart page Add the " +
					"`[woocommerce_checkout]` shortcode to the checkout page Place the `[woocommerce_my_account]` shortcode to the account page" ],
			},
		];

		testGetSentences( testCases );
	} );
} );
