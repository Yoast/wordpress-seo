# How does morphology on `yoastseo` work?
## General architecture
### Morphological research
Morphological analysis of keyphrase and synonyms is implemented as a research. This means that:

* The [relevant script](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/yoastseo/src/languageProcessing/researches/getWordForms.js) is added in the `researches` folder next to the other _more conventional_ researches
* The results of the morphological analysis can be required through `researcher.getResearch( "morphology" )`

The language-specific information about how morphological forms of words should be built, is supplied separately from the researcher, in a data file in a private repository `Yoast/YoastSEO.js-premium-configuration`. This allows to control who has access to this file (i.e. Premium, but not Free), as well as (in prospective) makes data distribution more efficient, as a user needs to only access the data for his/her language. Currently, morphological analysis is available for Premium users in the following languages:
* Arabic
* Czech
* German
* Greek
* English
* Spanish
* French
* Hebrew
* Hungarian
* Indonesian
* Italian
* Japanese
* Norwegian
* Dutch
* Polish
* Portuguese
* Russian
* Slovak
* Swedish
* Turkish

### What does the morphology research do?
The morphology research receives a paper with keyword and eventually synonyms in it. It relies on the language-specific helpers and config (i.e. function words list) for the future analysis. The helpers and config are retrieved from the language-specific researcher that was loaded based on the site language. If a support is not yet available for a certain language, [the default researcher](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/yoastseo/src/languageProcessing/languages/_default/Researcher.js) is used.
The morphology research:

* Splits the keyphrase or a synonym phrase and the text by words - `A boy reads a book` > `A, boy, reads, a, book`.
* Filters out function words (i.e. words with little or no conceptual meaning, e.g. propositions, enumerations), if a list of function words available. Otherwise, keeps all words in > `boy, reads, book`.
* For the supported languages in Premium: builds a pair of stem - original form for the remaining words > `[ { stem: boy, original: boy }, { stem: read, original: reads }, { stem: book, original: book } ]`. The research makes use of regexes and lists of exceptions.
* For all languages in Free (supported and non-supported), the stem and original forms are always the same.
* Collects keyphrase and synonyms forms that are also found in the text into one structure:
````
{
      keyphraseForms: [
              // forms of every word from the keyphrase that are found in the text
             [ form1, form2, ... ],  // 1st content word from the keyphrase
             [ form1, form2, ... ],  // 2nd content word from the keyphrase
             ...
      ],
      synonymsForms: [
             [  // forms of every word from the 1st synonym that are found in the text
                   [ form1, form2, ... ],  // 1st content word from the 1st synonym
                   [ form1, form2, ... ],  // 2nd content word from the 1st synonym
                   ...
             ],
             [  // forms of every word from the 2nd synonym that are found in the text
                   [ form1, form2, ... ],  // 1st content word from the 2nd synonym
                   [ form1, form2, ... ],  // 2nd content word from the 2nd synonym
                   ...
             ],
             ...
      ],
}
````
### Who calls whom
1. The plugin picks a language-specific Researcher based on the site language that the user set. If a Researcher is not available for a specific language, the default Researcher will be used instead (see [here](https://github.com/Yoast/wordpress-seo/blob/81b13cd9eba09d82e0f0b6262b716aa288e5cc29/src/helpers/language-helper.php#L46)). The language-specific Researcher contains all the necessary data for that language:
   * Configurations, e.g. function word list, transition word list, etc.
   * Helper functions, e.g. language-specific stemmer function, passive voice detection function etc.
2. The plugin [requires morphological data](https://github.com/Yoast/my-yoast/issues/1918) from the private repository `Yoast/YoastSEO.js-premium-configuration` and [supplies these data](https://github.com/Yoast/YoastSEO.js/issues/1809) to the webworker as a `researchData`.
3. SEO assessor calls SEO assessments and SEO assessments call their specific researches as normal.
4. Some SEO-specific researches require morphological analysis of keyphrase and synonyms, and some do not. Almost all researches that search for keyword or synonyms (in text, headings, tags, metadescription, etc.) require morphological analysis. You can see [here](https://github.com/Yoast/YoastSEO.js/issues/1558) if your research in question requires morphological analysis.
In order for an SEO research to use keyphrase or synonym word-forms, it should call the morphological research within itself. Something like:

````
export default function( paper, researcher ) {
   const topicForms = researcher.getResearch( "morphology" );
   ...
}
````
_The function that builds morphological forms is memoized, so do not worry about inefficiency._

Depending on the exact functionality of the SEO research, it can make use of one of the [helper functions](https://github.com/Yoast/javascript/blob/develop/packages/yoastseo/src/researches/findKeywordFormsInString.js), which were created to search for keyphrase forms or synonym forms in any supplied text string.


