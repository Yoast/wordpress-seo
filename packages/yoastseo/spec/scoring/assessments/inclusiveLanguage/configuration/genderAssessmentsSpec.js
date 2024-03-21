import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/genderAssessments";
import Factory from "../../../../../src/helpers/factory.js";
import { testInclusiveLanguageAssessments } from "../testHelpers/testHelper";

describe( "Tests for exclusionary and potentially exclusionary phrases", function() {
	it( "should target exclusionary phrases derived from the word 'man'", function() {
		const testData = [
			{
				identifier: "mankind",
				text: "Mankind is so great! I could talk for hours about it.",
				expectedFeedback: "Avoid using <i>mankind</i> as it is exclusionary. Consider using an alternative, such as " +
					"<i>individuals, people, persons, human beings, humanity</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "manHours",
				text: "This sentence contains the word man-hours, plus a random clause added at the end.",
				expectedFeedback: "Avoid using <i>man-hours</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>person-hours, business hours</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "manMade",
				text: "This sentence contains the word man-made and then there's an additional clause at the end.",
				expectedFeedback: "Avoid using <i>man-made</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>artificial, synthetic, machine-made</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "manMade",
				text: "This sentence contains the word manmade and then there's an additional clause at the end.",
				expectedFeedback: "Avoid using <i>manmade</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>artificial, synthetic, machine-made</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "manned",
				text: "This sentence contains the word manned and then there's an additional clause at the end.",
				expectedFeedback: "Avoid using <i>manned</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>crewed</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets exclusionary phrase 'to each his own'", function() {
		const testData = [
			{
				identifier: "toEachTheirOwn",
				text: "Well, what can I say, to each his own.",
				expectedFeedback: "Avoid using <i>to each his own</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>to each their own</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets exclusionary phrases 'opposite gender' and 'opposite sex'", function() {
		const testData = [
			{
				identifier: "oppositeGender",
				text: "This sentence includes the phrase opposite gender and something else at the end.",
				expectedFeedback: "Avoid using <i>opposite gender</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>another gender</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "oppositeSex",
				text: "This sentence includes the phrase opposite sex and something else at the end.",
				expectedFeedback: "Avoid using <i>opposite sex</i> as it is exclusionary. " +
					"Consider using an alternative, such as <i>another sex</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets exclusionary phrases 'female-bodied' and 'male-bodied'", () => {
		const testData = [
			{
				identifier: "femaleBodied",
				text: "This sentence contains the word female-bodied and then something else.",
				expectedFeedback: "Avoid using <i>female-bodied</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>assigned female at birth</i> " +
					"if you are discussing a person based on their sex or assigned gender at birth. " +
					"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>female-bodied</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "maleBodied",
				text: "This sentence contains the word male-bodied and then something else.",
				expectedFeedback: "Avoid using <i>male-bodied</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>assigned male at birth</i> " +
					"if you are discussing a person based on their sex or assigned gender at birth. " +
					"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>male-bodied</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially exclusionary pronoun phrases (heOrShe)", function() {
		const testData = [
			{
				identifier: "heOrShe",
				text: "Everyone should be able to begin higher education whenever he/she is ready.",
				expectedFeedback: "Be careful when using <i>he/she</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>they</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "heOrShe",
				text: "Everyone should be able to begin higher education whenever he or she is ready.",
				expectedFeedback: "Be careful when using <i>he or she</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>they</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "heOrShe",
				text: "Everyone should be able to begin higher education whenever she or he is ready.",
				expectedFeedback: "Be careful when using <i>she or he</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>they</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "heOrShe",
				text: "Everyone should be able to begin higher education whenever (s)he is ready.",
				expectedFeedback: "Be careful when using <i>(s)he</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>they</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially exclusionary phrase 'husband and wife' and its plural form", () => {
		const testData = [
			{
				identifier: "husbandAndWife",
				text: "The officiant pronounces them husband and wife.",
				expectedFeedback: "Be careful when using <i>husband and wife</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>spouses, partners</i>, unless referring to someone who " +
					"explicitly wants to be referred to with this term." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "husbandAndWife",
				text: "The officiant pronounces them husbands and wives.",
				expectedFeedback: "Be careful when using <i>husbands and wives</i> as it is potentially exclusionary. " +
					"Consider using an alternative, such as <i>spouses, partners</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "Tests for phrases that are exclusionary UNLESS there is a condition when they're acceptable", function() {
	it( "targets versions of the phrases 'men and women' and 'girls and boys'", () => {
		const testData = [
			{
				identifier: "menAndWomen",
				text: "This sentence contains the phrase men and women, followed by something else.",
				expectedFeedback: "Be careful when using <i>men and women</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of men and women, use an alternative, " +
					"such as <i>people, people of all genders, individuals, human beings</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "menAndWomen",
				text: "This sentence contains the phrase women and men, followed by something else.",
				expectedFeedback: "Be careful when using <i>women and men</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of women and men, use an alternative, " +
					"such as <i>people, people of all genders, individuals, human beings</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "boysAndGirls",
				text: "This sentence contains the phrase girls and boys, followed by something else.",
				expectedFeedback: "Be careful when using <i>girls and boys</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of girls and boys, " +
					"use an alternative, such as <i>kids, children</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "boysAndGirls",
				text: "This sentence contains the phrase boys and girls, followed by something else.",
				expectedFeedback: "Be careful when using <i>boys and girls</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of boys and girls, " +
					"use an alternative, such as <i>kids, children</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets phrases 'both genders', 'ladies and gentlemen' and 'mothers and fathers", () => {
		const testData = [
			{
				identifier: "bothGenders",
				text: "This sentence contains the phrase both genders followed by something else.",
				expectedFeedback: "Be careful when using <i>both genders</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of two genders, " +
					"use an alternative, such as <i>people, folks, human beings, all genders</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "ladiesAndGentleman",
				text: "This sentence contains the phrase ladies and gentlemen followed by something else.",
				expectedFeedback: "Be careful when using <i>ladies and gentlemen</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of men and women, " +
					"use an alternative, such as <i>everyone, folks, honored guests</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "mothersAndFathers",
				text: "This sentence contains the phrase mothers and fathers followed by something else.",
				expectedFeedback: "Be careful when using <i>mothers and fathers</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of people who use this term, " +
					"use an alternative, such as <i>parents</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "mothersAndFathers",
				text: "This sentence contains the phrase fathers and mothers followed by something else.",
				expectedFeedback: "Be careful when using <i>fathers and mothers</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of people who use this term, " +
					"use an alternative, such as <i>parents</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets words 'firemen' and 'policemen'", () => {
		const testData = [
			{
				identifier: "firemen",
				text: "Look at those firemen! They're putting out the fire.",
				expectedFeedback: "Be careful when using <i>firemen</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of men, use an alternative, " +
					"such as <i>firefighters</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "policemen",
				text: "Look at those policemen! They're doing something over there.",
				expectedFeedback: "Be careful when using <i>policemen</i> as it can be exclusionary. " +
					"Unless you are sure that the group you refer to only consists of men, use an alternative, " +
					"such as <i>police officers</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "Tests for potentially harmful non-inclusive words and phrases", () => {
	it( "targets non-inclusive phrases 'birth sex', 'natal sex', 'a transgender', 'transgendered', 'hermaphrodite(s)", () => {
		const testData = [
			{
				identifier: "birthSex",
				text: "This is a sentence that includes the phrase birth sex and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>birth sex</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>assigned sex, assigned sex at birth</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "birthSex",
				text: "This is a sentence that includes the phrase natal sex and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>natal sex</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>assigned sex, assigned sex at birth</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "aTransgender",
				text: "This is a sentence that includes the phrase a transgender and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>a transgender</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>transgender person</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "transgendered",
				text: "This is a sentence that includes the word transgendered and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>transgendered</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>transgender, trans</i> if referring to a person. " +
					"If referring to a transition process, consider using an alternative such as " +
					"<i>transitioned, went through a gender transition</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "hermaphrodite",
				text: "This is a sentence that includes the word hermaphrodite and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>hermaphrodite</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>intersex</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "hermaphrodites",
				text: "This is a sentence that includes the word hermaphrodites and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>hermaphrodites</i> as it is potentially harmful." +
					" Consider using an alternative, such as <i>intersex people</i>." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets potentially harmful phrases 'preferred pronouns' and 'preferred named'", () => {
		const testData = [
			{
				identifier: "preferredPronouns",
				text: "This is a sentence that includes the phrase preferred pronouns and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>preferred pronouns</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>pronouns</i>, unless referring to someone who " +
					"explicitly wants to use this term to describe their own pronouns. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "preferredName",
				text: "This is a sentence that includes the phrase preferred name and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>preferred name</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>name, affirming name</i>, unless referring to someone who " +
					"explicitly wants to use this term to describe their own name. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets phrases 'female-to-male'/'ftm' and 'male-to-female'/'mtf'", () => {
		const testData = [
			{
				identifier: "femaleToMale",
				text: "This is a sentence that includes the phrase female-to-male and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>female-to-male</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>trans man, transgender man</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "femaleToMale",
				text: "This is a sentence that includes the abbreviation ftm and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>ftm</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>trans man, transgender man</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "maleToFemale",
				text: "This is a sentence that includes the phrase male-to-female and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>male-to-female</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>trans woman, transgender woman</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "maleToFemale",
				text: "This is a sentence that includes the abbreviation mtf and then some pointless words at the end.",
				expectedFeedback: "Be careful when using <i>mtf</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>trans woman, transgender woman</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "Tests for non-inclusive phrases with derogatory usage", () => {
	it( "targets the words 'transgenders' and 'he-she'", () => {
		const testData = [
			{
				identifier: "transgenders",
				text: "This is a sentence that includes the word transgenders and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>transgenders</i> as it is derogatory. " +
					"Consider using an alternative, such as <i>trans people, transgender people</i>. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "heShe",
				text: "This is a sentence that includes the word he-she and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>he-she</i> as it is derogatory. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "targets the words 'shemale' and 'she-male'", () => {
		const testData = [
			{
				identifier: "shemale",
				text: "This is a sentence that includes the word shemale and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>shemale</i> as it is derogatory. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
			{
				identifier: "shemale",
				text: "This is a sentence that includes the word she-male and then some pointless words at the end.",
				expectedFeedback: "Avoid using <i>she-male</i> as it is derogatory. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 3,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );

describe( "A test for Gender assessments", function() {
	it( "should not target inclusive phrases", function() {
		const mockPaper = new Paper( "Look at those firefighters! They're putting out the fire." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at those firefighters!", "They're putting out the fire." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" ) );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );
	it( "correctly identifies 'the transgender' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "the transgender worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The transgender however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the transgender!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the transgender!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the transgender!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the transgender!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the transgender' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The transgender person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

describe( "a test for targeting (potentially) non-inclusive phrases in gender assessments", () => {
	it( "should return the appropriate score and feedback string for: 'transsexual' and its plural form", () => {
		const testData = [
			{
				identifier: "transsexual",
				text: "The term transsexual is a subset of transgender.",
				expectedFeedback: "Be careful when using <i>transsexual</i> as it is potentially harmful. " +
					"Consider using an alternative, such as <i>transgender</i>, " +
					"unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "transsexuals",
				text: "As of 2018, use of the noun form (e.g. referring to people as transsexuals) is often deprecated by " +
					"those in the transsexual community.",
				expectedFeedback: "Be careful when using <i>transsexuals</i> as it is potentially harmful." +
					" Consider using an alternative, such as <i>trans people, " +
					"transgender people</i>, unless referring to someone who explicitly wants to be referred to with this term." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'transwoman' and its plural form", () => {
		const testData = [
			{
				identifier: "transWoman",
				text: "A transwoman is a woman who was assigned male at birth.",
				expectedFeedback: "Be careful when using <i>transwoman</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>trans woman, transgender woman</i>, unless referring to someone who explicitly wants to be referred to with this term." +
					" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "transWomen",
				text: "Transwomen have a female gender identity, may experience gender dysphoria, and may transition.",
				expectedFeedback: "Be careful when using <i>transwomen</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>trans women, transgender women</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
	it( "should return the appropriate score and feedback string for: 'transman' and its plural form", () => {
		const testData = [
			{
				identifier: "transMan",
				text: "A transman is a man who was assigned female at birth.",
				expectedFeedback: "Be careful when using <i>transman</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>trans man, transgender man</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
			{
				identifier: "transMen",
				text: "Originally, the term transmen referred specifically to female-to-male transsexual people who underwent " +
					"hormone replacement therapy (HRT) or sex reassignment surgery (SRS), or both.",
				expectedFeedback: "Be careful when using <i>transmen</i> as it is potentially harmful. Consider using an alternative, such as " +
					"<i>trans men, transgender men</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
					"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
				expectedScore: 6,
			},
		];
		testInclusiveLanguageAssessments( testData );
	} );
} );
