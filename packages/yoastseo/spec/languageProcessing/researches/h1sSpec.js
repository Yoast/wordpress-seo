import h1s from "../../../src/languageProcessing/researches/h1s.js";
import Paper from "../../../src/values/Paper.js";
import buildTree from "../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";

describe( "Gets all H1s in the text", function() {
	it( "should return empty when there is no H1", function() {
		const mockPaper = new Paper( "<p>some content<h2>content h2</h2></p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( h1s( mockPaper ) ).toEqual( [] );
	} );

	it( "should return empty when there is only empty H1s", function() {
		const mockPaper = new Paper( "some content<h1></h1> other content <h1></h1>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [] );
	} );

	it( "should return one object when there is one H1", function() {
		const mockPaper = new Paper( "<h1>first h1</h1>some content<h2>content h2</h2>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );
		expect( h1s( mockPaper ) ).toEqual( [ { tag: "h1", content: "first h1", position: { startOffset: 4, endOffset: 12, clientId: "" } } ] );
	} );

	it( "should return all H1s in the text", function() {
		const mockPaper = new Paper( "<h1>first h1</h1><p>not an h1</p><h1>second h1</h1><h2>not an h1</h2>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "first h1", position: { startOffset: 4, endOffset: 12, clientId: "" } },
			{ tag: "h1", content: "second h1", position: { startOffset: 37, endOffset: 46, clientId: "" } },
		] );
	} );

	it( "should return two h1s next to each other", function() {
		const mockPaper = new Paper( "<h1>first h1</h1><h1>second h1</h1><h2>not an h1</h2>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "first h1", position: { startOffset: 4, endOffset: 12, clientId: "" } },
			{ tag: "h1", content: "second h1", position: { startOffset: 21, endOffset: 30, clientId: "" } },
		] );
	} );

	it( "should rightly ignore empty paragraphs or empty blocks", function() {
		const mockPaper = new Paper( "<p></p>\n<h1>first h1</h1><h1>second h1</h1><h2>not an h1</h2>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "first h1", position: { startOffset: 12, endOffset: 20, clientId: "" } },
			{ tag: "h1", content: "second h1", position: { startOffset: 29, endOffset: 38, clientId: "" } },
		] );
	} );

	it( "should find H1 within division tags", function() {
		const mockPaper = new Paper( "<div><h1>first h1</h1></div><div><p>blah blah</p></div><div><h1>second h1</h1></div>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "first h1", position: { startOffset: 9, endOffset: 17, clientId: "" } },
			{ tag: "h1", content: "second h1", position: { startOffset: 64, endOffset: 73, clientId: "" } },
		] );
	} );

	it( "should perform well, even on longer texts.", function() {
		const mockPaper = new Paper( "<h1>Voice Search</h1>" +
			"<p>My husband &#8211; <a href='https://yoast.com/about-us/team/joost-de-valk/'>Joost de Valk</a> &#8211;" +
			"and I often have discussions on how technology will change our day-to-day life. Joost is an early adopter, " +
			"while I am much slower" +
			"and more reluctant to technological change. Our discussions are pretty heated. So, what&#8217;s " +
			"Joost&#8217;s opinion on the future" +
			"of voice search? How dominant will voice search be? And how will search be affected by it?" +
			"I interviewed my early-adopting-voice-addict-husband  to shed some light and perspective on " +
			"the matter of voice search. " +
			"I did some thinking myself as well. Here, I share our views on what the future of voice search could " +
			"look like. " +
			"<h2>Voice queries make a lot of sense</h2> " +
			"<p>Joost just likes voice. He likes talking to machines. Joost asks Siri to set the timer " +
			"while he&#8217;s cooking dinner " +
			"and gives orders to Google Home when he wants to listen to some music. " +
			"So what is it what attracts him in voice search? " +
			"&#8216;I like voice whenever I cannot type,&#8217; Joost answers,  &#8216;So, " +
			"I use it while I am cooking, or when we are " +
			"in a car together and we have a discussion. Using a voice query is just as easy as typing in a keyword. " +
			"And if you do not have access to a keyboard, voice search is especially useful.&#8217;</p>" +
			"<p>I think Joost is right about that: voice queries just make sense. " +
			"Voice search is easy to use (as long as your voice is recognized properly). " +
			"For most people, speaking to a machine is quicker than typing. " +
			"And, you can use voice search everywhere, even when you&#8217;re doing other things.</p> " +
			"<h2>Voice results do not (always) make sense</h2> " +
			"<p>The results that voice gives us are always singular. Siri will set a timer, " +
			"Google Home will play the song. " +
			"Joost:  &#8216;Voice results only make sense if you&#8217;re looking for a singular result. " +
			"If you want to know something specific. " +
			"If you want to end the discussion you&#8217;re having in the car and need to know exactly " +
			"how many people live in France. " +
			"And also, if you search for a specific restaurant. But if you want to have dinner in a nice " +
			"restaurant and you&#8217;re not sure which " +
			"one it &#8216;ll be,  you&#8217;ll probably prefer to see some options. And right then and there, " +
			"is where I think voice results as they work now stop making sense.&#8217;</p> " +
			"<p>I started thinking about that. Most search queries people use are not aimed at a singular result. " +
			"People like to browse. People want to choose. That&#8217;s why physical stores have a lot of options. " +
			"People like to browse through different pairs of jeans before they choose which one they&#8217;ll buy. " +
			"Online, we&#8217;ll probably check out different sites or at least different models before we add a " +
			"pair of jeans to our shopping cart.</p> " +
			"<p>If you&#8217;re searching for information that is longer than a few sentences, voice result is " +
			"not very useful either. " +
			"That&#8217;s because it is hard to digest information solely by listening. As a listener, " +
			"you&#8217;re a very passive receiver of information. " +
			"As a reader,  you can scan a text, you can skip pieces of information or read an important paragraph twice. " +
			"You cannot do that as a listener. As a reader, you&#8217;re much more in control. " +
			"So, if you&#8217;re searching for information about what to do in Barcelona, " +
			"it makes much more sense to get that information from a book or a screen.</p> " +
			"<h2>Search engines are growing towards singular results</h2> " +
			"<p>Joost thinks that search engines are working towards singular results. " +
			"They are developing that type of functionality." +
			" &#8216;The answer boxes you see in the search results are an example of that,&#8217; Joost explains. &#8216;" +
			"Search engines are trying to give one single answer to a search query. But, in a lot of the cases, " +
			"people aren&#8217;t searching for one answer. " +
			"In many cases people want to make a choice, they want to browse.&#8217;</p> " +
			"<h1>So what will the future bring?</h1> " +
			"<p>&#8216;I think you&#8217;ll see different applications being connected to each other,&#8217; " +
			"Joost answers when I ask him what the future of voice search will look like. " +
			"&#8216;Siri, for example, would then be connected to your Apple TV. " +
			"Search results and information would appear on the screen closest to you that Apple controls. " +
			"I think voice will become the dominant search query, but I think screens will continue to be " +
			"important in presenting search results.&#8217;</p>" );

		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "Voice Search", position: { startOffset: 4, endOffset: 16, clientId: "" } },
			{ tag: "h1", content: "So what will the future bring?", position: { startOffset: 3903, endOffset: 3933, clientId: "" } },
		] );
	} );
} );
