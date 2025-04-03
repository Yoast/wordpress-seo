export default cultureAssessments;
declare const cultureAssessments: ({
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string;
    score: number;
    feedbackFormat: string;
    caseSensitive: boolean;
    rule: (words: any, nonInclusivePhrase: any) => number[];
    ruleDescription: string;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string;
    score: number;
    feedbackFormat: string;
    caseSensitive?: undefined;
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
    caseSensitive?: undefined;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string;
    score: number;
    feedbackFormat: string;
    caseSensitive: boolean;
    rule?: undefined;
    ruleDescription?: undefined;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string[];
    score: number;
    feedbackFormat: string;
    caseSensitive?: undefined;
    rule?: undefined;
    ruleDescription?: undefined;
})[];
