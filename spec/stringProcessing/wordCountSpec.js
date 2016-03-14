var Paper = require("../../js/values/Paper.js");
var wordCountFunction = require( "../../js/stringProcessing/countWords.js" );

describe("counts words in a string", function(){
	it("returns the number of words", function(){
		new Paper( "this is a string" )

		expect(wordCountFunction( new Paper( "this is a string" ) ) ).toBe(4);
		expect(wordCountFunction( new Paper( "this is a string, a very nice string." ) ) ).toBe(8);
		expect(wordCountFunction( new Paper( " انتشار کتابی درباره خفن‌ترین آزمایش های تاریخ علم، توجه رسانه‌ها را به خود جلب کردیل‌ها در اسید و دیگر آزمایش‌های خفن عل این عنوان کتابی است که چند") ) ).toBe(28);
		expect(wordCountFunction( new Paper( "<p class='class'>word</p>" ) ) ).toBe(1);
	});
});
