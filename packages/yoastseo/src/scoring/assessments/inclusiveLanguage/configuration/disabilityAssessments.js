import {
	potentiallyHarmful,
	potentiallyHarmfulCareful,
	potentiallyHarmfulUnless,
	harmfulPotentiallyNonInclusive,
	alternative,
} from "./feedbackStrings";
import { isPrecededByException, isNotPrecededByException } from "../helpers/isPrecededByException";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { isNotFollowedAndPrecededByException } from "../helpers/isFollowedAndPrecededByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";
import disabilityRules from "./disabilityRulesData";
import { sprintf } from "@wordpress/i18n";

/*
 * Used for derogatory terms, such as 'cripple'.
 *
 * "Avoid using <i>%1$s</i> as it is derogatory. Consider using an alternative, such as %2$s instead."
 */
const derogatory = "Avoid using <i>%1$s</i> as it is derogatory. Consider using an alternative, such as %2$s instead.";
/*
 * Used for generalizing terms, such as 'the mentally ill'.
 *
 * "Avoid using <i>%1$s</i> as it is generalizing. Consider using an alternative, such as %2$s instead."
 */
const generalizing = "Avoid using <i>%1$s</i> as it is generalizing. Consider using an alternative, such as %2$s instead.";
/*
 * Used for terms that are inclusive only if you are referring to a medical condition, for example 'manic' or 'OCD'.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Unless you are referencing the specific medical condition, consider using another
 * alternative to describe the trait or behavior, such as %2$s. "
 */
const medicalCondition = harmfulPotentiallyNonInclusive +
	" Unless you are referencing the specific medical condition, consider using another alternative to describe the trait or behavior, such as %2$s.";
/*
 * Used for the term 'special needs'.
 *
 * "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, such as %2$s when referring to someone's needs,
 * or %3$s when referring to a person."
 */
const potentiallyHarmfulTwoAlternatives = "Avoid using <i>%1$s</i> as it is potentially harmful. " +
	"Consider using an alternative, such as %2$s when referring to someone's needs, or %3$s when referring to a person.";
/*
 * Used for phrases with 'crazy'. We don't want to mention the whole phrase in the feedback but only the non-inclusive word 'crazy'.
 *
 * "Avoid using <i>crazy</i> as it is potentially harmful. Consider using an alternative, such as %2$s."
 */
const phrasesWithCrazyFeedback = [ "Avoid using <i>crazy</i> as it is potentially harmful.", alternative ].join( " " );

const disabilityAssessments =  [
	{
		identifier: "binge",
		nonInclusivePhrases: [ "binge" ],
		inclusiveAlternatives: "<i>indulge, satiate, wallow, spree, marathon, consume excessively</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i>, unless talking about a symptom of a medical condition. " +
			"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, such as %2$s.",
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "drink", "drinks", "drinking" ] ) ),
	},
	{
		identifier: "bingeing",
		nonInclusivePhrases: [ "bingeing", "binging" ],
		inclusiveAlternatives: "<i>indulging, satiating, wallowing, spreeing, marathoning, consuming excessively</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i>, unless talking about a symptom of a medical condition. " +
			"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, such as %2$s.",
	},
	{
		identifier: "binged",
		nonInclusivePhrases: [ "binged" ],
		inclusiveAlternatives: "<i>indulged, satiated, wallowed, spreed, marathoned, consumed excessively</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i>, unless talking about a symptom of a medical condition. " +
			"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, such as %2$s.",
	},
	{
		identifier: "binges",
		nonInclusivePhrases: [ "binges" ],
		inclusiveAlternatives: "<i>indulges, satiates, wallows, sprees, marathons, consumes excessively</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i>, unless talking about a symptom of a medical condition. " +
			"If you are not referencing a symptom, consider other alternatives to describe the trait or behavior, such as %2$s.",
	},
	{
		identifier: "wheelchairBound",
		nonInclusivePhrases: [ "wheelchair-bound", "wheelchair bound", "confined to a wheelchair" ],
		inclusiveAlternatives: "<i>uses a wheelchair, is a wheelchair user</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "mentallyRetarded",
		nonInclusivePhrases: [ "mentally retarded" ],
		inclusiveAlternatives: "<i>person with an intellectual disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "retarded",
		nonInclusivePhrases: [ "retarded" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish, irrational, insensible</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isPrecededByException( words, [ "mentally" ] ) );
		},
	},
	{
		identifier: "alcoholic",
		nonInclusivePhrases: [ "an alcoholic" ],
		inclusiveAlternatives: "<i>person with alcohol use disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "drink", "beverage" ] ) ),
	},
	{
		identifier: "alcoholics",
		nonInclusivePhrases: [ "alcoholics" ],
		inclusiveAlternatives: "<i>people with alcohol use disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "anonymous" ] ) ),
	},
	{
		identifier: "cripple",
		nonInclusivePhrases: [ "a cripple" ],
		inclusiveAlternatives: "<i>person with a physical disability, a physically disabled person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
	},
	{
		identifier: "crippled",
		nonInclusivePhrases: [ "crippled" ],
		inclusiveAlternatives: "<i>has a physical disability, is physically disabled</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "daft",
		nonInclusivePhrases: [ "daft" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
	},
	{
		identifier: "handicapped",
		nonInclusivePhrases: [ "handicapped" ],
		inclusiveAlternatives: "<i>disabled, person with a disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicap",
		nonInclusivePhrases: [ "handicap" ],
		inclusiveAlternatives: "<i>disability</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "toilet", "toilets", "parking", "bathroom",
				"bathrooms", "stall", "stalls" ] ) ),
	},
	{
		identifier: "insane",
		nonInclusivePhrases: [ "insane" ],
		inclusiveAlternatives: "<i>wild, confusing, unpredictable, impulsive, reckless, out of control, " +
			"unbelievable, amazing, incomprehensible, nonsensical, outrageous, ridiculous</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "imbecile",
		nonInclusivePhrases: [ "imbecile" ],
		inclusiveAlternatives: "<i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
	},
	{
		identifier: "specialNeeds",
		nonInclusivePhrases: [ "special needs" ],
		inclusiveAlternatives: [ "<i>functional needs, support needs</i>", "<i>disabled, person with a disability</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulTwoAlternatives,
	},
	{
		identifier: "hardOfHearing",
		nonInclusivePhrases: [ "hard-of-hearing" ],
		inclusiveAlternatives: "<i>hard of hearing, partially deaf, has partial hearing loss</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "hearingImpaired",
		nonInclusivePhrases: [ "hearing impaired" ],
		inclusiveAlternatives: "<i>deaf or hard of hearing, partially deaf, has partial hearing loss</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "functioning",
		nonInclusivePhrases: [ "high functioning", "low functioning" ],
		inclusiveAlternatives: "describing the specific characteristic or experience",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "autism" ] ) ),
	},
	{
		identifier: "autismHigh",
		nonInclusivePhrases: [ "high functioning autism", "high-functioning autism" ],
		inclusiveAlternatives: "<i>autism with high support needs</i> or describing the specific characteristic or experience",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
	},
	{
		identifier: "autismLow",
		nonInclusivePhrases: [ "low functioning autism", "low-functioning autism" ],
		inclusiveAlternatives: "<i>autism with low support needs</i> or describing the specific characteristic or experience",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s, unless referring to how you characterize your own condition.",
	},
	{
		identifier: "lame",
		nonInclusivePhrases: [ "lame" ],
		inclusiveAlternatives: "<i>boring, lousy, unimpressive, sad, corny</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "lamer",
		nonInclusivePhrases: [ "lamer" ],
		inclusiveAlternatives: "<i>more boring, lousier, more unimpressive, sadder, cornier</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "lamest",
		nonInclusivePhrases: [ "lamest" ],
		inclusiveAlternatives: "<i>most boring, lousiest, most unimpressive, saddest, corniest</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "commitSuicide",
		nonInclusivePhrases: [ "commit suicide" ],
		inclusiveAlternatives: "<i>take one's life, die by suicide, kill oneself</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "committingSuicide",
		nonInclusivePhrases: [ "committing suicide" ],
		inclusiveAlternatives: "<i>taking one's life, dying by suicide, killing oneself</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "commitsSuicide",
		nonInclusivePhrases: [ "commits suicide" ],
		inclusiveAlternatives: "<i>takes one's life, dies by suicide, kills oneself</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "committedSuicide",
		nonInclusivePhrases: [ "committed suicide" ],
		inclusiveAlternatives: "<i>took one's life, died by suicide, killed themself</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapParking",
		nonInclusivePhrases: [ "handicap parking" ],
		inclusiveAlternatives: "<i>accessible parking</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "fellOnDeafEars",
		nonInclusivePhrases: [ "fell on deaf ears" ],
		inclusiveAlternatives: "<i>was not addressed, was ignored, was disregarded</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "turnOnBlindEye",
		nonInclusivePhrases: [ "turn a blind eye" ],
		inclusiveAlternatives: "<i>ignore, pretend not to notice</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "blindLeadingBlind",
		nonInclusivePhrases: [ "the blind leading the blind" ],
		inclusiveAlternatives: "<i>ignorant, misguided, incompetent, unqualified, insensitive, unaware</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapBathroom",
		nonInclusivePhrases: [ "handicap bathroom", "handicap bathrooms" ],
		inclusiveAlternatives: "<i>accessible bathroom(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapToilet",
		nonInclusivePhrases: [ "handicap toilet", "handicap toilets" ],
		inclusiveAlternatives: "<i>accessible toilet(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapStall",
		nonInclusivePhrases: [ "handicap stall", "handicap stalls" ],
		inclusiveAlternatives: "<i>accessible stall(s)</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "stupid",
		nonInclusivePhrases: [ "stupid" ],
		inclusiveAlternatives: [ "<i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "dumb",
		nonInclusivePhrases: [ "dumb", "dumber", "dumbest" ],
		inclusiveAlternatives: [ "<i>uninformed, ignorant, foolish, inconsiderate, irrational, reckless</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isPrecededByException( words, [ "deaf and" ] ) );
		},
	},
	{
		identifier: "deaf",
		nonInclusivePhrases: [ "deaf-mute", "deaf and dumb" ],
		inclusiveAlternatives: "<i>deaf</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "addict",
		nonInclusivePhrases: [ "addict" ],
		inclusiveAlternatives: "<i>person with a (drug, alcohol, ...) addiction, person with substance abuse disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "addicts",
		nonInclusivePhrases: [ "addicts" ],
		inclusiveAlternatives: "<i>people with a (drug, alcohol, ...) addiction, people with substance abuse disorder</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "brainDamaged",
		nonInclusivePhrases: [ "brain-damaged" ],
		inclusiveAlternatives: "<i>person with a (traumatic) brain injury</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "differentlyAbled",
		nonInclusivePhrases: [ "differently abled", "differently-abled" ],
		inclusiveAlternatives: "<i>disabled, person with a disability</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "epilepticFit",
		nonInclusivePhrases: [ "epileptic fit" ],
		inclusiveAlternatives: "<i>epileptic seizure</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "epilepticFits",
		nonInclusivePhrases: [ "epileptic fits" ],
		inclusiveAlternatives: "<i>epileptic seizures</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "sanityCheck",
		nonInclusivePhrases: [ "sanity check" ],
		inclusiveAlternatives: "<i>final check, confidence check, rationality check, soundness check</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "to be not crazy about",
		nonInclusivePhrases: [ "crazy about" ],
		inclusiveAlternatives: "<i>to be not impressed by, to be not enthusiastic about, to be not into, to not like</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: phrasesWithCrazyFeedback,
		// Target only when preceded by a form of "to be", the negation "not", and an an optional intensifier (e.g. "is not so crazy about" ).
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotPrecededByException( words, disabilityRules.formsOfToBeNotWithOptionalIntensifier ) );
		},
	},
	{
		identifier: "to be crazy about",
		nonInclusivePhrases: [ "crazy about" ],
		inclusiveAlternatives: "<i>to love, to be obsessed with, to be infatuated with</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: phrasesWithCrazyFeedback,
		// Target only when preceded by a form of "to be" and an an optional intensifier (e.g. "am so crazy about")
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotPrecededByException( words, disabilityRules.formsOfToBeWithOptionalIntensifier ) );
		},
	},
	{
		identifier: "crazy in love",
		nonInclusivePhrases: [ "crazy in love" ],
		inclusiveAlternatives: "<i>wildly in love, head over heels, infatuated</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: phrasesWithCrazyFeedback,
	},
	{
		identifier: "to go crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternatives: "<i>to go wild, to go out of control, to go up the wall, to be aggravated," +
			" to get confused</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		// Target only when preceded by a form of "to go" (e.g. 'going crazy').
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotPrecededByException( words, disabilityRules.formsOfToGo ) );
		},
	},
	{
		identifier: "to drive crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternatives: "<i>to drive one to their limit, to get on one's last nerve, to make one livid, to aggravate, " +
			"to make one's blood boil, to exasperate, to get into one's head</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		// Target only when preceded by a form of 'to drive' and an object pronoun (e.g. 'driving me crazy', 'drove everyone crazy').
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotPrecededByException( words, disabilityRules.combinationsOfDriveAndObjectPronoun ) );
		},
	},
	{
		identifier: "crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternatives: "<i>wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, chaotic, " +
			"confused, mistaken, obsessed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		// Don't target when 'crazy' is part of a more specific phrase that we target.
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isPrecededByException( words, disabilityRules.shouldNotPrecedeStandaloneCrazy ) )
				.filter( isNotFollowedByException( words, nonInclusivePhrase, disabilityRules.shouldNotFollowStandaloneCrazy ) )
				.filter( isNotFollowedAndPrecededByException( words, nonInclusivePhrase,
					disabilityRules.shouldNotPrecedeStandaloneCrazyWhenFollowedByAbout,
					disabilityRules.shouldNotFollowStandaloneCrazyWhenPrecededByToBe ) );
		},
	},
	{
		identifier: "crazier",
		nonInclusivePhrases: [ "crazier" ],
		inclusiveAlternatives: "<i>more wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
			"chaotic, confused, mistaken, obsessed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "craziest",
		nonInclusivePhrases: [ "craziest" ],
		inclusiveAlternatives: "<i>most wild, baffling, out of control, inexplicable, unbelievable, aggravating, shocking, intense, impulsive, " +
			"chaotic, confused, mistaken, obsessed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "psychopathic",
		nonInclusivePhrases: [ "psychopath", "psychopaths", "psychopathic" ],
		inclusiveAlternatives: "<i>toxic, manipulative, unpredictable, impulsive, reckless, out of control</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "schizophrenic",
		nonInclusivePhrases: [ "schizophrenic", "bipolar" ],
		inclusiveAlternatives: "<i>of two minds, chaotic, confusing</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "paranoid",
		nonInclusivePhrases: [ "paranoid" ],
		inclusiveAlternatives: "<i>overly suspicious, unreasonable, defensive</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "manic",
		nonInclusivePhrases: [ "manic" ],
		inclusiveAlternatives: "<i>excited, raving, unbalanced, wild</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "hysterical",
		nonInclusivePhrases: [ "hysterical" ],
		inclusiveAlternatives: "<i>intense, vehement, piercing, chaotic</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "psycho",
		nonInclusivePhrases: [ "psycho", "psychos" ],
		inclusiveAlternatives: "<i>toxic, distraught, unpredictable, reckless, out of control</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "neurotic",
		nonInclusivePhrases: [ "neurotic", "lunatic" ],
		inclusiveAlternatives: "<i>distraught, unstable, startling, confusing, baffling</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
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
	},
	{
		identifier: "sociopaths",
		nonInclusivePhrases: [ "sociopaths" ],
		inclusiveAlternatives: [ "<i>people with antisocial personality disorder</i>",
			"<i>toxic, manipulative, cruel</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially harmful. If you are referencing the " +
			"medical condition, use %2$s instead, unless referring to someone who explicitly wants to be referred to with this term. " +
			"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior, such as %3$s.",
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
	},
	{
		identifier: "OCD",
		nonInclusivePhrases: [ "ocd" ],
		inclusiveAlternatives: "<i>pedantic, obsessed, perfectionist</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		// We make sure to always capitalize "OCD" by pre-filling the first replacement variable.
		feedbackFormat: [ sprintf( medicalCondition, "OCD", "%2$s" ),
			"If you are referring to someone who has the medical condition, " +
			"then state that they have OCD rather than that they are OCD." ].join( " " ),
		// Only target 'OCD' when preceded by a form of 'to be/to get' followed by an optional intensifier.
		rule: ( words, inclusivePhrases ) => {
			return includesConsecutiveWords( words, inclusivePhrases )
				.filter( isNotPrecededByException( words, disabilityRules.formsOfToBeAndToBeNotWithOptionalIntensifier ) );
		},
	},
	{
		identifier: "theMentallyIll",
		nonInclusivePhrases: [ "the mentally ill" ],
		inclusiveAlternatives: "<i>people who are mentally ill</i>, <i>mentally ill people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ generalizing ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
	{
		identifier: "theDisabled",
		nonInclusivePhrases: [ "the disabled" ],
		inclusiveAlternatives: "<i>people who have a disability</i>, <i>disabled people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
];


disabilityAssessments.forEach( assessment => {
	assessment.category = "disability";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-disability";
} );

export default disabilityAssessments;
