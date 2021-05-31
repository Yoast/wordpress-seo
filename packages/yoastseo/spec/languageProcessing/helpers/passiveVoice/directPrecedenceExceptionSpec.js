import directPrecedenceException from "../../../../src/languageProcessing/helpers/passiveVoice/directPrecedenceException";

describe( "Test to check whether the participle is directly preceded by a word from the direct precedence exception list.", () => {
	it( "Returns true if the participle is directly preceded by a word from the direct precedence exception list.", () => {
		expect( directPrecedenceException( "I am wiser for having read that book",
			"read", [ "having", "the", "for", "a" ] ) ).toEqual( true );
	} );

	it( "Returns false if there is no precedence exception list available and the sentence contains a participle", () => {
		expect( directPrecedenceException( "I am wiser for having read that book",
			"read" ) ).toEqual( false );
	} );

	it( "Returns false if a word from the precedence exception list doesn't occur directly before the participle", () => {
		expect( directPrecedenceException( "Have I read the book?",
			"read", [ "have", "the", "for", "a" ] ) ).toEqual( false );
	} );

	it( "Returns false if there is no participle in the sentence", () => {
		expect( directPrecedenceException( "I have a book",
			"read", [ "having", "the", "for", "a" ] ) ).toEqual( false );
	} );

	it( "Returns false if there is no word before the participle in the sentence", () => {
		expect( directPrecedenceException( "Read the book!",
			"read", [ "having", "the", "for", "a" ] ) ).toEqual( false );
	} );
} );
