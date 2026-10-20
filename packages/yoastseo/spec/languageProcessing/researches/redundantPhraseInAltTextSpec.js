import redundantPhraseInAltText from "../../../src/languageProcessing/researches/redundantPhraseInAltText";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import SpanishResearcher from "../../../src/languageProcessing/languages/es/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import DutchResearcher from "../../../src/languageProcessing/languages/nl/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import CzechResearcher from "../../../src/languageProcessing/languages/cs/Researcher";
import GreekResearcher from "../../../src/languageProcessing/languages/el/Researcher";
import ArabicResearcher from "../../../src/languageProcessing/languages/ar/Researcher";
import FarsiResearcher from "../../../src/languageProcessing/languages/fa/Researcher";
import IndonesianResearcher from "../../../src/languageProcessing/languages/id/Researcher";
import ItalianResearcher from "../../../src/languageProcessing/languages/it/Researcher";
import HungarianResearcher from "../../../src/languageProcessing/languages/hu/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import NorwegianResearcher from "../../../src/languageProcessing/languages/nb/Researcher";
import HebrewResearcher from "../../../src/languageProcessing/languages/he/Researcher";
import TurkishResearcher from "../../../src/languageProcessing/languages/tr/Researcher";
import SwedishResearcher from "../../../src/languageProcessing/languages/sv/Researcher";
import SlovakResearcher from "../../../src/languageProcessing/languages/sk/Researcher";
import RussianResearcher from "../../../src/languageProcessing/languages/ru/Researcher";
import PortugueseResearcher from "../../../src/languageProcessing/languages/pt/Researcher";
import PolishResearcher from "../../../src/languageProcessing/languages/pl/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";

const buildSrc = ( index ) => `https://example.com/image-${ index }.jpg`;

/**
 * Builds a Paper with the given images in its text and parses it, so the images end up in the tree.
 *
 * @param {string[]} altTexts The alt text of each image to put in the text.
 *
 * @returns {Paper} The parsed paper.
 */
const buildPaperWithImages = ( altTexts ) => {
	const text = altTexts.map( ( alt, index ) => `<img src='${ buildSrc( index ) }' alt='${ alt }' />` ).join( "" );
	const paper = new Paper( text );
	buildTree( paper, new Researcher( paper ) );

	return paper;
};

/**
 * Runs the research with an English researcher, so the English phrases apply.
 *
 * @param {Paper} paper The paper to run the research on.
 *
 * @returns {{count: number, flagged: Array<string|number>}} The research result.
 */
const research = ( paper ) => redundantPhraseInAltText( paper, new Researcher( paper ) );

describe( "a research that counts the images whose alt text starts with a redundant phrase", () => {
	it( "counts no images when the paper has no images", () => {
		expect( research( buildPaperWithImages( [] ) ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "does not count an image without alt text", () => {
		const paper = new Paper( "<img src='https://example.com/image.jpg' /><img src='https://example.com/image.jpg' alt='' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( research( paper ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Image of a dog" ],
		[ "picture of a dog" ],
		[ "An image of a dog" ],
		[ "a picture showing a cat" ],
		[ "image depicting the results" ],
		[ "An image that shows the office" ],
		[ "A picture which shows the office" ],
		[ "a picture that depicts the harbour" ],
		[ "An image which depicts the process" ],
		[ "an image portraying the city" ],
		[ "A picture that portrays the mood" ],
		[ "image which portrays the artist" ],
		[ "The image shows a dog" ],
		[ "The picture portrays a storm" ],
		[ "this picture shows the office" ],
		[ "The picture depicts a sunset" ],
		[ "This image depicts a sunset" ],
		[ "IMAGE OF A DOG, because the phrase is matched case-insensitively" ],
		[ "Image of" ],
	] )( "counts an alt text starting with \"%s\"", ( altText ) => {
		expect( research( buildPaperWithImages( [ altText ] ) ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "A dog in front of a picture of a cat", "the phrase is not at the start" ],
		[ "Images of dogs", "only the listed nouns match" ],
		[ "Graphic of the results", "\"graphic\" is not one of the listed nouns" ],
		[ "Image offering details", "the connector has to end on a word boundary" ],
		[ "The image showstopper", "the finite verb has to end on a word boundary" ],
		[ "Imagery of war", "the noun has to end before the whitespace" ],
		[ "The image of a sunset", "a definite determiner only combines with the finite verbs" ],
		[ "This picture showing a cat", "a definite determiner only combines with the finite verbs" ],
		[ "Image shows a dog", "a finite verb requires a definite determiner" ],
		[ "An image shows a dog", "a finite verb requires a definite determiner" ],
		[ "Dog photographed in the park", "there is no redundant opening at all" ],
	] )( "does not count the alt text \"%s\": %s", ( altText ) => {
		expect( research( buildPaperWithImages( [ altText ] ) ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "counts an alt text with surrounding whitespace, because `getAltAttribute` strips it", () => {
		expect( research( buildPaperWithImages( [ "  Image of a dog  " ] ) ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it( "counts only the images whose alt text starts with a redundant phrase", () => {
		const paper = buildPaperWithImages( [ "Image of a dog", "A dog catching a frisbee", "Picture of a cat" ] );

		expect( research( paper ) ).toEqual( { count: 2, flagged: [ buildSrc( 0 ), buildSrc( 2 ) ] } );
	} );

	it( "counts the paper's provided images instead of the text when the producer opts in", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='Image of a dog' />", {
			providedImages: [
				{ src: "https://example.com/featured.jpg", alt: "Picture of  a red mug" },
				{ src: "https://example.com/gallery.jpg", alt: "A red mug on a desk" },
			],
		} );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [ "https://example.com/featured.jpg" ] } );
	} );

	it( "reports the producer's id when it sends one, so a consumer can match the image to its own data", () => {
		const paper = new Paper( "", {
			providedImages: [
				{ id: 8, src: "https://example.com/featured.jpg", alt: "Image of a red mug" },
				{ id: 12, src: "https://example.com/gallery.jpg", alt: "A red mug on a desk" },
			],
		} );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [ 8 ] } );
	} );

	it( "lists one identifier for images in the text that share a src, while still counting both", () => {
		const paper = new Paper( "<img src='a.jpg' alt='Image of a dog' /><img src='a.jpg' alt='Picture of a dog' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( research( paper ) ).toEqual( { count: 2, flagged: [ "a.jpg" ] } );
	} );

	it( "counts an image that carries neither an id nor a src, but cannot flag it", () => {
		const paper = new Paper( "", { providedImages: [ { alt: "Image of a red mug" } ] } );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [] } );
	} );

	it( "counts nothing when the producer opts in with an empty list of provided images", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='Image of a dog' />", { providedImages: [] } );

		expect( research( paper ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Spanish", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Spanish researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInSpanish = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt='${ altText }' />` );
		const researcher = new SpanishResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Imagen de un perro", "image of a dog" ],
		[ "una foto del parque", "a photo of the park" ],
		[ "Una imagen que representa la paz", "an image that represents peace" ],
		[ "foto que muestra el parque", "photo that shows the park" ],
		[ "Imagen mostrando el proceso", "image showing the process" ],
		[ "una foto representando la escena", "a photo representing the scene" ],
		[ "imagen en la que se ve el parque", "image in which the park is seen" ],
		[ "Una foto en la que aparece el equipo", "a photo in which the team appears" ],
		[ "Imagen en la que aparecen los niños", "image in which the children appear" ],
		[ "foto donde se ve la plaza", "photo where the square is seen" ],
		[ "La imagen representa la paz", "the image represents peace" ],
		[ "la foto muestra el parque", "the photo shows the park" ],
		[ "Esta imagen muestra el parque", "this image shows the park" ],
		[ "esta foto representa la paz", "this photo represents peace" ],
		[ "En la imagen se ve un perro", "in the image a dog is seen" ],
		[ "en la foto aparece el equipo", "in the photo the team appears" ],
		[ "En la imagen se observa el crecimiento", "in the image the growth is observed" ],
		[ "En la foto aparecen los niños", "in the photo the children appear" ],
		[ "en la imagen se ven las montañas", "in the image the mountains are seen" ],
		[ "En la foto se observan cambios", "in the photo changes are observed" ],
		[ "una foto en la que se ven los niños", "a photo in which the children are seen" ],
		[ "imagen donde se ven las plazas", "image where the squares are seen" ],
		[ "Imagen de fondos de inversión, because an excepted compound ends at a word boundary", "image of investment funds" ],
		[ "Foto de marca de ropa, because the exceptions are scoped per noun", "photo of a clothing brand" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInSpanish( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "La imagen de un perro", "the image of a dog", "a definite determiner only combines with the finite verbs" ],
		[ "Una imagen muestra el parque", "an image shows the park", "a finite verb requires a definite determiner" ],
		[ "Fotografía del parque", "photograph of the park", "\"fotografía\" is not one of the listed nouns" ],
		[ "En la imagen se venden coches", "in the image cars are sold", "the verb has to end on a word boundary" ],
		[ "La imagen muestran los resultados", "the image show the results", "a verb agreeing with the image is only listed in singular" ],
		[ "Una imagen que representan los valores", "an image that represent the values", "a verb agreeing with the image is only listed in singular" ],
		[ "Un perro delante de una foto de un gato", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInSpanish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Foto de perfil de Juan", "Juan's profile photo" ],
		[ "una foto de portada del álbum", "a cover photo of the album" ],
		[ "Foto de archivo de la guerra", "archive photo of the war" ],
		[ "foto de fondo de pantalla", "wallpaper background photo" ],
		[ "Foto de satélite de la tormenta", "satellite photo of the storm" ],
		[ "Imagen de perfil de la empresa", "the company's profile image" ],
		[ "una imagen de portada del libro", "a cover image of the book" ],
		[ "Imagen de fondo para el sitio", "background image for the site" ],
		[ "imagen de marca de la empresa", "the company's brand image" ],
		[ "Imagen de archivo del evento", "archive image of the event" ],
		[ "imagen de satélite de la tormenta", "satellite image of the storm" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInSpanish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "does not flag Spanish phrases (\"Imagen de un perro\" — image of a dog) for an English researcher", () => {
		expect( research( buildPaperWithImages( [ "Imagen de un perro" ] ) ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for French", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a French researcher.
	 *
	 * The alt attribute is double-quoted so alt texts with a straight apostrophe (l'image) stay intact.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInFrench = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new FrenchResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Photo de la montagne", "photo of the mountain" ],
		[ "une image du parc", "an image of the park" ],
		[ "image des montagnes", "image of the mountains" ],
		[ "photo d’un chien, with a typographic apostrophe", "photo of a dog" ],
		[ "Une photo d'un chien, with a straight apostrophe", "a photo of a dog" ],
		[ "Photo d'élèves en classe, with a straight apostrophe before an accented letter", "photo of pupils in class" ],
		[ "Image d’élite nationale, with a typographic apostrophe before an accented letter", "image of the national elite" ],
		[ "Image représentant le processus", "image representing the process" ],
		[ "une photo montrant la scène", "a photo showing the scene" ],
		[ "image qui montre le parc", "image that shows the park" ],
		[ "Une photo qui représente la paix", "a photo that represents peace" ],
		[ "photo contenant des fleurs", "photo containing flowers" ],
		[ "L’image représente la paix", "the image represents peace" ],
		[ "l'image montre le parc", "the image shows the park" ],
		[ "La photo montre le parc", "the photo shows the park" ],
		[ "cette image montre le parc", "this image shows the park" ],
		[ "Cette photo représente la paix", "this photo represents peace" ],
		[ "Sur l’image, on voit un chien", "in the image, one sees a dog" ],
		[ "sur la photo on voit les enfants", "in the photo one sees the children" ],
		[ "On voit sur l’image un chien", "one sees in the image a dog" ],
		[ "on voit sur la photo les enfants", "one sees in the photo the children" ],
		[ "Image de fondations en béton, because an excepted compound ends at a word boundary", "image of concrete foundations" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInFrench( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "La photo de la montagne", "the photo of the mountain", "a definite determiner only combines with the finite verbs" ],
		[ "L’image des montagnes", "the image of the mountains", "a definite determiner only combines with the finite verbs" ],
		[ "Une image montre le parc", "an image shows the park", "a finite verb requires a definite determiner" ],
		[ "Photographie du parc", "photograph of the park", "\"photographie\" is not one of the listed nouns" ],
		[ "La photo montrera la scène", "the photo will show the scene", "the finite verb has to end on a word boundary" ],
		[ "Un chien devant une photo d’un chat", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInFrench( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Photo de profil de Juan", "Juan's profile photo" ],
		[ "une photo d’identité au format officiel", "an ID photo in the official format" ],
		[ "Photo d'identité au format officiel", "ID photo in the official format" ],
		[ "Image de marque de l’entreprise", "the company's brand image" ],
		[ "une image de fond pour le site", "a background image for the site" ],
		[ "Image d’archives du match", "archive image of the match" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInFrench( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Dutch", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Dutch researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInDutch = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt='${ altText }' />` );
		const researcher = new DutchResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Afbeelding van een hond", "image of a dog" ],
		[ "een foto van het park", "a photo of the park" ],
		[ "Een afbeelding die een hond voorstelt", "an image that depicts a dog; literally: an image that a dog depicts" ],
		[ "foto die de resultaten weergeeft", "photo that renders the results" ],
		[ "een afbeelding die het proces toont", "an image that shows the process" ],
		[ "Een foto waarop een hond te zien is", "a photo on which a dog can be seen" ],
		[ "afbeelding waarop te zien is hoe het werkt", "image on which can be seen how it works" ],
		[ "De afbeelding beeldt een hond af", "the image portrays a dog; with the verb split as beeldt … af" ],
		[ "deze foto beeldt de situatie af", "this photo portrays the situation" ],
		[ "de foto stelt een hond voor", "the photo depicts a dog" ],
		[ "Deze afbeelding stelt het proces voor", "this image depicts the process" ],
		[ "De afbeelding toont het park", "the image shows the park" ],
		[ "deze foto toont de resultaten", "this photo shows the results" ],
		[ "De foto laat de resultaten zien", "the photo shows the results" ],
		[ "Deze foto laat de resultaten zien", "this photo shows the results" ],
		[ "de afbeelding laat zien hoe het werkt", "the image shows how it works" ],
		[ "De foto laat o.a. de resultaten zien, with an abbreviation inside the gap", "the photo shows a.o. the results" ],
		[ "Op de afbeelding is een hond te zien", "in the image a dog can be seen" ],
		[ "op de foto is te zien hoe het werkt", "in the photo can be seen how it works" ],
		[ "Op de afbeelding zie je een hond", "in the image you see a dog" ],
		[ "op de foto zie je de resultaten", "in the photo you see the results" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInDutch( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "De afbeelding van een hond", "the image of a dog", "a definite determiner only combines with the finite verbs" ],
		[ "Een afbeelding toont het park", "an image shows the park", "a finite verb requires a definite determiner" ],
		[ "Fotograaf in het park", "photographer in the park", "\"fotograaf\" is not one of the listed nouns" ],
		[ "Een foto die mijn oma heeft gemaakt", "a photo that my grandma took", "the relative clause does not end on one of the listed verbs" ],
		[ "De afbeelding toonde het park", "the image showed the park", "the finite verb has to end on a word boundary" ],
		[ "Een hond voor een foto van een kat", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
		[ "Een foto die mijn oma maakte. Dit kunstwerk toont haar liefde voor kleur",
			"a photo my grandma took. This artwork shows her love of colour", "a gap does not run across a sentence boundary" ],
		[ "De afbeelding beeldt een hond uit. Af en toe zie je ook een kat",
			"the image portrays a dog. Now and then you also see a cat", "a gap does not run across a sentence boundary" ],
		[ "De foto laat je koud, zoals je zelf kunt zien", "the photo leaves you cold, as you can see for yourself",
			"a gap does not run across a comma" ],
		[ "De afbeelding laat zich moeilijk omschrijven, maar je moet haar zien",
			"the image is hard to describe, but you have to see it", "a gap does not run across a comma" ],
		[ "De foto laat, zoals gezegd, de resultaten zien", "the photo shows, as said, the results",
			"a genuine opening with a parenthetical in the gap is the known trade-off of the comma restriction" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInDutch( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for German", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a German researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInGerman = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new GermanResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Bild eines Hundes", "image of a dog" ],
		[ "ein Bild einer Frau", "an image of a woman" ],
		[ "Bild des Parks", "image of the park" ],
		[ "Ein Bild der Stadt", "an image of the city" ],
		[ "Bild von einem Hund", "image of a dog" ],
		[ "ein Bild vom Spielplatz", "an image of the playground" ],
		[ "Abbildung eines Motors", "illustration of an engine" ],
		[ "eine Abbildung des Aufbaus", "an illustration of the structure" ],
		[ "Abbildung von Zellen", "illustration of cells" ],
		[ "Eine Abbildung vom Aufbau", "an illustration of the structure" ],
		[ "Die Abbildung zeigt den Aufbau", "the illustration shows the structure" ],
		[ "diese Abbildung stellt den Motor dar", "this illustration depicts the engine" ],
		[ "eine Abbildung, die den Prozess darstellt", "an illustration that depicts the process" ],
		[ "Abbildung die den Aufbau zeigt, without the comma before the relative clause", "illustration that shows the structure" ],
		[ "Abbildung, auf der die Familie zu sehen ist", "illustration on which the family can be seen" ],
		[ "Auf der Abbildung ist der Motor zu sehen", "in the illustration the engine can be seen" ],
		[ "auf der Abbildung sieht man den Motor", "in the illustration one sees the engine" ],
		[ "Ein Bild, das einen Hund darstellt", "an image that depicts a dog; literally: an image that a dog depicts" ],
		[ "Bild das den Aufbau zeigt, without the comma before the relative clause", "image that shows the structure" ],
		[ "ein Bild, das zeigt, wie es funktioniert", "an image that shows how it works" ],
		[ "Bild, auf dem ein Hund zu sehen ist", "image on which a dog can be seen" ],
		[ "Bild auf dem ein Hund zu sehen ist, without the comma before the relative clause", "image on which a dog can be seen" ],
		[ "Ein Bild, auf dem die Familie zu sehen ist", "an image on which the family can be seen" ],
		[ "Das Bild stellt einen Hund dar", "the image depicts a dog; with the verb split as stellt … dar" ],
		[ "dieses Bild stellt die Lage dar", "this image depicts the situation" ],
		[ "Das Bild zeigt den Park", "the image shows the park" ],
		[ "dieses Bild zeigt die Ergebnisse", "this image shows the results" ],
		[ "Auf dem Bild ist ein Hund zu sehen", "in the image a dog can be seen" ],
		[ "auf dem Bild ist zu sehen, wie es funktioniert", "in the image can be seen how it works" ],
		[ "Auf dem Bild sieht man einen Hund", "in the image one sees a dog" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInGerman( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Das Bild eines Hundes", "the image of a dog", "a definite determiner only combines with the finite verbs" ],
		[ "Ein Bild zeigt den Park", "an image shows the park", "a finite verb requires a definite determiner" ],
		[ "Das Abbildung zeigt den Aufbau", "the(neuter) illustration shows the structure", "a determiner only combines with the noun of its gender" ],
		[ "Bild, die den Aufbau zeigt", "image, that(feminine) shows the structure", "a relative pronoun only combines with the noun of its gender" ],
		[ "Auf der Bild ist der Motor zu sehen", "in the(feminine) image the engine can be seen",
			"a prepositional article only combines with the noun of its gender" ],
		[ "Bilderbuch von Janosch", "picture book by Janosch", "\"Bilderbuch\" is not one of the listed nouns" ],
		[ "Das Bild zeigte den Park", "the image showed the park", "the finite verb has to end on a word boundary" ],
		[ "Ein Bild auf dem Regal ist zu sehen", "a picture on the shelf is visible",
			"the locative main clause orders the verb as \"ist zu sehen\", not the relative clause's \"zu sehen ist\"" ],
		[ "Ein Bild, das mir gefällt, weil es viel zeigt", "an image that I like, because it shows a lot", "a gap does not run across a comma" ],
		[ "Ein Bild, das ich mag. Es zeigt den Park", "an image that I like. It shows the park", "a gap does not run across a sentence boundary" ],
		[ "Ein Hund vor einem Bild von einer Katze", "a dog in front of an image of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInGerman( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Czech", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Czech researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInCzech = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new CzechResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Obrázek psa", "picture of a dog" ],
		[ "obraz krajiny", "image of a landscape" ],
		[ "Fotka našeho týmu", "photo of our team" ],
		[ "fotografie západu slunce", "photograph of a sunset" ],
		[ "Obrázek čtverce, with an accented letter starting the following word", "picture of a square" ],
		[ "Obrázek iPhonu, with the following word in another script", "picture of an iPhone" ],
		[ "Obrázek sedmi trpaslíků, because \"se\" only excepts the whole word", "picture of seven dwarfs" ],
		[ "Obraz odvážného rytíře, because \"od\" only excepts the whole word", "image of a brave knight" ],
		[ "Tento obrázek zobrazuje proces", "this picture depicts the process" ],
		[ "tento obraz ukazuje krajinu", "this image shows the landscape" ],
		[ "Tento obrázek znázorňuje postup", "this picture illustrates the procedure" ],
		[ "Tato fotka zobrazuje tým", "this photo depicts the team" ],
		[ "Tato fotka znázorňuje tým", "this photo illustrates the team" ],
		[ "tato fotka ukazuje výsledky", "this photo shows the results" ],
		[ "Na obrázku je pes", "in the picture there is a dog" ],
		[ "na tomto obrázku jsou děti", "in this picture there are children" ],
		[ "Na obraze vidíme krajinu", "in the image we see a landscape" ],
		[ "na tomto obraze je socha", "in this image there is a statue" ],
		[ "Na fotce je vidět celý tým", "in the photo the whole team can be seen" ],
		[ "na této fotce jsou děti", "in this photo there are children" ],
		[ "na fotce vidíme tým", "in the photo we see the team" ],
		[ "Tato fotografie ukazuje výsledky", "this photograph shows the results" ],
		[ "Na fotografii je vidět celý tým", "in the photograph the whole team can be seen" ],
		[ "na této fotografii jsou děti", "in this photograph there are children" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInCzech( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Obrázky psů", "pictures of dogs", "the plural noun is not listed" ],
		[ "Obrazec ve čtverci", "a shape in a square", "the noun has to end on a word boundary" ],
		[ "Obrázek 1: schéma zapojení", "picture 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Obrázek, který jsem nakreslil", "a picture that I drew", "punctuation after the noun is a clause break, not a redundant opening" ],
		[ "Obrázek", "picture", "the bare noun has to be followed by a word" ],
		[ "Obrázek se nepodařilo načíst", "the picture failed to load",
			"a reflexive \"se\" starts a sentence about the image, not a redundant opening" ],
		[ "Obrázek není k dispozici", "the image is not available",
			"a negating \"není\" starts a sentence about the image, not a redundant opening" ],
		[ "Obraz od Muchy", "an image by Mucha", "\"od\" attributes the work to its maker, not a redundant opening" ],
		[ "Fotka od mé dcery", "a photo by my daughter", "\"od\" attributes the work to its maker, not a redundant opening" ],
		[ "Fotka profilu uživatele", "the user's profile photo", "it opens with a compound naming a kind of image" ],
		[ "Obrázek pozadí stránky", "background image of the page", "it opens with a compound naming a kind of image" ],
		[ "Obrázek na pozadí plochy", "desktop background image", "it opens with a compound naming a kind of image" ],
		[ "Obrázek záhlaví webu", "header image of the site", "it opens with a compound naming a kind of image" ],
		[ "Tato obraz ukazuje krajinu", "this(feminine) image shows the landscape", "a demonstrative only combines with the noun of its gender" ],
		[ "Na obrázku stojí pes", "in the picture stands a dog", "the verb is not one of the listed verbs" ],
		[ "Pes na obrázku je roztomilý", "the dog in the picture is cute", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInCzech( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Greek", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Greek researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInGreek = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new GreekResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Εικόνα του σκύλου", "image of the dog" ],
		[ "μια εικόνα της πόλης", "an image of the city" ],
		[ "Μία εικόνα ενός σκύλου", "an image of a dog" ],
		[ "εικόνα μιας γυναίκας", "image of a woman" ],
		[ "Φωτογραφία της ομάδας", "photo of the team" ],
		[ "μια φωτογραφία των παιδιών", "a photo of the children" ],
		[ "μία φωτογραφία ενός σκύλου", "a photo of a dog" ],
		[ "Μια εικόνα που απεικονίζει τη διαδικασία", "an image that depicts the process" ],
		[ "εικόνα που δείχνει το πάρκο", "image that shows the park" ],
		[ "εικόνα που παρουσιάζει τα αποτελέσματα", "image that presents the results" ],
		[ "Φωτογραφία που απεικονίζει την ομάδα", "photo that depicts the team" ],
		[ "φωτογραφία που δείχνει τα αποτελέσματα", "photo that shows the results" ],
		[ "Η εικόνα απεικονίζει έναν σκύλο", "the image depicts a dog" ],
		[ "η εικόνα δείχνει το πάρκο", "the image shows the park" ],
		[ "Η εικόνα παρουσιάζει τα αποτελέσματα", "the image presents the results" ],
		[ "αυτή η εικόνα απεικονίζει τη διαδικασία", "this image depicts the process" ],
		[ "Αυτή η εικόνα δείχνει το πάρκο", "this image shows the park" ],
		[ "η φωτογραφία απεικονίζει την ομάδα", "the photo depicts the team" ],
		[ "Η φωτογραφία δείχνει τα παιδιά", "the photo shows the children" ],
		[ "αυτή η φωτογραφία δείχνει την ομάδα", "this photo shows the team" ],
		[ "Στην εικόνα φαίνεται ένας σκύλος", "in the image a dog appears" ],
		[ "στην εικόνα φαίνονται τα παιδιά", "in the image the children appear" ],
		[ "Στην εικόνα απεικονίζεται η διαδικασία", "in the image the process is depicted" ],
		[ "Στη φωτογραφία φαίνεται η ομάδα", "in the photo the team appears" ],
		[ "στη φωτογραφία φαίνονται τα παιδιά", "in the photo the children appear" ],
		[ "στη φωτογραφία απεικονίζεται το πάρκο", "in the photo the park is depicted" ],
		[ "στην φωτογραφία φαίνεται η ομάδα", "in the photo the team appears" ],
		[ "Μια φωτογραφία που δείχνει την ομάδα", "a photo that shows the team" ],
		[ "Αυτή η φωτογραφία απεικονίζει την ομάδα", "this photo depicts the team" ],
		[ "αυτή η φωτογραφία παρουσιάζει τα αποτελέσματα", "this photo presents the results" ],
		[ "Εικόνα των παιδιών", "image of the children" ],
		[ "Φωτογραφία του Αγίου Νικολάου, because the icon exceptions are scoped to \"εικόνα\"", "photo of Saint Nicholas" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInGreek( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Η εικόνα του σκύλου", "the image of the dog", "a definite article only combines with the finite verbs" ],
		[ "Μια εικόνα δείχνει το πάρκο", "an image shows the park", "a finite verb requires a definite article" ],
		[ "η εικόνα δείχνεις εδώ", "the image you-show here", "the verb has to end on a word boundary" ],
		[ "Εικονογράφηση του βιβλίου", "illustration of the book", "\"εικονογράφηση\" is not one of the listed nouns" ],
		[ "Ένας σκύλος μπροστά από μια εικόνα της γάτας", "a dog in front of an image of the cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInGreek( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Εικόνα του Αγίου Νικολάου", "icon of Saint Nicholas" ],
		[ "εικόνα της Αγίας Αικατερίνης", "icon of Saint Catherine" ],
		[ "Εικόνα της Παναγίας με ασημένιο πλαίσιο", "icon of the Virgin Mary with a silver frame" ],
		[ "Μια εικόνα της Παναγίας", "an icon of the Virgin Mary" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with an Orthodox icon named as a product", ( altText ) => {
		expect( researchInGreek( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Arabic", () => {
	/**
	 * Runs the research on a single image with the given alt text, with an Arabic researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInArabic = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new ArabicResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "صورة كلب", "picture of a dog" ],
		[ "صورة القطة على السرير", "picture of the cat on the bed" ],
		[ "صُورَة كلبٍ, with diacritics on the noun", "picture of a dog" ],
		[ "صورة شخصيات كرتونية, because an excepted compound ends at a word boundary", "picture of cartoon characters" ],
		[ "الصورة تمثل الفريق", "the picture represents the team" ],
		[ "الصورة تُظهِر المنتج, with a vocalized verb", "the picture shows the product" ],
		[ "الصورة تبين الخطوات", "the picture shows the steps" ],
		[ "الصورة تصور المشهد", "the picture depicts the scene" ],
		[ "الصورة توضح العملية", "the picture illustrates the process" ],
		[ "هذه الصورة تمثل الفريق", "this picture represents the team" ],
		[ "هذه الصورة تظهر النتائج", "this picture shows the results" ],
		[ "تظهر الصورة الفريق", "the picture shows the team; literally: shows the-picture the-team" ],
		[ "تُبيّن الصورة الخطوات, with a vocalized verb", "the picture shows the steps" ],
		[ "توضح الصورة العملية", "the picture illustrates the process" ],
		[ "تصور الصورة المشهد", "the picture depicts the scene" ],
		[ "تمثل الصورة المنتج", "the picture represents the product; literally: represents the-picture the-product" ],
		[ "يظهر في الصورة رجل", "in the picture appears a man" ],
		[ "تظهر في الصورة امرأة", "in the picture appears a woman" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInArabic( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "صورة", "picture", "the bare noun has to be followed by a word" ],
		[ "صورة 1", "picture 1", "a number after the noun is a figure label, not a redundant opening" ],
		[ "صور الفريق", "pictures of the team", "the plural noun is not listed" ],
		[ "الصورة جميلة جدا", "the picture is very beautiful", "the word after the noun is not one of the listed verbs" ],
		[ "الصورة تمثلنا في المؤتمر", "the picture represents us at the conference", "a verb with an attached object suffix is not matched" ],
		[ "الصورة تُمَثِّلُنا في المؤتمر", "the picture represents us at the conference",
			"a vocalized verb with an attached object suffix is not matched either" ],
		[ "رجل أمام صورة قطة", "a man in front of a picture of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInArabic( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "صورة شخصية لأحمد", "profile picture of Ahmed" ],
		[ "صورة الغلاف الجديد", "the new cover photo" ],
		[ "صورة الملف الشخصي للمستخدم", "the user's profile picture" ],
		[ "صورة أشعة للصدر", "X-ray of the chest" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInArabic( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Farsi", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Farsi researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInFarsi = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new FarsiResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "تصویر یک سگ", "image of a dog" ],
		[ "عکس تیم ما", "photo of our team" ],
		[ "یک عکس از تیم", "a photo of the team" ],
		[ "یک تصویر از ساختمان", "an image of the building" ],
		[ "تصویری که یک سگ را نشان می‌دهد", "an image that shows a dog" ],
		[ "تصویری از یک ساختمان", "an image of a building" ],
		[ "عکسی از مراسم", "a photo of the ceremony" ],
		[ "تصویری که نشان می‌دهد چگونه کار می‌کند, with a ZWNJ in the verb", "an image that shows how it works" ],
		[ "تصویری که نشان می دهد چگونه کار می‌کند, with a space in the verb", "an image that shows how it works" ],
		[ "تصویر نشان میدهد که چگونه کار می‌کند, with the verb written joined", "the image shows how it works" ],
		[ "عکسی که سگی را نشان می‌دهد", "a photo that shows a dog; literally: a photo that a-dog shows" ],
		[ "تصویر گربه را نشان می‌دهد", "the image shows the cat" ],
		[ "این تصویر فرآیند را نشان می‌دهد", "this image shows the process; literally: this image the-process shows" ],
		[ "این عکس تیم را نشان می‌دهد", "this photo shows the team" ],
		[ "عکس محصول را نشان می‌دهد", "the photo shows the product" ],
		[ "در تصویر یک سگ دیده می‌شود", "in the image a dog is seen" ],
		[ "در این عکس تیم دیده می‌شود", "in this photo the team is seen" ],
		[ "تصوير سگ, with the Arabic yeh", "image of a dog" ],
		[ "تصویر شاخصی از عملکرد, because an excepted compound ends at a word boundary", "a telling image of the performance" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInFarsi( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "تصویر", "image", "the bare noun has to be followed by a word" ],
		[ "عکس ۱ از محصول", "photo 1 of the product", "a number after the noun is a figure label, not a redundant opening" ],
		[ "تصاویر محصول", "images of the product", "the plural noun is not listed" ],
		[ "عکس‌های تیم", "photos of the team", "the plural noun is not listed" ],
		[ "مردی جلوی یک عکس از گربه", "a man in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInFarsi( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "عکس پروفایل کاربر", "the user's profile photo" ],
		[ "عکس پرسنلی با لباس رسمی", "ID photo in formal dress" ],
		[ "تصویر پس‌زمینه برای سایت", "background image for the site" ],
		[ "تصویر پس زمینه برای سایت, with a space instead of the ZWNJ", "background image for the site" ],
		[ "تصویر شاخص مقاله", "the article's featured image" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInFarsi( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Indonesian", () => {
	/**
	 * Runs the research on a single image with the given alt text, with an Indonesian researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInIndonesian = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new IndonesianResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Gambar seekor anjing", "image of a dog" ],
		[ "foto tim kami", "photo of our team" ],
		[ "Pada gambar terlihat seekor anjing", "in the image a dog is visible" ],
		[ "pada gambar ini terlihat prosesnya", "in this image the process is visible" ],
		[ "Dalam gambar ini terlihat hasilnya", "in this image the result is visible" ],
		[ "dalam foto terlihat tim kami", "in the photo our team is visible" ],
		[ "Pada foto ini terlihat anak-anak", "in this photo children are visible" ],
		[ "dalam foto ini terlihat pemandangan", "in this photo the scenery is visible" ],
		[ "Foto produk unggulan, because \"produk\" is not an excepted compound", "photo of a featured product" ],
		[ "Gambar udara yang tercemar, because \"udara\" is only excepted for \"foto\"", "image of polluted air" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInIndonesian( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Gambar", "image", "the bare noun has to be followed by a word" ],
		[ "Gambar 1: skema rangkaian", "image 1: circuit diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Gambar-gambar produk", "images of the product", "the reduplicated plural is not listed" ],
		[ "Gambaran umum proyek", "overview of the project", "\"gambaran\" is not one of the listed nouns" ],
		[ "Fotografer di taman", "a photographer in the park", "\"fotografer\" is not one of the listed nouns" ],
		[ "Pada gambar ini terlihatlah pemandangan", "in this image behold the scenery", "the verb has to end on a word boundary" ],
		[ "Pada gambar ini ada seekor anjing", "in this image there is a dog", "the word after the noun is not one of the listed verbs" ],
		[ "Seekor anjing di depan foto kucing", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInIndonesian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Foto profil pengguna", "the user's profile photo" ],
		[ "Gambar profil pengguna", "the user's profile image" ],
		[ "Gambar unggulan artikel", "the article's featured image" ],
		[ "gambar sampul buku", "the book's cover image" ],
		[ "Foto sampul halaman", "the page's cover photo" ],
		[ "Foto arsip perang", "archive photo of the war" ],
		[ "foto stok kantor", "stock photo of an office" ],
		[ "Foto udara kota", "aerial photo of the city" ],
		[ "Gambar latar untuk situs", "background image for the site" ],
		[ "gambar latar belakang halaman", "background image of the page" ],
		[ "Gambar stok kantor", "stock image of an office" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInIndonesian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Italian", () => {
	/**
	 * Runs the research on a single image with the given alt text, with an Italian researcher.
	 *
	 * The alt attribute is double-quoted so alt texts with a straight apostrophe (l'immagine) stay intact.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInItalian = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new ItalianResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Immagine di un gatto", "image of a cat" ],
		[ "un’immagine della città", "an image of the city" ],
		[ "immagine dell’edificio, with a typographic apostrophe", "image of the building" ],
		[ "Immagine dell'edificio, with a straight apostrophe", "image of the building" ],
		[ "Foto dell'élite politica, with a straight apostrophe before an accented letter", "photo of the political elite" ],
		[ "Immagine dell’élite economica, with a typographic apostrophe before an accented letter", "image of the economic elite" ],
		[ "immagine dello stadio", "image of the stadium" ],
		[ "Foto dei ragazzi", "photo of the boys" ],
		[ "una foto degli studenti", "a photo of the students" ],
		[ "foto delle montagne", "photo of the mountains" ],
		[ "Un’immagine che raffigura il processo", "an image that depicts the process" ],
		[ "immagine che mostra il parco", "image that shows the park" ],
		[ "Un’immagine raffigurante la scena", "an image depicting the scene" ],
		[ "immagine che ritrae il paesaggio", "image that portrays the landscape" ],
		[ "Una foto che mostra il team", "a photo that shows the team" ],
		[ "foto che ritrae la squadra", "photo that portrays the team" ],
		[ "foto raffigurante un tramonto", "photo depicting a sunset" ],
		[ "L’immagine rappresenta la pace", "the image represents peace" ],
		[ "l'immagine mostra il parco", "the image shows the park" ],
		[ "questa immagine raffigura il processo", "this image depicts the process" ],
		[ "La foto ritrae la squadra", "the photo portrays the team" ],
		[ "questa foto rappresenta la scena", "this photo represents the scene" ],
		[ "Nell’immagine si vede un cane", "in the image one sees a dog" ],
		[ "nell’immagine è raffigurato un uomo", "in the image a man is depicted" ],
		[ "Nella foto si vede il team", "in the photo one sees the team" ],
		[ "nella foto è ritratto il sindaco", "in the photo the mayor is portrayed" ],
		[ "Un’immagine che ritrae il paesaggio", "an image that portrays the landscape" ],
		[ "Una foto raffigurante un tramonto", "a photo depicting a sunset" ],
		[ "L’immagine ritrae un paesaggio", "the image portrays a landscape" ],
		[ "Nell’immagine è raffigurata una donna", "in the image a woman is depicted" ],
		[ "Nell’immagine è ritratto il sindaco", "in the image the mayor is portrayed" ],
		[ "Nella foto è raffigurata una donna", "in the photo a woman is depicted" ],
		[ "Nella foto si vedono due cani", "in the photo one sees two dogs" ],
		[ "Fotografia del parco", "photograph of the park" ],
		[ "una fotografia che mostra il team", "a photograph that shows the team" ],
		[ "La fotografia ritrae la squadra", "the photograph portrays the team" ],
		[ "nella fotografia si vede il sindaco", "in the photograph one sees the mayor" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInItalian( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "L’immagine di un gatto", "the image of a cat", "a definite article only combines with the finite verbs" ],
		[ "Un’immagine mostra il parco", "an image shows the park", "a finite verb requires a definite article or demonstrative" ],
		[ "Fotografo del matrimonio", "photographer of the wedding", "\"fotografo\" is not one of the listed nouns" ],
		[ "Foto aerea della città", "aerial photo of the city", "an adjective after the noun is not a connector" ],
		[ "La foto mostrava la scena", "the photo showed the scene", "the finite verb has to end on a word boundary" ],
		[ "Un cane davanti a una foto di un gatto", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInItalian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Foto di repertorio della guerra", "stock photo of the war" ],
		[ "foto del profilo dell’utente", "the user's profile photo" ],
		[ "Foto di copertina dell’album", "cover photo of the album" ],
		[ "una fotografia di repertorio", "a stock photograph" ],
		[ "Foto di sfondo del palco", "background photo of the stage" ],
		[ "Immagine di copertina del libro", "cover image of the book" ],
		[ "immagine del profilo utente", "the user's profile image" ],
		[ "Immagine di sfondo per il sito", "background image for the site" ],
		[ "un’immagine di repertorio della partita", "a stock image of the match" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInItalian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Hungarian", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Hungarian researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInHungarian = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new HungarianResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Kép egy kutyáról", "picture of a dog" ],
		[ "Egy kép a Parlamentről", "a picture of the Parliament" ],
		[ "Kép állatokról, with an accented letter starting the following word", "picture of animals" ],
		[ "A kép egy kutyát ábrázol", "the picture depicts a dog" ],
		[ "Ez a kép mutatja be az új irodát", "this picture presents the new office" ],
		[ "a kép a folyamatot mutatja", "the picture shows the process" ],
		[ "Ez a kép ábrázolja a folyamatot", "this picture depicts the process" ],
		[ "A kép sok virágot mutat", "the picture shows many flowers" ],
		[ "A képen egy kutya látható", "in the picture a dog can be seen" ],
		[ "Ezen a képen két gyerek játszik", "in this picture two children play" ],
		[ "Egy kutya képe", "a dog's picture; literally: a dog picture-its" ],
		[ "Egy futó kutya képe, a háttérben fák", "picture of a running dog, trees in the background" ],
		[ "Egy kutyát ábrázoló kép", "a picture depicting a dog; literally: a dog-ACC depicting picture" ],
		[ "Az új irodát mutató kép", "a picture showing the new office" ],
		[ "A Parlamentet bemutató kép, éjszaka", "a picture presenting the Parliament, at night" ],
	] )( "counts an alt text of \"%s\" (%s)", ( altText ) => {
		expect( researchInHungarian( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Kép: kapcsolási rajz", "picture: wiring diagram", "a colon after the noun is a figure label, not a redundant opening" ],
		[ "Kép 1: kapcsolási rajz", "picture 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Kép", "picture", "the bare noun has to be followed by a word" ],
		[ "Képek a nyaralásról", "pictures of the holiday", "the plural noun is not listed" ],
		[ "A képet tegnap készítettem", "I took the picture yesterday", "the accusative \"képet\" is not a listed form" ],
		[ "A kép mutatós volt", "the picture was showy", "the verb has to end on a word boundary" ],
		[ "A képmutató politikus beszéde", "the hypocritical politician's speech", "the noun has to end on a word boundary" ],
		[ "Egy kutya képei a falon", "a dog's pictures on the wall", "the plural possessive is not listed" ],
		[ "Egy kutya képe volt a falon", "a dog's picture was on the wall", "\"képe\" has to end the alt text or a clause" ],
		[ "Az oldal profilképe", "the page's profile picture", "a compound noun is not matched" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInHungarian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Japanese", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Japanese researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInJapanese = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "犬の画像", "image of a dog; literally: dog-of image" ],
		[ "犬の写真です", "it is a photo of a dog" ],
		[ "公園で遊ぶ犬の写真。", "photo of a dog playing in the park" ],
		[ "チームの画像、2024年撮影", "image of the team, taken in 2024" ],
		[ "犬を示す画像", "image showing a dog; literally: dog-showing image" ],
		[ "昨日撮った写真", "a photo taken yesterday; literally: yesterday-taken photo" ],
		[ "犬がいる画像です", "it is an image with a dog in it" ],
		[ "猫の画像で、犬ではありません", "it is an image of a cat, not a dog" ],
		[ "画像は犬を示しています", "the image shows a dog" ],
		[ "この画像は製品を示しています", "this image shows the product" ],
		[ "写真には二人の子供が写っています", "in the photo two children appear" ],
		[ "この写真には犬がいます", "in this photo there is a dog" ],
	] )( "counts an alt text of \"%s\" (%s)", ( altText ) => {
		expect( researchInJapanese( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "画像", "image", "the bare noun is not matched without its reviewed context" ],
		[ "画像を読み込めませんでした", "the image could not be loaded", "the particle after the noun is not a listed topic particle" ],
		[ "この画像が好きです", "I like this image", "the particle after the noun is not a listed topic particle" ],
		[ "犬の画像ギャラリー", "gallery of dog images", "the noun has to end the text or a clause" ],
		[ "美しい画像です", "it is a beautiful image", "the noun has to follow \"の\" or a verb ending" ],
		[ "美しい犬。これは犬の画像", "a beautiful dog. This is an image of a dog", "the phrase is only matched within the first sentence" ],
		[ "写真集の表紙", "cover of a photo book", "the noun has to end the text or a clause" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInJapanese( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Norwegian", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Norwegian researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInNorwegian = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt='${ altText }' />` );
		const researcher = new NorwegianResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Bilde av en hund", "image of a dog" ],
		[ "et bilde av parken", "an image of the park" ],
		[ "Et bilde som forestiller en hund", "an image that depicts a dog" ],
		[ "bilde som viser prosessen", "image that shows the process" ],
		[ "Bildet forestiller en hund", "the image depicts a dog" ],
		[ "bildet fremstiller situasjonen", "the image portrays the situation" ],
		[ "Bildet framstiller scenen", "the image portrays the scene" ],
		[ "Bildet viser parken", "the image shows the park" ],
		[ "Dette bildet forestiller en hund", "this image depicts a dog" ],
		[ "dette bildet framstiller scenen", "this image portrays the scene" ],
		[ "dette bildet fremstiller prosessen", "this image portrays the process" ],
		[ "Dette bildet viser resultatene", "this image shows the results" ],
		[ "På bildet ser vi en hund", "in the image we see a dog" ],
		[ "på bildet ser man to barn", "in the image one sees two children" ],
		[ "På bildet er det en katt", "in the image there is a cat" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInNorwegian( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Bildet av en hund", "the image of a dog", "the definite noun only combines with the finite verbs" ],
		[ "Et bilde viser parken", "an image shows the park", "a finite verb requires the definite noun" ],
		[ "Bilder av fjell", "images of mountains", "the plural noun is not listed" ],
		[ "Bildetekst mangler", "caption is missing", "the noun has to end on a word boundary" ],
		[ "Bildet viste parken", "the image showed the park", "the past tense is not listed" ],
		[ "Bildet viser seg å være en forfalskning", "the image turns out to be a forgery", "\"viser seg\" means \"turns out\", not \"shows\"" ],
		[ "Et bilde som viser seg å være manipulert", "an image that turns out to be manipulated",
			"\"viser seg\" means \"turns out\", not \"shows\"" ],
		[ "Fotografi av parken", "photograph of the park", "\"fotografi\" is not one of the listed nouns" ],
		[ "En hund foran et bilde av en katt", "a dog in front of an image of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInNorwegian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Hebrew", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Hebrew researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInHebrew = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new HebrewResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "תמונה של כלב", "picture of a dog" ],
		[ "תמונה יפה של הפארק", "a beautiful picture of the park" ],
		[ "תמונת כלב", "picture of a dog; literally: picture-of dog" ],
		[ "התמונה מתארת כלב", "the picture describes a dog" ],
		[ "התמונה מראה את הפארק", "the picture shows the park" ],
		[ "התמונה מציגה את התהליך", "the picture presents the process" ],
		[ "התמונה הזו מתארת כלב", "this picture describes a dog" ],
		[ "התמונה הזאת מראה את הצוות", "this picture shows the team" ],
		[ "התמונה הזו מציגה את התוצאות", "this picture presents the results" ],
		[ "בתמונה נראה כלב", "in the picture a dog is seen" ],
		[ "בתמונה נראית אישה", "in the picture a woman is seen" ],
		[ "בתמונה נראים שני ילדים", "in the picture two children are seen" ],
		[ "בתמונה נראות שתי נשים", "in the picture two women are seen" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInHebrew( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "תמונה", "picture", "the bare noun has to be followed by a word" ],
		[ "תמונה 1: תרשים החיבורים", "picture 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "תמונות של חתולים", "pictures of cats", "the plural noun is not listed" ],
		[ "התמונה של הכלב", "the picture of the dog", "the definite noun only combines with the finite verbs" ],
		[ "התמונה מטושטשת", "the picture is blurry", "the word after the noun is not one of the listed verbs" ],
		[ "כלב ליד תמונה של חתול", "a dog next to a picture of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInHebrew( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "תמונת מסך של הדף", "screenshot of the page" ],
		[ "תמונת פרופיל של המשתמש", "the user's profile picture" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a construct compound naming a kind of image", ( altText ) => {
		expect( researchInHebrew( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "counts an alt text starting with \"תמונת מסכים\" (picture of screens), because an excepted compound ends at a word boundary", () => {
		expect( researchInHebrew( "תמונת מסכים בחנות" ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );
} );

describe( "the redundant alt text phrases for Turkish", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Turkish researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInTurkish = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new TurkishResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Bir köpeğin resmi", "a dog's picture" ],
		[ "Ekibin fotoğrafı", "the team's photo" ],
		[ "Dağların görseli", "image of the mountains" ],
		[ "Çocukların resimleri, parkta", "pictures of the children, in the park" ],
		[ "Ürünün görselleri", "images of the product" ],
		[ "Kedilerin fotoğrafları", "photos of the cats" ],
		[ "Bir köpeğin resmidir", "it is a dog's picture" ],
		[ "Ekibin fotoğrafıdır", "it is the team's photo" ],
		[ "Köpeğin uyuduğu fotoğraf", "the photo in which the dog sleeps" ],
		[ "Koşan bir köpeği gösteren görsel", "an image showing a running dog; literally: running a dog-ACC showing image" ],
		[ "Ekibin çektiği fotoğraf", "the photo the team took; literally: team-of taken photo" ],
		[ "Parkta koşan köpeği betimleyen resim", "a picture depicting the dog running in the park" ],
		[ "Kadını gösteren fotoğraftır", "it is a photo showing the woman; literally: the-woman showing photo-is" ],
		[ "Görselde bir köpek var", "in the image there is a dog" ],
		[ "Bu görselde iki çocuk oynuyor", "in this image two children play" ],
		[ "Resimde ekip görünüyor", "in the picture the team appears" ],
		[ "fotoğrafta bir kadın var", "in the photo there is a woman" ],
		[ "Bu fotoğrafta dağlar görünüyor", "in this photo mountains appear" ],
		[ "Görsel bir köpeği gösteriyor", "the image shows a dog" ],
		[ "Bu resim ekibi betimliyor", "this picture depicts the team" ],
		[ "Fotoğraf dağları tasvir ediyor", "the photo depicts the mountains" ],
		[ "Bu görsel süreci göstermektedir", "this image shows the process" ],
		[ "Resim manzarayı tasvir etmektedir.", "the picture depicts the landscape" ],
		[ "Bu fotoğraf şehri betimlemektedir", "this photo depicts the city" ],
	] )( "counts an alt text of \"%s\" (%s)", ( altText ) => {
		expect( researchInTurkish( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Resmi belge örneği", "sample of an official document", "\"resmi\" (official) away from a clause end is not matched" ],
		[ "Köpeğin resmi duvarda asılı", "the dog's picture hangs on the wall", "the possessive noun has to end the alt text or a clause" ],
		[ "Görsel", "image", "the bare noun is not matched without a listed verb" ],
		[ "Görseldeki köpek", "the dog in the image", "the suffixed locative is not listed" ],
		[ "Bu görsel çok güzel", "this image is very beautiful", "no listed verb follows the noun" ],
		[ "Resim 1: devre şeması", "picture 1: circuit diagram", "a figure label matches no rule" ],
		[ "Güzel bir gün. Bir köpeğin resmi", "a beautiful day. A dog's picture", "the phrase is only matched within the first sentence" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInTurkish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Kullanıcının profil resmi", "the user's profile picture" ],
		[ "Profil fotoğrafı", "profile photo" ],
		[ "Sayfanın kapak fotoğrafı", "the page's cover photo" ],
		[ "kapak görseli", "cover image" ],
		[ "Arka plan resmi", "background picture" ],
		[ "sitenin arka plan görseli", "the site's background image" ],
		[ "Şehrin hava fotoğrafı", "aerial photo of the city" ],
		[ "Savaşın arşiv fotoğrafı", "archive photo of the war" ],
		[ "Bir stok fotoğrafı", "a stock photo" ],
		[ "stok görseli", "stock image" ],
		[ "Sanatçının yağlı boya resmi", "the artist's oil painting" ],
	] )( "does not count the alt text \"%s\" (%s): it ends with a compound naming a kind of image", ( altText ) => {
		expect( researchInTurkish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Kullanıcının profil görseli, because the exceptions are scoped per noun", "the user's profile image" ],
		[ "Kullanıcıların profil resimleri, because the exceptions cover the singular only", "the users' profile pictures" ],
	] )( "counts an alt text of \"%s\" (%s)", ( altText ) => {
		expect( researchInTurkish( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );
} );

describe( "the redundant alt text phrases for Swedish", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Swedish researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInSwedish = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt='${ altText }' />` );
		const researcher = new SwedishResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Bild på en hund", "image of a dog" ],
		[ "en bild av parken", "an image of the park" ],
		[ "En bild som föreställer en hund", "an image that depicts a dog" ],
		[ "bild som visar processen", "image that shows the process" ],
		[ "Bilden föreställer en hund", "the image depicts a dog" ],
		[ "bilden visar parken", "the image shows the park" ],
		[ "Den här bilden föreställer en hund", "this image depicts a dog" ],
		[ "den här bilden visar resultaten", "this image shows the results" ],
		[ "Denna bild föreställer scenen", "this image depicts the scene" ],
		[ "denna bild visar processen", "this image shows the process" ],
		[ "På bilden syns en hund", "in the image a dog is visible" ],
		[ "på bilden ser vi två barn", "in the image we see two children" ],
		[ "På bilden ser man en katt", "in the image one sees a cat" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInSwedish( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Bilden av en hund", "the image of a dog", "the definite noun only combines with the finite verbs" ],
		[ "En bild visar parken", "an image shows the park", "a finite verb requires the definite noun" ],
		[ "Bilder på fjäll", "images of mountains", "the plural noun is not listed" ],
		[ "Bildtext saknas", "caption is missing", "the noun has to end on a word boundary" ],
		[ "Bilden visade parken", "the image showed the park", "the past tense is not listed" ],
		[ "Bilden visar sig vara falsk", "the image turns out to be fake", "\"visar sig\" means \"turns out\", not \"shows\"" ],
		[ "En bild som visar sig vara manipulerad", "an image that turns out to be manipulated",
			"\"visar sig\" means \"turns out\", not \"shows\"" ],
		[ "Fotografi av parken", "photograph of the park", "\"fotografi\" is not one of the listed nouns" ],
		[ "En hund framför en bild på en katt", "a dog in front of an image of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInSwedish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Slovak", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Slovak researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInSlovak = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new SlovakResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Obrázok psa", "picture of a dog" ],
		[ "obraz krajiny", "image of a landscape" ],
		[ "Fotka nášho tímu", "photo of our team" ],
		[ "Obrázok zobrazujúci proces", "a picture depicting the process" ],
		[ "obraz znázorňujúci bitku", "an image illustrating a battle" ],
		[ "obrázok ukazujúci park", "a picture showing the park" ],
		[ "Fotka zobrazujúca tím", "a photo depicting the team" ],
		[ "fotka ukazujúca výsledky", "a photo showing the results" ],
		[ "Obrázok, ktorý zobrazuje psa", "a picture that depicts a dog" ],
		[ "obraz, ktorý ukazuje krajinu", "an image that shows a landscape" ],
		[ "Fotka, ktorá zobrazuje tím", "a photo that depicts the team" ],
		[ "fotka, ktorá ukazuje výsledky", "a photo that shows the results" ],
		[ "Fotka, na ktorej je pes", "a photo on which there is a dog" ],
		[ "Tento obrázok zobrazuje proces", "this picture depicts the process" ],
		[ "tento obraz ukazuje krajinu", "this image shows the landscape" ],
		[ "Obrázok znázorňuje postup", "the picture illustrates the procedure" ],
		[ "Táto fotka zobrazuje tím", "this photo depicts the team" ],
		[ "Táto fotka znázorňuje tím", "this photo illustrates the team" ],
		[ "Na obrázku je pes", "in the picture there is a dog" ],
		[ "na tomto obrázku sú deti", "in this picture there are children" ],
		[ "Na obraze vidíme krajinu", "in the image we see a landscape" ],
		[ "na obrázku je vidieť celý tím", "in the picture the whole team can be seen" ],
		[ "Na fotke sú deti", "in the photo there are children" ],
		[ "na tejto fotke je vidieť tím", "in this photo the team can be seen" ],
		[ "Obrázok samostatnej izby, because \"sa\" only excepts the whole word", "picture of a separate room" ],
		[ "Obrázok niekoľkých domov, because \"nie\" only excepts the whole word", "picture of several houses" ],
		[ "fotka znázorňujúca tím", "a photo illustrating the team" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInSlovak( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Obrázok", "picture", "the bare noun has to be followed by a word" ],
		[ "Obrázok 1: schéma zapojenia", "picture 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Obrázky psov", "pictures of dogs", "the plural noun is not listed" ],
		[ "Obrázok sa nepodarilo načítať", "the picture failed to load",
			"a reflexive \"sa\" starts a sentence about the image, not a redundant opening" ],
		[ "Obrázok nie je dostupný", "the image is not available",
			"a negating \"nie\" starts a sentence about the image, not a redundant opening" ],
		[ "Obraz od Muchu", "an image by Mucha", "\"od\" attributes the work to its maker, not a redundant opening" ],
		[ "Fotka profilu používateľa", "the user's profile photo", "it opens with a compound naming a kind of image" ],
		[ "Obrázok pozadia stránky", "background image of the page", "it opens with a compound naming a kind of image" ],
		[ "Obrázok na pozadí plochy", "desktop background image", "it opens with a compound naming a kind of image" ],
		[ "Obrázok záhlavia webu", "header image of the site", "it opens with a compound naming a kind of image" ],
		[ "Obrázok hlavičky stránky", "header image of the page", "it opens with a compound naming a kind of image" ],
		[ "Tento fotka zobrazuje tím", "this(masculine) photo depicts the team", "a demonstrative only combines with the noun of its gender" ],
		[ "Obrázok, na ktorom je pes", "a picture on which there is a dog", "the \"na ktorej\" clause is only reviewed for \"fotka\"" ],
		[ "Na fotke stojí pes", "in the photo stands a dog", "the verb is not one of the listed verbs" ],
		[ "Pes na obrázku je roztomilý", "the dog in the picture is cute", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInSlovak( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Russian", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Russian researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInRussian = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new RussianResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Изображение собаки", "image of a dog" ],
		[ "картинка заката", "picture of a sunset" ],
		[ "Фото команды", "photo of the team" ],
		[ "фотография здания", "photograph of a building" ],
		[ "Это изображение показывает процесс", "this image shows the process" ],
		[ "эта картинка изображает собаку", "this picture depicts a dog" ],
		[ "Это изображение представляет результаты", "this image presents the results" ],
		[ "Это фото показывает команду", "this photo shows the team" ],
		[ "эта фотография изображает парк", "this photograph depicts the park" ],
		[ "На изображении изображена собака", "in the image a dog is depicted" ],
		[ "на этом изображении показано здание", "in this image a building is shown" ],
		[ "На картинке изображён человек", "in the picture a man is depicted" ],
		[ "на картинке изображен человек, with the \"ё\" written as \"е\"", "in the picture a man is depicted" ],
		[ "на этой картинке показан процесс", "in this picture a process is shown" ],
		[ "На фото видно здание", "in the photo a building is visible" ],
		[ "на этом фото виден парк", "in this photo a park is visible" ],
		[ "На фотографии изображены дети", "in the photograph children are depicted" ],
		[ "на этой фотографии изображено здание", "in this photograph a building is depicted" ],
		[ "Это фото представляет компанию", "this photo presents the company" ],
		[ "На картинке видно здание", "in the picture a building is visible" ],
		[ "На картинке показана команда", "in the picture the team is shown" ],
		[ "На фото видна гора", "in the photo a mountain is visible" ],
		[ "на фотографии показаны дети", "in the photograph children are shown" ],
		[ "На изображении видны горы", "in the image mountains are visible" ],
		[ "Изображение фонарей на улице, because an excepted compound ends at a word boundary", "image of lanterns in the street" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInRussian( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Изображение", "image", "the bare noun has to be followed by a word" ],
		[ "Фото 1: схема подключения", "photo 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Изображения продуктов", "images of products", "the plural noun is not listed" ],
		[ "Фотографии команды", "photographs of the team", "the plural noun is not listed" ],
		[ "Это изображение красивое", "this image is beautiful", "the word after the noun is not one of the listed verbs" ],
		[ "Собака рядом с фото кошки", "a dog next to a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInRussian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Фото профиля пользователя", "the user's profile photo" ],
		[ "фотография профиля", "profile photograph" ],
		[ "Изображение обложки книги", "cover image of the book" ],
		[ "картинка фона для сайта", "background picture for the site" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInRussian( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Portuguese", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Portuguese researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInPortuguese = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt='${ altText }' />` );
		const researcher = new PortugueseResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Imagem de um cachorro", "image of a dog" ],
		[ "uma imagem do parque", "an image of the park" ],
		[ "imagem da cidade", "image of the city" ],
		[ "Foto dos meninos", "photo of the boys" ],
		[ "uma foto das montanhas", "a photo of the mountains" ],
		[ "Uma imagem que representa o processo", "an image that represents the process" ],
		[ "imagem que mostra o parque", "image that shows the park" ],
		[ "Uma imagem representando a cena", "an image representing the scene" ],
		[ "imagem mostrando o processo", "image showing the process" ],
		[ "imagem que retrata a paisagem", "image that portrays the landscape" ],
		[ "imagem retratando o time", "image portraying the team" ],
		[ "Uma foto que mostra o time", "a photo that shows the team" ],
		[ "foto que retrata a equipe", "photo that portrays the team" ],
		[ "Uma foto representando a cena", "a photo representing the scene" ],
		[ "foto retratando o pôr do sol", "photo portraying the sunset" ],
		[ "A imagem representa a paz", "the image represents peace" ],
		[ "a imagem mostra o parque", "the image shows the park" ],
		[ "A imagem retrata a paisagem", "the image portrays the landscape" ],
		[ "Esta imagem representa o processo", "this image represents the process" ],
		[ "essa imagem mostra os resultados", "that image shows the results" ],
		[ "A foto retrata a equipe", "the photo portrays the team" ],
		[ "esta foto mostra o time", "this photo shows the team" ],
		[ "essa foto representa a cena", "that photo represents the scene" ],
		[ "Na imagem, um cachorro corre", "in the image, a dog runs" ],
		[ "na foto, duas crianças brincam", "in the photo, two children play" ],
		[ "Nesta foto, a equipe aparece", "in this photo, the team appears" ],
		[ "Nesta imagem, um cachorro corre", "in this image, a dog runs" ],
		[ "Uma imagem que retrata a paisagem", "an image that portrays the landscape" ],
		[ "Uma imagem retratando o time", "an image portraying the team" ],
		[ "Fotografia da cidade", "photograph of the city" ],
		[ "uma fotografia que mostra o time", "a photograph that shows the team" ],
		[ "A fotografia retrata a equipe", "the photograph portrays the team" ],
		[ "na fotografia, o time aparece", "in the photograph, the team appears" ],
		[ "Imagem de fundos de investimento, because an excepted compound ends at a word boundary", "image of investment funds" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInPortuguese( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "A imagem de um cachorro", "the image of a dog", "a definite article only combines with the finite verbs" ],
		[ "Uma imagem mostra o parque", "an image shows the park", "a finite verb requires a definite article or demonstrative" ],
		[ "Na imagem um cachorro corre", "in the image a dog runs", "the prepositional opening requires its comma" ],
		[ "Fotógrafo da cidade", "photographer of the city", "\"fotógrafo\" is not one of the listed nouns" ],
		[ "A foto mostrava a cena", "the photo showed the scene", "the past tense is not listed" ],
		[ "Imagens de produtos", "images of products", "the plural noun is not listed" ],
		[ "Um cachorro diante de uma foto de um gato", "a dog in front of a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInPortuguese( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Foto de perfil do usuário", "the user's profile photo" ],
		[ "uma fotografia de perfil", "a profile photograph" ],
		[ "foto de capa do álbum", "cover photo of the album" ],
		[ "Foto de arquivo da guerra", "archive photo of the war" ],
		[ "Imagem de fundo para o site", "background image for the site" ],
		[ "imagem de capa do livro", "cover image of the book" ],
		[ "Imagem de perfil do usuário", "the user's profile image" ],
		[ "imagem de arquivo do evento", "archive image of the event" ],
		[ "Foto de fundo do palco", "background photo of the stage" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInPortuguese( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the redundant alt text phrases for Polish", () => {
	/**
	 * Runs the research on a single image with the given alt text, with a Polish researcher.
	 *
	 * @param {string} altText The alt text of the image.
	 *
	 * @returns {{count: number, flagged: Array<string|number>}} The research result.
	 */
	const researchInPolish = ( altText ) => {
		const paper = new Paper( `<img src='${ buildSrc( 0 ) }' alt="${ altText }" />` );
		const researcher = new PolishResearcher( paper );
		buildTree( paper, researcher );

		return redundantPhraseInAltText( paper, researcher );
	};

	it.each( [
		[ "Obraz bitwy", "image of a battle" ],
		[ "obrazek psa", "picture of a dog" ],
		[ "Grafika przedstawiająca proces", "graphic presenting the process" ],
		[ "Zdjęcie naszego zespołu", "photo of our team" ],
		[ "Ten obrazek przedstawia psa", "this picture presents a dog" ],
		[ "ten obraz pokazuje krajobraz", "this image shows a landscape" ],
		[ "Ten obrazek ilustruje proces", "this picture illustrates the process" ],
		[ "Ta grafika przedstawia proces", "this graphic presents the process" ],
		[ "To zdjęcie pokazuje zespół", "this photo shows the team" ],
		[ "Na obrazku widać psa", "in the picture a dog can be seen" ],
		[ "na tym obrazku jest kot", "in this picture there is a cat" ],
		[ "Na obrazku znajduje się dom", "in the picture there is a house" ],
		[ "na obrazku widoczne jest wejście", "in the picture the entrance is visible" ],
		[ "Na obrazku widoczne są dzieci", "in the picture children are visible" ],
		[ "Na zdjęciu widać zespół", "in the photo the team can be seen" ],
		[ "na tym zdjęciu są dzieci", "in this photo there are children" ],
		[ "Na zdjęciu znajduje się budynek", "in the photo there is a building" ],
		[ "na zdjęciu widoczne jest logo", "in the photo the logo is visible" ],
		[ "Na obrazku są dzieci", "in the picture there are children" ],
		[ "Na obrazie widać bitwę", "in the image a battle can be seen" ],
		[ "na tej grafice jest wykres", "in this graphic there is a chart" ],
		[ "Na grafice widać proces", "in the graphic the process can be seen" ],
		[ "Obrazek sięgający nieba, because \"się\" only excepts the whole word", "a picture reaching the sky" ],
		[ "Zdjęcie nieba o zachodzie, because \"nie\" only excepts the whole word", "photo of the sky at sunset" ],
	] )( "counts an alt text starting with \"%s\" (%s)", ( altText ) => {
		expect( researchInPolish( altText ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Obraz", "image", "the bare noun has to be followed by a word" ],
		[ "Obraz 1: schemat połączeń", "picture 1: wiring diagram", "a number after the noun is a figure label, not a redundant opening" ],
		[ "Obrazy produktów", "images of products", "the plural noun is not listed" ],
		[ "Obrazek się nie załadował", "the picture did not load",
			"a reflexive \"się\" starts a sentence about the image, not a redundant opening" ],
		[ "Zdjęcie nie jest dostępne", "the photo is not available",
			"a negating \"nie\" starts a sentence about the image, not a redundant opening" ],
		[ "Obraz od babci", "an image from grandma", "\"od\" attributes the work to its maker or giver, not a redundant opening" ],
		[ "Na zdjęciu stoi pies", "in the photo stands a dog", "the verb is not one of the listed verbs" ],
		[ "Pies obok zdjęcia kota", "a dog next to a photo of a cat", "the phrase is not at the start" ],
	] )( "does not count the alt text \"%s\" (%s): %s", ( altText ) => {
		expect( researchInPolish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it.each( [
		[ "Zdjęcie profilu użytkownika", "the user's profile photo" ],
		[ "Zdjęcie profilowe użytkownika", "the user's profile photo" ],
		[ "Zdjęcie w tle profilu", "the profile's cover photo" ],
		[ "Obrazek wyróżniający wpisu", "the post's featured image" ],
		[ "Zdjęcie wyróżniające artykułu", "the article's featured image" ],
		[ "Zdjęcie poglądowe produktu", "illustrative photo of the product" ],
		[ "Obrazek poglądowy produktu", "illustrative picture of the product" ],
		[ "zdjęcie stockowe biura", "stock photo of an office" ],
		[ "Zdjęcie archiwalne z wojny", "archival photo from the war" ],
		[ "zdjęcie lotnicze miasta", "aerial photo of the city" ],
		[ "Zdjęcie satelitarne burzy", "satellite photo of the storm" ],
		[ "Zdjęcie legitymacyjne na dokument", "ID photo for a document" ],
		[ "grafika tła dla strony", "background graphic for the page" ],
		[ "Obraz tła pulpitu", "desktop background image" ],
		[ "zdjęcie okładki albumu", "cover photo of the album" ],
	] )( "does not count the alt text \"%s\" (%s): it opens with a compound naming a kind of image", ( altText ) => {
		expect( researchInPolish( altText ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the research for a language without a phrase list", () => {
	it( "counts nothing, so the assessment stays hidden instead of flagging against another language's phrases", () => {
		const paper = new Paper( "<img src='https://example.com/image.jpg' alt='Image of a dog' />" );
		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );

		expect( redundantPhraseInAltText( paper, researcher ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );
