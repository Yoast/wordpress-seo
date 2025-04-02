export default appearanceAssessments;
declare const appearanceAssessments: ({
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string;
    score: number;
    feedbackFormat: string;
    rule?: undefined;
    ruleDescription?: undefined;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string;
    score: number;
    feedbackFormat: string;
    rule: (words: any, nonInclusivePhrase: any) => number[];
    ruleDescription: string;
})[];
