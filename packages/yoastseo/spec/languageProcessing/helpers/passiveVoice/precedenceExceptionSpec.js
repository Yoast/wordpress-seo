import precedenceException from "../../../../src/languageProcessing/helpers/passiveVoice/precedenceException";

describe( "Test to check whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.", () => {
	it( "Returns true if a word from the precedence exception list occurs anywhere in the sentence part before the participle", () => {
		expect( precedenceException( "It's something I've always enjoyed doing",
			"enjoyed", [ "i've", "have", "you'll" ] ) ).toEqual( true );
	} );

	it( "Returns false if a word from the precedence exception list doesn't occur anywhere in the sentence part before the participle", () => {
		expect( precedenceException( "The money was stolen, but nobody has been able to prove it",
			"stolen", [ "i've", "have", "has" ] ) ).toEqual( false );
	} );

	it( "Returns false if there is no precedence exception list available and the sentence contains a participle", () => {
		expect( precedenceException( "It's something I've always enjoyed doing",
			"read" ) ).toEqual( false );
	} );

	it( "Returns false if there is no participle in the sentence", () => {
		expect( precedenceException( "I have a book",
			"read", [ "i've", "have", "you'll" ] ) ).toEqual( false );
	} );

	it( "Returns false if there is no word before the participle in the sentence", () => {
		expect( precedenceException( "Read the book!",
			"read", [ "i've", "have", "you'll" ] ) ).toEqual( false );
	} );
} );
