import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";

const medicalCondition = "Avoid using \"%1$s\" unless talking about the specific medical condition. " +
	"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior such as \"%2$s\".";
const derogatory = "Avoid using \"%1$s\" as it is derogatory. Consider using \"%2$s\" instead.";

const disabilityAssessments =  [
	{
		identifier: "binge",
		nonInclusivePhrases: [ "bingeing", "binge" ],
		inclusiveAlternative: "indulging, satuating, wallowing",
		score: 6,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "wheelchairBound",
		nonInclusivePhrases: [ "wheelchair-bound", "wheelchair bound", "confined to a wheelchair" ],
		inclusiveAlternative: "uses a wheelchair/wheelchair user",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "mentallyRetarded",
		nonInclusivePhrases: [ "mentally retarded" ],
		inclusiveAlternative: "person with an intellectual disability",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		// Problematic, as it will also target the above phrase
		identifier: "retarded",
		nonInclusivePhrases: [ "retarded" ],
		inclusiveAlternative: "uninformed, ignorant, foolish, irrational, insensible",
		score: 3,
		feedbackFormat: derogatory,
	},
	{
		identifier: "cripple",
		nonInclusivePhrases: [ "a cripple" ],
		inclusiveAlternative: "person with a physical disability",
		score: 3,
		feedbackFormat: derogatory,
	},
	{
		identifier: "crippled",
		nonInclusivePhrases: [ "crippled" ],
		inclusiveAlternative: "has a physical disability",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "daft",
		nonInclusivePhrases: [ "daft" ],
		inclusiveAlternative: "dense, ignorant, foolish",
		score: 6,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapped",
		nonInclusivePhrases: [ "handicapped" ],
		inclusiveAlternative: "disabled, disabled person, person with a disability",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicap",
		nonInclusivePhrases: [ "handicap" ],
		inclusiveAlternative: "disability",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "insane",
		nonInclusivePhrases: [ "insane" ],
		inclusiveAlternative: "wild, confusing, unpredictable, impulsive, reckless, risk-taker, out of control, " +
			"unbelievable, incomprehensible, irrational, nonsensical, outrageous, ridiculous",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "imbecile",
		nonInclusivePhrases: [ "imbecile" ],
		inclusiveAlternative: "uninformed, ignorant, foolish",
		score: 3,
		feedbackFormat: derogatory,
	},
	{
		// Special string! y1 and y2
		identifier: "specialNeeds",
		nonInclusivePhrases: [ "special needs" ],
		inclusiveAlternative: "y1: functional needs, support needs; y2: disabled, disabled person, person with a disability",
		score: 3,
		feedbackFormat: "Avoid using \"%1$s\" as it is potentially harmful. " +
			"Consider using \"y1\" instead, or \"y2\" when using it to describe someone in terms of their disability.",
	},
	{
		identifier: "hardOfHearing",
		nonInclusivePhrases: [ "hard-of-hearing" ],
		inclusiveAlternative: "hard of hearing, partially deaf, has partial hearing loss",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "hearingImpaired",
		nonInclusivePhrases: [ "hearing impaired" ],
		inclusiveAlternative: "deaf or hard of hearing, partially deaf, has partial hearing loss",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		// No alternative?
		identifier: "functioning",
		nonInclusivePhrases: [ "high functioning", "low functioning" ],
		inclusiveAlternative: "",
		score: 6,
		feedbackFormat: "Avoid using \"%1$s\" as it is potentially harmful unless to refer to yourself or how you characterize your condition." +
			"Consider using a specific characteristic or experience if it is known.",
	},
	{
		identifier: "autismHigh",
		nonInclusivePhrases: [ "high functioning autism", "high-functioning autism" ],
		inclusiveAlternative: "autism with low support needs",
		score: 3,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "autismLow",
		nonInclusivePhrases: [ "low functioning autism", "low-functioning autism" ],
		inclusiveAlternative: "autism with high support needs",
		score: 3,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "lame",
		nonInclusivePhrases: [ "lame" ],
		inclusiveAlternative: "boring, uninteresting, uncool",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "suicide",
		nonInclusivePhrases: [ "commit suicide", "committed suicide" ],
		inclusiveAlternative: "took their life, died by suicide, killed themself",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "handicapParking",
		nonInclusivePhrases: [ "handicap parking", "disabled parking" ],
		inclusiveAlternative: "accessible parking",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "fellOnDeafEars",
		nonInclusivePhrases: [ "fell on deaf ears" ],
		inclusiveAlternative: "was not addressed",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "turnOnBlindEye",
		nonInclusivePhrases: [ "turn a blind eye" ],
		inclusiveAlternative: "ignore",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "blindLeadingBlind",
		nonInclusivePhrases: [ "the blind leading the blind" ],
		inclusiveAlternative: "ignorant, insensitive, misguided",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "disabledBathroom",
		nonInclusivePhrases: [ "disabled bathroom", "disabled bathrooms", "handicap bathroom", "handicap bathrooms" ],
		inclusiveAlternative: "accessible bathroom(s)",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "disabledToilet",
		nonInclusivePhrases: [ "disabled toilet", "disabled toilets", "handicap toilet", "handicap toilets" ],
		inclusiveAlternative: "accessible toilet(s)",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		// Special string! y1 and y2
		identifier: "dumb",
		nonInclusivePhrases: [ "dumb" ],
		inclusiveAlternative: "1. uninformed, ignorant, foolish, inconsiderate, insensible, irrational, reckless " +
			"(if used in the same sense as 'stupid'), " +
			"2. deaf people who don't speak",
		score: 3,
		feedbackFormat: "Avoid using \"%1$s\" as it is potentially harmful. " +
			"Consider using \"y1\" instead, or \"y2\" when using it to describe someone in terms of their disability.",
	},
	{
		identifier: "deaf",
		nonInclusivePhrases: [ "deaf-mute", "deaf and dumb" ],
		inclusiveAlternative: "deaf",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "addict",
		nonInclusivePhrases: [ "addict" ],
		inclusiveAlternative: "person with a (drug, alcohol,...) addiction/ person with substance abuse disorder",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "addicts",
		nonInclusivePhrases: [ "addicts" ],
		inclusiveAlternative: "people with a (drug, alcohol,...) addiction/ people with substance abuse disorder",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "brainDamaged",
		nonInclusivePhrases: [ "brain-damaged" ],
		inclusiveAlternative: "person with a (traumatic) brain injury",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "differentlyAbled",
		nonInclusivePhrases: [ "differently abled", "differently-abled" ],
		inclusiveAlternative: "disabled, disabled person, person with a disability",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "epilepticFit",
		nonInclusivePhrases: [ "epileptic fit" ],
		inclusiveAlternative: "seizure",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "sanityCheck",
		nonInclusivePhrases: [ "sanity check" ],
		inclusiveAlternative: "final check; confidence check; rationality check; soundness check; OR be specific about what you're checknig",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "crazy",
		nonInclusivePhrases: [ "crazy" ],
		inclusiveAlternative: "baffling, startling, suprising, shocking, wild, confusing, unpredictable",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "psychopathic",
		nonInclusivePhrases: [ "psychopath", "psychopathic" ],
		inclusiveAlternative: "selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "schizophrenic",
		nonInclusivePhrases: [ "schizophrenic" ],
		inclusiveAlternative: "of two minds, chaotic, confusing",
		score: 6,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "bipolar",
		nonInclusivePhrases: [ "bipolar" ],
		inclusiveAlternative: "of two minds, chaotic, confusing",
		score: 6,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "handicapStall",
		nonInclusivePhrases: [ "handicap stall" ],
		inclusiveAlternative: "accessible stall",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "paranoid",
		nonInclusivePhrases: [ "paranoid" ],
		inclusiveAlternative: "overly suspicious, unreasonable, defensive",
		score: 6,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "manic",
		nonInclusivePhrases: [ "manic" ],
		inclusiveAlternative: "excited, raving, unbalanced, wild",
		score: 6,
		feedbackFormat: medicalCondition,
	},
	{
		identifier: "hysterical",
		nonInclusivePhrases: [ "hysterical" ],
		inclusiveAlternative: "intense, vehement, piercing, chaotic",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "psycho",
		nonInclusivePhrases: [ "psycho" ],
		inclusiveAlternative: "selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "neurotic",
		nonInclusivePhrases: [ "neurotic", "lunatic" ],
		inclusiveAlternative: "baffling, startling, surprising, shocking, wild, confusing, unpredictable",
		score: 3,
		feedbackFormat: potentiallyHarmful,
	},
	{
		// Special string! y1 and y2
		identifier: "sociopath",
		nonInclusivePhrases: "sociopath",
		inclusiveAlternative: "1. Person with antisocial personality disorder, " +
			"2. selfish, toxic, manipulative, wild, confusing, unpredictable, impulsive, reckless, out of control",
		score: 6,
		feedbackFormat: "Avoid using \"%1$s\" unless talking about the specific medical condition (in which case, use \"y1\"). " +
			"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior such as \"y2\".",
	},
	{
		// Special string! y1 and y2
		identifier: "narcissistic",
		nonInclusivePhrases: "narcissistic",
		inclusiveAlternative: "1. Person with narcissistic personality disorder, " +
			"2. selfish, egotistical, self-centered, self-absorbed, vain, toxic, manipulative",
		score: 6,
		feedbackFormat: "Avoid using \"%1$s\" unless talking about the specific medical condition (in which case, use \"y1\"). " +
			"If you are not referencing the medical condition, consider other alternatives to describe the trait or behavior such as \"y2\".",
	},
];

export default disabilityAssessments;

