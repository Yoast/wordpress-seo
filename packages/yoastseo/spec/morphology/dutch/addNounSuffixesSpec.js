import { getSuffixes } from "../../../src/morphology/dutch/addNounSuffixes";
import { addNounSuffixes } from "../../../src/morphology/dutch/addNounSuffixes";
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
	it( "returns the default plural suffix if no suffix could be predicted based on stem ending", () => {
		expect( getSuffixes( "bal", morphologyDataNL.nouns.suffixes.pluralSuffixes ) ).toEqual( [
			"en",
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
	it( "returns the default diminutive suffixes if no suffix could be predicted based on stem ending", () => {
		expect( getSuffixes( "hond", morphologyDataNL.nouns.suffixes.diminutiveSuffixes ) ).toEqual( [
			"je",
			"etje",
			"ertje",
		] );
	} );
} );

describe( "Adds noun suffixes", () => {
	it( "Adds noun suffixes to a Dutch stem based on which certain suffixes can be predicted", () => {
		expect( addNounSuffixes( "baby", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"baby's",
			"baby'tje",
		].sort() );
	} );
	it( "Adds default noun suffixes to a Dutch stem when the correct suffix cannot be predicted", () => {
		expect( addNounSuffixes( "hond", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"hondje",
			"hondertje",
			"honden",
			"honders",
			"hondes",
			"hondetje",
		].sort() );
	} );
	it( "Creates a second stem with doubled consonant and adds the right suffixes to each stem", () => {
		expect( addNounSuffixes( "bal", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"ballen",
			"ballers",
			"balles",
			"balletje",
		].sort() );
	} );
	it( "Creates a second stem with voiced consonant and adds the right suffixes to each stem", () => {
		expect( addNounSuffixes( "huis", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"huisje",
			"huisertje",
			"huizen",
			"huizers",
			"huizes",
			"huizetje",
		].sort() );
	} );
	it( "Creates a second stem with an undoubled vowel and adds the right suffixes to each stem", () => {
		expect( addNounSuffixes( "spoor", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"spoortje",
			"sporen",
			"sporers",
			"spores",
		].sort() );
	} );
	it( "Creates a plural form ending in -heden if the stem ends in -heid", () => {
		expect( addNounSuffixes( "mogelijkheid", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"mogelijkheden",
		].sort() );
	} );
	it( "Replaces -g with -k in stems ending in -ing before attaching the diminutive suffix", () => {
		expect( addNounSuffixes( "ketting", morphologyDataNL.addSuffixes, morphologyDataNL.nouns.suffixes ).sort() ).toEqual( [
			"kettinkje",
			"kettingen",
			"kettingers",
			"kettinges",
		].sort() );
	} );
} );
