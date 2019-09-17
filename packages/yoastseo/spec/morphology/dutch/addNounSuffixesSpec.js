import { getSuffixes } from "../../../src/morphology/dutch/addNounSuffixes";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for getting the right plural suffixes", () => {
	it( "returns the -en suffix when the stem ends in -ant", () => {
		expect( getSuffixes( "krant", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"en",
		] );
	} );
	it( "returns the -'s suffix when the stem ends in -y", () => {
		expect( getSuffixes( "baby", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"'s",
		] );
	} );
	it( "returns the -es suffix when the stem ends in -ch", () => {
		expect( getSuffixes( "sandwich", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"es",
		] );
	} );
	it( "returns the -s suffix when the stem ends in -pel", () => {
		expect( getSuffixes( "appel", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"s",
		] );
	} );
	it( "returns the default plural suffixes if no predictable stem ending was found", () => {
		expect( getSuffixes( "bal", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"en",
			"es",
			"ers"
		] );
	} );
} );
describe( "Test for getting the right diminutive suffixes", () => {
	it( "returns the -pje suffix when the stem ends in -lm", () => {
		expect( getSuffixes( "film", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"pje",
		] );
	} );
	it( "returns the -etje suffix when the stem ends in -bal", () => {
		expect( getSuffixes( "bal", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"etje",
		] );
	} );
	it( "returns the -'tje suffix when the stem ends in -y", () => {
		expect( getSuffixes( "baby", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"'tje",
		] );
	} );
	it( "returns the -tje suffix when the stem ends in -ator", () => {
		expect( getSuffixes( "alligator", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"tje",
		] );
	} );
	it( "returns the default diminutive suffixes if no predictable stem ending was found", () => {
		expect( getSuffixes( "hond", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"je",
			"etje",
			"ertje"
		] );
	} );
} );