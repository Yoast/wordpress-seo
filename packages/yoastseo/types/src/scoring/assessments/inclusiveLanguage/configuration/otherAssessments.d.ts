export default otherAssessments;
declare const otherAssessments: ({
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string[];
    score: number;
    feedbackFormat: string;
    rule?: undefined;
    ruleDescription?: undefined;
    caseSensitive?: undefined;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string[];
    score: number;
    feedbackFormat: string;
    rule: (words: any, nonInclusivePhrase: any) => number[];
    ruleDescription: string;
    caseSensitive?: undefined;
} | {
    identifier: string;
    nonInclusivePhrases: string[];
    inclusiveAlternatives: string[];
    score: number;
    feedbackFormat: string;
    caseSensitive: boolean;
    rule: (words: any, nonInclusivePhrase: any) => number[];
    ruleDescription: string;
})[];
