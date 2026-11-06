import getImageIdentifier from "../../../../src/languageProcessing/helpers/image/getImageIdentifier";

describe( "the identifier of an image", () => {
	it( "uses the producer's id when there is one", () => {
		expect( getImageIdentifier( { name: "img", id: 8, attributes: { src: "a.jpg" } } ) ).toBe( 8 );
	} );

	it( "uses the src when the producer sent no id, which is the case for images from the text", () => {
		expect( getImageIdentifier( { name: "img", attributes: { src: "a.jpg" } } ) ).toBe( "a.jpg" );
	} );

	it( "keeps an id of 0, which is a value a producer can legitimately send", () => {
		expect( getImageIdentifier( { name: "img", id: 0, attributes: { src: "a.jpg" } } ) ).toBe( 0 );
	} );

	it( "falls back to the src when the id is null", () => {
		expect( getImageIdentifier( { name: "img", id: null, attributes: { src: "a.jpg" } } ) ).toBe( "a.jpg" );
	} );

	it( "returns an empty string when the image can be identified by nothing at all", () => {
		expect( getImageIdentifier( { name: "img", attributes: {} } ) ).toBe( "" );
	} );
} );
