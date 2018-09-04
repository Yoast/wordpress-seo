import Paper from '../../../src/values/Paper.js';

const name = "englishPaper1";

const paper = new Paper( "<p>My husband &#8211; <a href='https://yoast.com/about-us/team/joost-de-valk/'>Joost de Valk</a> &#8211;" +
	"and I often have discussions on how technology will change our day-to-day life. Joost is an early adopter, while I am much slower" +
	"and more reluctant to technological change. Our discussions are pretty heated. So, what&#8217;s Joost&#8217;s opinion on the future" +
	"of voice search? How dominant will voice search be? And how will search be affected by it?" +
	"I interviewed my early-adopting-voice-addict-husband  to shed some light and perspective on the matter of voice search. " +
	"I did some thinking myself as well. Here, I share our views on what the future of voice search could look like. " +
	"<h2>Voice queries make a lot of sense</h2> " +
	"<p>Joost just likes voice. He likes talking to machines. Joost asks Siri to set the timer while he&#8217;s cooking dinner " +
	"and gives orders to Google Home when he wants to listen to some music. So what is it what attracts him in voice search? " +
	"&#8216;I like voice whenever I cannot type,&#8217; Joost answers,  &#8216;So, I use it while I am cooking, or when we are " +
	"in a car together and we have a discussion. Using a voice query is just as easy as typing in a keyword. " +
	"And if you do not have access to a keyboard, voice search is especially useful.&#8217;</p>" +
	"<p>I think Joost is right about that: voice queries just make sense. " +
	"Voice search is easy to use (as long as your voice is recognized properly). " +
	"For most people, speaking to a machine is quicker than typing. " +
	"And, you can use voice search everywhere, even when you&#8217;re doing other things.</p> " +
	"<h2>Voice results do not (always) make sense</h2> " +
	"<p>The results that voice gives us are always singular. Siri will set a timer, Google Home will play the song. " +
	"Joost:  &#8216;Voice results only make sense if you&#8217;re looking for a singular result. If you want to know something specific. " +
	"If you want to end the discussion you&#8217;re having in the car and need to know exactly how many people live in France. " +
	"And also, if you search for a specific restaurant. But if you want to have dinner in a nice restaurant and you&#8217;re not sure which " +
	"one it &#8216;ll be,  you&#8217;ll probably prefer to see some options. And right then and there, is where I think voice results as they work now stop making sense.&#8217;</p> " +
	"<p>I started thinking about that. Most search queries people use are not aimed at a singular result. " +
	"People like to browse. People want to choose. That&#8217;s why physical stores have a lot of options. " +
	"People like to browse through different pairs of jeans before they choose which one they&#8217;ll buy. " +
	"Online, we&#8217;ll probably check out different sites or at least different models before we add a pair of jeans to our shopping cart.</p> " +
	"<p>If you&#8217;re searching for information that is longer than a few sentences, voice result is not very useful either. " +
	"That&#8217;s because it is hard to digest information solely by listening. As a listener, you&#8217;re a very passive receiver of information. " +
	"As a reader,  you can scan a text, you can skip pieces of information or read an important paragraph twice. " +
	"You cannot do that as a listener. As a reader, you&#8217;re much more in control. " +
	"So, if you&#8217;re searching for information about what to do in Barcelona, it makes much more sense to get that information from a book or a screen.</p> " +
	"<h2>Search engines are growing towards singular results</h2> " +
	"<p>Joost thinks that search engines are working towards singular results. They are developing that type of functionality." +
	" &#8216;The answer boxes you see in the search results are an example of that,&#8217; Joost explains. &#8216;" +
	"Search engines are trying to give one single answer to a search query. But, in a lot of the cases, people aren&#8217;t searching for one answer. " +
	"In many cases people want to make a choice, they want to browse.&#8217;</p> <h2>So what will the future bring?</h2> " +
	"<p>&#8216;I think you&#8217;ll see different applications being connected to each other,&#8217; Joost answers when I ask him what the future of voice search will look like. " +
	"&#8216;Siri, for example, would then be connected to your Apple TV. " +
	"Search results and information would appear on the screen closest to you that Apple controls. " +
	"I think voice will become the dominant search query, but I think screens will continue to be important in presenting search results.&#8217;</p>", {
	keyword: "voice search",
	description: "Voice search is gaining popularity. But what will the future bring? Joost and Marieke discuss the pros and cons of voice and describe a possible future scenario.",
	title: "Voice search: what will the future bring?",
	titleWidth: 450,
	locale: "en_EN",
	url: "https://yoast.com/future-of-voice-search/",
} );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy.",
	},
	keyphraseLength: {
		score: 0,
		resultText: "",
	},
	keywordDensity: {
		score: 9,
		resultText: "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 1.3%, which is great; the focus keyword was found 9 times.",
	},
	keywordStopWords: {
		score: 0,
		resultText: "",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "The meta description <a href='https://yoa.st/2pf' target='_blank'>contains the focus keyword</a>.",
	},
	metaDescriptionLength: {
		score: 6,
		resultText: "The <a href='https://yoa.st/2pg' target='_blank'>meta description</a> is over 156 characters. Reducing the length will ensure the entire description will be visible.",
	},
	subheadingsKeyword: {
		score: 6,
		resultText: "You have not used the focus keyword in any <a href='https://yoa.st/2ph' target='_blank'>subheading</a> (such as an H2) in your copy.",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 3,
		resultText: "No <a href='https://yoa.st/2pj' target='_blank'>images</a> appear in this page, consider adding some as appropriate.",
	},
	textLength: {
		score: 9,
		resultText: "The text contains 716 words. This is more than or equal to the <a href='https://yoa.st/2pk' target='_blank'>recommended minimum</a> of 300 words.",
	},
	externalLinks: {
		score: 8,
		resultText: "This page has 0 nofollowed <a href='https://yoa.st/2pl' target='_blank'>outbound link(s)</a> and 1 normal outbound link(s).",
	},
	internalLinks: {
		score: 3,
		resultText: "No <a href='https://yoa.st/2pm' target='_blank'>internal links</a> appear in this page, consider adding some as appropriate.",
	},
	titleKeyword: {
		score: 9,
		resultText: "The <a href='https://yoa.st/2pn' target='_blank'>SEO title</a> contains the focus keyword, at the beginning which is considered to improve rankings.",
	},
	titleWidth: {
		score: 9,
		resultText: "The <a href='https://yoa.st/2po' target='_blank'>SEO title</a> has a nice length.",
	},
	urlKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page.",
	},
	urlLength: {
		score: 6,
		resultText: "The slug for this page is a bit long, consider shortening it.",
	},
	urlStopWords: {
		score: 5,
		resultText: "The slug for this page contains a <a href='http://en.wikipedia.org/wiki/Stop_words' target='_blank'>stop word</a>, consider removing it.",
	},
	largestKeywordDistance: {
		score: 1,
		resultText: "Large parts of your text do not contain the keyword. Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> the keyword more evenly.",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "The copy scores 78.7 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered fairly easy to read. ",
	},
	subheadingsTooLong: {
		score: 9,
		resultText: "Great job with using <a href='https://yoa.st/headings' target='_blank'>subheadings</a>!",
	},
	textParagraphTooLong: {
		score: 3,
		resultText: "1 of the paragraphs contains more than the recommended maximum of 150 words. Are you sure all information is about the same topic, and therefore belongs in one single paragraph?",
	},
	textSentenceLength: {
		score: 9,
		resultText: "4.8% of the sentences contain <a href='https://yoa.st/short-sentences' target='_blank'>more than 20 words</a>, which is less than or equal to the recommended maximum of 25%.",
	},
	textTransitionWords: {
		score: 6,
		resultText: "28.6% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> or phrase, which is less than the recommended minimum of 30%.",
	},
	passiveVoice: {
		score: 9,
		resultText: "7.1% of the sentences contain <a href='https://yoa.st/passive-voice' target='_blank'>passive voice</a>, which is less than or equal to the recommended maximum of 10%.",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 0,
		resultText: "",
	},
};

export default {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
