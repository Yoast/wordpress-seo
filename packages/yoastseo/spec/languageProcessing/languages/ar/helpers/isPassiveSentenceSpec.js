import isPassiveSentence from "../../../../../src/languageProcessing/languages/ar/helpers/isPassiveSentence.js";

describe( "a test for detecting Arabic passive voice in sentences", function() {
	it( "returns active voice", function() {
		expect( isPassiveSentence( "كتب الولد الخطاب." ) ).toBe( false );
	} );

	it( "returns active voice if the sentence contains a word with a damma on the first character but the word is" +
		" shorter than 3 characters long", function() {
		expect( isPassiveSentence( " بدلاً من رميها، يمكنك زرع فص الثوم الذي ينبت على عمق حوالي ١ بوصة في وعاء ٤ بوصات وسقيه." ) ).toBe( false );
	} );

	it( "returns active voice for passive that is identical to its active counterpart without diacritics", function() {
		expect( isPassiveSentence( "غير أنه يتعين أن يوازي ذلك معالجة المسائل العرضية." ) ).toBe( false );
	} );

	it( "returns passive voice for passive that is identical to its active counterpart with a damma on the initial letter", function() {
		// Passive: يُوازي.
		expect( isPassiveSentence( "غير أنه يتعين أن يُوازي ذلك معالجة المسائل العرضية." ) ).toBe( true );
	} );

	it( "returns passive voice if the verb has a damma on the initial letter", function() {
		// Passive: أُنشئت.
		expect( isPassiveSentence( "أُنشئت الشركة في الثمانينيات." ) ).toBe( true );
	} );

	it( "returns passive voice if the verb is in the list of Arabic passive verbs", function() {
		// Passive: تجوهلت
		expect( isPassiveSentence( "والجدير بالذكر أن هذه اقتراحات تجوهلت." ) ).toBe( true );
	} );

	it( "returns passive voice for the verb which is in the list of Arabic passive verbs and gets prefix و", function() {
		// Passive: دعيت preceded by و
		expect( isPassiveSentence( "ودعيت هذه المجموعات للإدلاء بملاحظات ختامية في الجلسة الأخيرة." ) ).toBe( true );
	} );

	it( "returns passive voice for verb that has a damma on the initial letter and gets prefix و", function() {
		// Passive: أُبلغت preceded by و
		expect( isPassiveSentence( " وأُبلغت في اليوم التالي بأن سبب التأجيل هو حالة الحمل." ) ).toBe( true );
	} );
} );
