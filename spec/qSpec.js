/**
 * Created by danny on 3/24/15.
 */
var reqTest = require('../js/analyzer.js');

args = {
    textString: "This is a text for the keyword density test. The keyword is keyword. Not very original, but it is only to test the density of the word keyword",
    keyword: 'keyword'
};

args2 = {
    textString: "dit is een testsstring",
    keyword: 'is',
    queue: ['foo', 'zoiks']
}

describe("analyzer function queueing", function(){
    it("returns default queue", function(){
        textAnalyzer = new Analyzer(args);
        expect(textAnalyzer.queue).toContain("bar");
        expect(textAnalyzer.queue).toContain("zoiks");
        expect(textAnalyzer.queue).toContain("narf");
        expect(textAnalyzer.queue).toContain("foo");
    });

    it("returns custom queue", function(){
        textAnalyzer = new Analyzer(args2);
        expect(textAnalyzer.queue).toContain('foo');
        expect(textAnalyzer.queue).toContain('zoiks');
        expect(textAnalyzer.queue).not.toContain('bar');
        expect(textAnalyzer.queue).not.toContain('narf');
    });

});

describe("analyzer function que", function(){
    it("executes default queue", function(){
        textAnalyzer = new Analyzer(args);
        textAnalyzer.runQ();
        expect(textAnalyzer._output[0].result).toContain('foo output');
    })
});

describe("analyzer function que", function(){
    it("executes default queue", function(){
        textAnalyzer = new Analyzer(args);
        spyOn(textAnalyzer, 'runQ').and.callThrough();
        textAnalyzer.runQ();
        expect(textAnalyzer.runQ).toHaveBeenCalled();
        expect(textAnalyzer.runQ.calls.count()).toBe(5);
    })
});

describe("analyzer function que", function(){
    it("executes default queue", function(){
        textAnalyzer = new Analyzer(args2);
        spyOn(textAnalyzer, 'runQ').and.callThrough();
        textAnalyzer.runQ();
        expect(textAnalyzer.runQ).toHaveBeenCalled();
        expect(textAnalyzer.runQ.calls.count()).toBe(3);
    })
});