require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");


keywordCountArgs = {
	text: '<img src="plaatje" animation="a bunch of filler texts" alt="keyword" width="100" /> TestText',
	keyword: "keyword"
};

describe("A keyword count test with no keyword in the test, only the alt", function(){
	it("should return no keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(0);
	});
});

keywordCountArgs2 = {
	text: '<img src="plaatje" animation="a bunch of filler texts" alt="keyword" width="100" /> TestText',
	keyword: "width"
};

describe("A keyword count test with no keyword in the test, but keyword is in the tag", function(){
	it("should return no keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs2);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(0);
	});
});

keywordCountArgs3 = {
	text: 'a string with diacritics äbc',
	keyword: "äbc"
};

describe("a keyword with diacritics", function(){
	it("should return 1 keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs3);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(1);
	});
});

keywordCountArgs4 = {
	text: 'a string with a combined word, test123',
	keyword: 'test123'
};

describe("a keyword with combined word", function(){
	it("should return 1 keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs4);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(1);
	});
});

keywordCountArgs5 = {
	text: 'a string with a word and number, test 123',
	keyword: 'test 123'
};

describe("a keyword with combined word", function(){
	it("should return 1 keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs5);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(1);
	});
});

keywordCountArgs6 = {
	text: 'a string with a word and number, test 123',
	keyword: '123'
};

describe("a keyword with only digits", function(){
	it("should return 1 keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs6);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(1);
	});
});

keywordCountArgs7 = {
	text:" انتشار کتابی درباره خفن‌ترین آزمایش های تاریخ علم، توجه رسانه‌ها را به خود جلب کرد.«فیل‌ها در اسید و دیگر آزمایش‌های خفن علمی»؛ این عنوان کتابی است که چند سال پیش منتشر شد. الکس بوز، نویسنده کتاب می‌گوید برای نوشتن آن کلی منابع و آرشیوهای علمی را زیر و رو کرده تا فهرستی از عجیب‌ترین و وحشتناک‌ترین تجربه‌های علمی را ردیف کند. کتاب، داستان واقعی دانشمندانی است که با تلاش زیاد، به دنبال اثبات درک نامتعارفشان از دنیای اطراف بوده‌اند.	چند روز قبل از توزیع کتاب، مجله نیوساینتیست، خلاصه‌ای از آن را چاپ کرد که شامل ۱۰ مورد از تکان‌دهنده‌ترین کارهایی بود که به اسم علم انجام‌شده‌اند. البته پیش از آن، بوز در وبلاگش، یک فهرست ۲۰ موردی را آورده بود. اگر بعد از خواندن فهرست، کمی دود از کله‌تان بلند شد، تعجب نکنید اما به‌هیچ‌وجه به فکر تکرار آزمایش‌ها نیفتید!",
	keyword: "آزمایش"
};

describe("a text in Arabic", function(){
	it("should return 3 matches for the keyword", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs7);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(3);
	});
});