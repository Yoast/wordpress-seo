import {
	potentiallyHarmful,
	potentiallyHarmfulCareful,
	potentiallyHarmfulUnless,
} from "./feedbackStrings";
import { isFollowedByException, isNotFollowedByException } from "../helpers/isFollowedByException";
import { isFollowedByParticiple } from "../helpers/isFollowedByParticiple";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";
import { nonNouns } from "../../../../languageProcessing/languages/en/config/functionWords";
import { punctuationRegexString } from "../../../../languageProcessing/helpers/sanitize/removePunctuation";

const derogatory = "Avoid using <i>%1$s</i> as it is derogatory. Consider using an alternative, such as %2$s instead.";
const generalizing = "Avoid using <i>%1$s</i> as it is generalizing. Consider using an alternative, such as %2$s instead.";

const medicalCondition = "Avoid using <i>%1$s</i>, unless talking about the specific medical condition. " +
	"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior, such as %2$s.";
const potentiallyHarmfulTwoAlternatives = "Avoid using <i>%1$s</i> as it is potentially harmful. " +
	"Consider using an alternative, such as %2$s when referring to someone's needs, or %3$s when referring to a person.";

const learnMoreUrl = "https://yoa.st/inclusive-language-disability";

const punctuationList = punctuationRegexString.split( "" );

const disabilityAssessments =  [
	{
		identifier: "binge",
		nonInclusivePhrases: [ "bingeing", "binge" ],
		inclusiveAlternatives: "<i>indulging, satuating, wallowing</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "wheelchairBound",
		nonInclusivePhrases: [ "wheelchair-bound", "wheelchair bound", "confined to a wheelchair" ],
		inclusiveAlternatives: "<i>uses a wheelchair, is a wheelchair user</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "mentallyRetarded",
		nonInclusivePhrases: [ "mentally retarded" ],
		inclusiveAlternatives: "<i>person with an intellectual disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "retarded",
		nonInclusivePhrases: [ "retarded" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish, irrational, insensible</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( isPrecededByException( words, [ "mentally" ] ) );
		},
	},
	{
		identifier: "alcoholic",
		nonInclusivePhrases: [ "an alcoholic" ],
		inclusiveAlternatives: "<i>person with alcohol use disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => includesConsecutiveWords( words, nonInclusivePhrases )
			.filter( isFollowedByException( words, nonInclusivePhrases, [ "drink", "beverage" ] ) ),
	},
	{
		identifier: "alcoholics",
		nonInclusivePhrases: [ "alcoholics" ],
		inclusiveAlternatives: "<i>people with alcohol use disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => includesConsecutiveWords( words, nonInclusivePhrases )
			.filter( isFollowedByException( words, nonInclusivePhrases, [ "anonymous" ] ) ),
	},
	{
		identifier: "cripple",
		nonInclusivePhrases: [ "a cripple" ],
		inclusiveAlternatives: "<i>person with a physical disability, a physically disabled person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "crippled",
		nonInclusivePhrases: [ "crippled" ],
		inclusiveAlternatives: "<i>has a physical disability, is physically disabled</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "daft",
		nonInclusivePhrases: [ "daft" ],
		inclusiveAlternatives: "<i>dense, ignorant, foolish</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicapped",
		nonInclusivePhrases: [ "handicapped" ],
		inclusiveAlternatives: "<i>disabled, person with a disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicap",
		nonInclusivePhrases: [ "handicap" ],
		inclusiveAlternatives: "<i>disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => includesConsecutiveWords( words, nonInclusivePhrases )
			.filter( isFollowedByException( words, nonInclusivePhrases, [ "toilet", "toilets", "parking", "bathroom",
				"bathrooms", "stall", "stalls" ] ) ),
	},
	{
		identifier: "insane",
		nonInclusivePhrases: [ "insane" ],
		inclusiveAlternatives: "<i>wild, confusing, unpredictable, impulsive, reckless, out of control, " +
			"unbelievable, incomprehensible, irrational, nonsensical, outrageous, ridiculous</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "imbecile",
		nonInclusivePhrases: [ "imbecile" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "specialNeeds",
		nonInclusivePhrases: [ "special needs" ],
		inclusiveAlternatives: [ "<i>functional needs, support needs</i>", "<i>disabled, person with a disability</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulTwoAlternatives,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "hardOfHearing",
		nonInclusivePhrases: [ "hard-of-hearing" ],
		inclusiveAlternatives: "<i>hard of hearing, partially deaf, has partial hearing loss</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "hearingImpaired",
		nonInclusivePhrases: [ "hearing impaired" ],
		inclusiveAlternatives: "<i>deaf or hard of hearing, partially deaf, has partial hearing loss</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "functioning",
		nonInclusivePhrases: [ "high functioning", "low functioning" ],
		inclusiveAlternatives: "describing the specific characteristic or experience",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => includesConsecutiveWords( words, nonInclusivePhrases )
			.filter( isFollowedByException( words, nonInclusivePhrases, [ "autism" ] ) ),
	},
	{
		identifier: "autismHigh",
		nonInclusivePhrases: [ "high functioning autism", "high-functioning autism" ],
		inclusiveAlternatives: "<i>autism with high support needs</i> or describing the specific characteristic or experience",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "autismLow",
		nonInclusivePhrases: [ "low functioning autism", "low-functioning autism" ],
		inclusiveAlternatives: "<i>autism with low support needs</i> or describing the specific characteristic or experience",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "lame",
		nonInclusivePhrases: [ "lame" ],
		inclusiveAlternatives: "<i>boring, lousy, unimpressive, sad, corny</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "suicide",
		nonInclusivePhrases: [ "commit suicide", "committing suicide", "commits suicide", "committed suicide" ],
		inclusiveAlternatives: "<i>took their life, died by suicide, killed themself</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicapParking",
		nonInclusivePhrases: [ "handicap parking" ],
		inclusiveAlternatives: "<i>accessible parking</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "fellOnDeafEars",
		nonInclusivePhrases: [ "fell on deaf ears" ],
		inclusiveAlternatives: "<i>was not addressed, was ignored, was disregarded</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "turnOnBlindEye",
		nonInclusivePhrases: [ "turn a blind eye" ],
		inclusiveAlternatives: "<i>ignore, pretend not to notice</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "blindLeadingBlind",
		nonInclusivePhrases: [ "the blind leading the blind" ],
		inclusiveAlternatives: "<i>ignorant, misguided, incompetent, unqualified, insensitive, unaware</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicapBathroom",
		nonInclusivePhrases: [ "handicap bathroom", "handicap bathrooms" ],
		inclusiveAlternatives: "<i>accessible bathroom(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicapToilet",
		nonInclusivePhrases: [ "handicap toilet", "handicap toilets" ],
		inclusiveAlternatives: "<i>accessible toilet(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "handicapStall",
		nonInclusivePhrases: [ "handicap stall", "handicap stalls" ],
		inclusiveAlternatives: "<i>accessible stall(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "dumb",
		nonInclusivePhrases: [ "dumb" ],
		inclusiveAlternatives: [ "<i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( isPrecededByException( words, [ "deaf and" ] ) );
		},
	},
	{
		identifier: "deaf",
		nonInclusivePhrases: [ "deaf-mute", "deaf and dumb" ],
		inclusiveAlternatives: "<i>deaf</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "addict",
		nonInclusivePhrases: [ "addict" ],
		inclusiveAlternatives: "<i>person with a (drug, alcohol, ...) addiction, person with substance abuse disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "addicts",
		nonInclusivePhrases: [ "addicts" ],
		inclusiveAlternatives: "<i>people with a (drug, alcohol, ...) addiction, people with substance abuse disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "brainDamaged",
		nonInclusivePhrases: [ "brain-damaged" ],
		inclusiveAlternatives: "<i>person with a (traumatic) brain injury</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "differentlyAbled",
		nonInclusivePhrases: [ "differently abled", "differently-abled" ],
		inclusiveAlternatives: "<i>disabled, person with a disability</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "epilepticFit",
		nonInclusivePhrases: [ "epileptic fit" ],
		inclusiveAlternatives: "<i>epileptic seizure</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "sanityCheck",
		nonInclusivePhrases: [ "sanity check" ],
		inclusiveAlternatives: "<i>final check, confidence check, rationality check, soundness check</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternatives: "<i>wild, baffling, startling, chaotic, shocking, confusing, reckless, unpredictable</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "psychopathic",
		nonInclusivePhrases: [ "psychopath", "psychopathic" ],
		inclusiveAlternatives: "<i>toxic, manipulative, unpredictable, impulsive, reckless, out of control</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "schizophrenic",
		nonInclusivePhrases: [ "schizophrenic", "bipolar" ],
		inclusiveAlternatives: "<i>of two minds, chaotic, confusing</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "paranoid",
		nonInclusivePhrases: [ "paranoid" ],
		inclusiveAlternatives: "<i>overly suspicious, unreasonable, defensive</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "manic",
		nonInclusivePhrases: [ "manic" ],
		inclusiveAlternatives: "<i>excited, raving, unbalanced, wild</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "hysterical",
		nonInclusivePhrases: [ "hysterical" ],
		inclusiveAlternatives: "<i>intense, vehement, piercing, chaotic</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "psycho",
		nonInclusivePhrases: [ "psycho" ],
		inclusiveAlternatives: "<i>toxic, distraught, unpredictable, reckless, out of control</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "neurotic",
		nonInclusivePhrases: [ "neurotic", "lunatic" ],
		inclusiveAlternatives: "<i>distraught, unstable, startling, confusing, baffling</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "sociopath",
		nonInclusivePhrases: [ "sociopath" ],
		inclusiveAlternatives: [ "<i>person with antisocial personality disorder</i>",
			"<i>toxic, manipulative, cruel</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially harmful. If you are referencing the " +
			"medical condition, use %2$s instead, unless referring to someone who explicitly wants to be referred to with this term. " +
			"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior, such as %3$s.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "narcissistic",
		nonInclusivePhrases: [ "narcissistic" ],
		inclusiveAlternatives: [ "<i>person with narcissistic personality disorder</i>",
			"<i>selfish, egotistical, self-centered, self-absorbed, vain, toxic, manipulative</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially harmful. If you are referencing the " +
			"medical condition, use %2$s instead. If you are not referencing the medical condition, consider other" +
			" alternatives to describe the trait or behavior, such as %3$s.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "theMentallyIll",
		nonInclusivePhrases: [ "the mentally ill" ],
		inclusiveAlternatives: "<i>people who are mentally ill/ mentally ill people </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ generalizing ].join( " " ),
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( ( ( index ) => {
					return isNotFollowedByException( words, nonInclusivePhrases, nonNouns )( index ) ||
					isFollowedByParticiple( words, nonInclusivePhrases )( index ) ||
					isNotFollowedByException( words, nonInclusivePhrases, punctuationList )( index );
				} ) );
		},
	},
	{
		identifier: "theDisabled",
		nonInclusivePhrases: [ "the disabled" ],
		inclusiveAlternatives: "<i>people who have a disability/ disabled people </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful ].join( " " ),
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( ( ( index ) => {
					return isNotFollowedByException( words, nonInclusivePhrases, nonNouns )( index ) ||
					isFollowedByParticiple( words, nonInclusivePhrases )( index ) ||
					isNotFollowedByException( words, nonInclusivePhrases, punctuationList )( index );
				} ) );
		},
	},
];

export default disabilityAssessments;
