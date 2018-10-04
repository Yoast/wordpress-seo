import Paper from "../../../src/values/Paper.js";

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
		resultText: "<a href='https://yoa.st/33e' target='_blank'>Keyphrase in introduction</a>: Well done!",
	},
	keyphraseLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/33i' target='_blank'>Keyphrase length</a>: Good job!",
	},
	keywordDensity: {
		score: 9,
		resultText: "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 1.3%, which is great; the focus keyword was found 9 times.",
	},
	metaDescriptionKeyword: {
		score: 9,
		resultText: "<a href='https://yoa.st/33k' target='_blank'>Key phrase in meta description</a>: Focus key phrase or synonym appear in the meta description. Well done!",
	},
	metaDescriptionLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/34d' target='_blank'>Meta description length</a>: The meta description is over 156 characters. To ensure the entire description will be visible, <a href='https://yoa.st/34e' target='_blank'>you should reduce the length</a>!",
	},
	subheadingsKeyword: {
		score: 3,
		resultText: "<a href='https://yoa.st/33m' target='_blank'>Keyphrase in subheading</a>: <a href='https://yoa.st/33n' target='_blank'>Use more keywords or synonyms in your subheadings</a>!",
	},
	textCompetingLinks: {
		score: 0,
		resultText: "",
	},
	textImages: {
		score: 3,
		resultText: "<a href='https://yoa.st/33c' target='_blank'>Image alt attributes</a>: No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!",
	},
	textLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 716 words. Good job!",
	},
	externalLinks: {
		score: 8,
		resultText: "<a href='https://yoa.st/34f' target='_blank'>Outbound links</a>: Good job!",
	},
	internalLinks: {
		score: 3,
		resultText: "<a href='https://yoa.st/33z' target='_blank'>Internal links</a>: No internal links appear in this page, <a href='https://yoa.st/34a' target='_blank'>make sure to add some</a>!",
	},
	titleKeyword: {
		score: 9,
		resultText: "The exact match of the focus keyphrase appears at the beginning of the <a href='https://yoa.st/2pn' target='_blank'>SEO title</a>, which is considered to improve rankings.",
	},
	titleWidth: {
		score: 9,
		resultText: "<a href='https://yoa.st/34h' target='_blank'>SEO title width</a>: Good job!",
	},
	urlKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pp' target='_blank'>URL</a> for this page.",
	},
	urlLength: {
		score: 6,
		resultText: "<a href='https://yoa.st/35b' target='_blank'>Slug too long</a>: the slug for this page is a bit long. <a href='https://yoa.st/35c' target='_blank'>Shorten it</a>!",
	},
	urlStopWords: {
		score: 5,
		resultText: "<a href='https://yoa.st/34p' target='_blank'>Slug stopwords</a>: The slug for this page contains a stop word. <a href='https://yoa.st/34q' target='_blank'>Remove it</a>!",
	},
	largestKeywordDistance: {
		score: 1,
		resultText: "Large parts of your text do not contain the keyword. Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> the keyword more evenly.",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 78.7 in the test, which is considered fairly easy to read. Good job!",
	},
	subheadingsTooLong: {
		score: 9,
		resultText: "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!",
	},
	textParagraphTooLong: {
		score: 3,
		resultText: "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs contains more than the recommended maximum of 150 words." +
		" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!",
	},
	textSentenceLength: {
		score: 9,
		resultText: "<a href='https://yoa.st/34v' target='_blank'>Sentence length</a>: Great!",
	},
	textTransitionWords: {
		score: 6,
		resultText: "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Only 28.6% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' target='_blank'>Use more of them</a>.",
	},
	passiveVoice: {
		score: 9,
		resultText: "<a href='https://yoa.st/34t' target='_blank'>Passive voice</a>: You're using enough active voice. That's great!",
	},
	textPresence: {
		score: 0,
		resultText: "",
	},
	sentenceBeginnings: {
		score: 9,
		resultText: "<a href='https://yoa.st/35f' target='_blank'>Consecutive sentences</a>: There is enough variety in your sentences. That's great!",
	},
};

export {
	name,
	paper,
	expectedResults,
};

export default {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
