import { createFormsForStemmed3rdSgVerbs } from "../../../src/morphology/german/createFormsForStemmed3rdSgVerbs";
import stem from "../../../src/morphology/german/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;
const morphoolgyDataDEVerbs = morphologyDataDE.verbs;

it( "creates additional forms for ambiguous stems ending in -t/-et; input: verb that's not on exception list", () => {
	expect( createFormsForStemmed3rdSgVerbs( morphologyDataDE, stem( morphoolgyDataDEVerbs, "arbeitet" ), "arbeitet" ) ).toEqual( [
		"arbeite",
		"arbeiten",
		"arbeitest",
		"arbeitet",
		"arbeitete",
		"arbeitetet",
		"arbeiteten",
		"arbeitetest",
		"arbeitend",
		"gearbeitet",
	] );
} );

it( "creates additional forms for ambiguous stems ending in -t/-et; input: verb that's on an exception list", () => {
	expect( createFormsForStemmed3rdSgVerbs( morphologyDataDE, stem( morphoolgyDataDEVerbs, "geht" ), "geht" ) ).toEqual( [
		"geh",
		"ging",
		"gehe",
		"gehen",
		"gehend",
		"gehest",
		"gehet",
		"gehst",
		"geht",
		"gingen",
		"gingst",
		"gingt",
		"gegangen",
	] );
} );

it( "doesn't create additional forms for stems in -t for words that are unambiguously non-3rd person verb forms; " +
	"input: word that has an ending which marks it as not being a 3rd person verb form", () => {
	expect( createFormsForStemmed3rdSgVerbs( morphologyDataDE, stem( morphoolgyDataDEVerbs, "schwierigkeit" ), "schwierigkeit" ) ).toBeNull();
} );

it( "doesn't create additional forms for stems in -t for words that are unambiguously non-3rd person verb forms; " +
	"input: word that is recognized as a regular participle", () => {
	expect( createFormsForStemmed3rdSgVerbs( morphologyDataDE, stem( morphoolgyDataDEVerbs, "gekauft" ), "gekauft" ) ).toBeNull();
} );
