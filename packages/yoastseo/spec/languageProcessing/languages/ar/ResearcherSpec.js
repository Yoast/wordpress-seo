import Researcher from "../../../../src/languageProcessing/languages/ar/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataAR = getMorphologyData( "ar" );
import sentenceLength from "../../../../src/languageProcessing/languages/ar/config/sentenceLength";

describe( "a test for Arabic Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "checks if the Arabic Researcher still inherit the Abstract Researcher", function() {
		expect( researcher.getResearch( "getParagraphLength" ) ).toEqual( [ { text: "This is another paper!", wordCount: 4 } ] );
	} );

	it( "returns false if the default research is deleted in Arabic Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Arabic Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns true if the Arabic Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns the Arabic function words that are filtered at ending", function() {
		expect( researcher.getConfig( "functionWords" )().filteredAtEnding ).toEqual(
			[ "الأول", "الأولى", "الثاني", "الثانية", "الثالث", "الثالثة", "الرابع", "الرابعة", "الخامس", "الخامسة", "السادس",
				"السادسة", "السابع", "السابعة", "الثامن", "الثامنة", "التاسع", "التاسعة", "العاشر", "العاشرة", "الحادي", "الحادية",
				"العشرون", "الثلاثون", "الأربعون", "الخمسون", "الستون", "السبعون", "الثمانون", "التسعون", "المئة", "المائة", "جيد", "آخر",
				"رائع", "أفضل", "جيدة", "نفس", "فقط", "مجرد", "كبير", "الأفضل", "عظيم", "جميلة", "كبيرة", "رائعة", "جديد", "صغيرة",
				"الصغير", "متأكد", "مهما", "صغير", "جيدا", "الصغيرة", "أكبر", "جديدة", "افضل", "الجديد", "طويلة", "ممكن", "اخر", "طويل",
				"الممكن", "الخاصة", "سيئة", "الكبير", "حقيقي", "بعيدا", "الجيد", "مهم", "الجديدة", "كثير", "الكبيرة", "القليل", "ممتاز",
				"الحقيقي", "سيء", "معا", "قليل", "بعيد", "واضح", "مختلف", "متأكدة", "الصعب", "أسوأ", "حوالي", "كامل", "سيئ", "بالإمكان",
				"بكثير", "خاص", "سوية", "مختلفة", "قريب", "الأخير", "الأخيرة", "الافضل", "خير" ]
		);
	} );

	it( "returns the Arabic first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" )() ).toEqual(
			[ "قليل", "بعض", "واحد", "واحد", "إثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة",
				"هذا", "هذه", "ذلك", "تلك", "هذين", "هذان", "هتين", "هتان", "هؤلا", "أولائك", "هؤلاء" ]
		);
	} );

	it( "returns the Arabic transition words", function() {
		expect( researcher.getConfig( "transitionWords" )().allWords ).toEqual(
			[ "كذلك", "ولكن", "ولذلك", "حاليا", "أخيرا", "بالطبع", "ثم", "بما", "كما", "لما", "إنما", "ليتما", "إما",
				"أينما", "حيثما", "كيفما", "أيما", "أيّما", "بينما", "ممّا", "إلاّ", "ألّا", "لئلّا", "حبّذا", "سيّما", "لكن", "بالتالي",
				"هكذا", "أو", "أم", "لذلك", "مثلا", "تحديدا", "عموما", "لاسيما", "خصوصا", "بالأخص", "خاصة", "بالمثل", "لأن", "بسبب",
				"إذا", "عندما", "حين", "متى", "قبل", "بعد", "منذ", "أيضا", "ريثما", "بين", "إلا إذا", "إلا أن", "إلى آخره",
				"إلى الأبد", "إلى أن", "آن لك أن", "آن له أن", "آن لعلي", "بعد ذلك", "بما أن", "بما فيه", "حتى لا", "حتى لو",
				"عليك أن", "علينا أن", "عليه أن", "عليكم أن", "على محمد أن", "فيما بعد", "لا أحد", "لا بأس أن", "لا بد من", "لا بد من أن",
				"لا سيما", "لا شيء", "لا غير", "لا هذا ولا ذاك", "له أن", "لها أن", "لك أن", "لكم أن", "ما لم", "مع هذا ، مع ذلك",
				"من أجل أن", "من أجلك", "من أجلها", "من أجل سارة", "من أجل اليمن", "من دون ، بدون", "منذ ذلك الحين", "بالإضافة إلى ذلك",
				"في نهاية المطاف", "في الوقت الحالي", "علاوة على ذلك", "أنا أيضا", "بدلا من ذلك", "في الواقع", "بناء على ذلك", "ومع ذلك",
				"في الحقيقة", "من ناحية أخرى", "لا يزال", "وفي الوقت نفسه", "زيادة على ذلك", "زيادة على", "علاوة على", "ما عدا", "مع ذلك",
				"غير أن", "من جهة أخرى", "على عكس ذلك", "نتيجة لذلك", "من ثم", "على سبيل المثال", "على وجه الخصوص", "على وجه التحديد",
				"بصفة عامة", "قبل كل شيء", "في النهاية", "بصورة شاملة", "رغم أن", "مع ان", "على الرغم من", "من هنا", " لهذا السبب",
				"في حالة", "في أقرب وقت", "على أي حال", "في نفس الوقت", "من بين" ]
		);
	} );

	it( "returns the Arabic two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" )() ).toEqual(
			[ [ "لا", "ولا" ], [ "إما", "أو" ], [ "ربما", "ربما" ], [ "حينئذ", "عندئذ" ], [ "إما", "وإما" ], [ "كل من", "و" ] ]
		);
	} );

	it( "returns the Arabic locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "ar" );
	} );

	it( "returns the Arabic passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( false );
	} );

	it( "returns the Arabic basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "الرحمن" ) ).toEqual(
			[ "لالرحمن", "بالرحمن", "الالرحمن", "كالرحمن", "والرحمن", "فالرحمن", "سالرحمن", "أالرحمن", "رحمن", "لرحمن",
				"برحمن", "الرحمن", "كرحمن", "ورحمن", "فرحمن", "سرحمن", "أرحمن" ]
		);
	} );

	it( "returns Arabic sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "stems the Arabic word using the Arabic stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataAR );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "الرحمن" ) ).toEqual( "رحم" );
	} );

	it( "checks if an Arabic sentence is passive or not", function() {
		// Passive verb: يُوازي
		expect( researcher.getHelper( "isPassiveSentence" )( "غير أنه يتعين أن يُوازي ذلك معالجة المسائل العرضية." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "هذا الكتاب كتبه مؤلف مشهور." ) ).toEqual( false );
	} );
} );
