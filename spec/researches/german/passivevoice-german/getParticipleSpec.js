var getParticiples = require("../../../../js/researches/german/passivevoice-german/getParticiples.js");

describe("Test for matching German participles", function(){
	it("returns matched participles with 'ge' at the beginning.", function(){
		var sentence = "Jetzt wird der Mann ins Krankenhaus gebracht.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "gebracht" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ge at beginning" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Jetzt wird der Mann ins Krankenhaus gebracht." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched participles with 'be' in the middle.", function(){
		var sentence = "Es wird vorbereitet.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "vorbereitet" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "er/ver/ent/be/zer/her in the middle" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Es wird vorbereitet." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched participles with 'ge' in the middle.", function(){
		var sentence = "Dem Verletzten wurde ein Verband angelegt.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "angelegt" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ge in the middle" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Dem Verletzten wurde ein Verband angelegt." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched participles with 'er' at the beginning.", function(){
		var sentence = "Das Passiv wurde uns erklärt.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "erklärt" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "er/ver/ent/be/zer/her at beginning" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Das Passiv wurde uns erklärt." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched participles with 'iert'.", function(){
		var sentence = "Das wurde probiert.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "probiert" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "iert at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Das wurde probiert." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns an empty array when there is no participle", function(){
		var sentence = "Yahoo prüfte seitdem den Sachverhalt.";
		var foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [] );
	});
});
