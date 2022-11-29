# Overview of the inclusive language analysis scoring criteria

For every (potentially) non-inclusive word or phrase that is found in the text, a red or orange bullet is shown.
A red bullet means that the targeted word or phrase is never inclusive, regardless of context.
An orange bullet means that the targeted word of phrase is _potentially_ non-inclusive, depending on the context in which it is used.

The targeted words and phrases are divided into the following categories:
* [age](inclusiveLanguage/configuration/ageAssessments.js)
* [appearance](inclusiveLanguage/configuration/appearanceAssessments.js)
* [culture](inclusiveLanguage/configuration/cultureAssessments.js)
* [disability](inclusiveLanguage/configuration/disabilityAssessments.js)
* [gender](inclusiveLanguage/configuration/genderAssessments.js)
* [socio-economic status](inclusiveLanguage/configuration/sesAssessments.js)
* [other](inclusiveLanguage/configuration/otherAssessments.js)

The list of targeted words and phrases, together with the feedback strings that are shown for each found word/phrase,
can be found in the files linked in the list above.

Each object in these files represents a targeted word/phrase, or sometimes a set of word/phrases with the same properties.
- The `nonInclusivePhrases` property of the object contains the targeted word(s) or phrase(s)
- The `inclusiveAlternatives` property contains the inclusive alternatives that are suggested in the feedback string
- The `score` property contains the score associated with the word/phrase (3 or 6, corresponding to red or orange bullet)
- The `feedbackFormat` property contains the feedback string that should be shown if this word/phrase is found.
- The `learnMoreUrl` property contains the URL to a help article for the category that the word/phrase belongs to (so the URL is the same for the whole file)
- The `caseSensitive` property specifies whether the word/phrase should be targeted only if it is found in the same case as in `nonInclusivePhrases` (if the property is absent, the default value of `false` applies)
- The (optional) `rule` property specifies a rule based on which the word/phrase should be targeted. For example, if a word/phrase should only be targeted if specific words precede or follow it.


