# Overview of the SEO assessments scoring criteria for Japanese

This file describes the language-specific scoring criteria for SEO assessments in Japanese. To find more general information on the scoring criteria of the SEO assessments, you can consult the following pages:
* [Scoring criteria for SEO assessments](../SCORING%20SEO.md)


## Keyphrase-based SEO assessments scoring criteria
### 1) Keyphrase length
**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: [https://yoa.st/33i](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33j](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                      | Feedback                                                                                                                                                          |
|-------------------|--------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyphrase set		                       | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**.                                   |
| Red   	           | 3		    | Keyphrase length > 18 characters	              | **Keyphrase length**: The keyphrase contains X (content) characters. That's way more than the recommended maximum of X (content) characters. **Make it shorter!** |
| Orange   	        | 6	     | Keyphrase length between 13 and 18 characters)		 | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's more than the recommended maximum of X (content) words/characters. **Make it shorter!** |
| Green   	         | 9	     | Keyphrase length between 1 and 12 characters)		 | **Keyphrase length**: Good job!                                                                                                                                   |


### 2) Keyphrase in subheadings
**What it does**: Checks whether H2 and H3 subheadings reflect the topic of the copy (based on keyphrase or synonyms). For languages with function word support, a subheading is considered to reflect the topic if at least half of words from the keyphrase are used in it. For languages without function word support, a subheading is considered to reflect the topic if all content words from the keyphrase are used in it.

**Uses synonyms**: yes

**When it applies**: Always applicable, except in taxonomies.

**Name in code**: SubHeadingsKeywordAssessment

**Title URL**: [https://yoa.st/33k](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheadingskeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33l](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheadingskeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                                                                                                                                   | Feedback                                                                                                                                          |
|-------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | No focus keyphrase set an/or no content			                                                                                                                                                                  | **Keyphrase in subheading**: **Please add both a keyphrase and some text to receive relevant feedback**.                                                 |
| Red	              | 2	     | A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Keyphrase in subheading**: You are not using any higher-level subheadings containing the keyphrase or its synonyms. **Fix that!**                                                |
| Red	              | 3	     | Less than 30% of H2/H3 headings reflect the topic		                                                                                                                                                         | **Keyphrase in subheading**: **Use more keyphrases or synonyms in your higher-level subheadings!**                                                |
| Red	              | 3	     | More than 75% of H2/H3 headings reflect the topic		                                                                                                                                                         | **Keyphrase in subheading**: More than 75% of your higher-level subheadings reflect the topic of your copy. That's too much. **Don't over-optimize!** |
| Green	            | 9	     | Between 30 and 75% of H2/H3 headings reflect the topic		                                                                                                                                                    | **Keyphrase in subheading**: (X of) your higher-level subheading(s) reflects the topic of your copy. Good job!                                    |
| Green	            | 9	     | The only H2/H3 subheading used in the text reflects the topic		                                                                                                                                             | **Keyphrase in subheading**: Your higher-level subheading reflects the topic of your copy. Good job!                                              |
| Green	            | 9	     | A text with 600 (cornerstone: 500) or less characters and no subheading is present.		   | **Keyphrase in subheading**: You are not using any higher-level subheadings containing the keyphrase or its synonyms, but your text is short enough and probably doesn't need them.                                              |


### 3) Keyphrase distribution (only in Premium)
The only difference between the default and the Japanese assessment is the length of the keyphrase, explained here. Specifically, in Japanese for a short topic (< 7 characters), 100% of the keyphrase needs to be in a sentence. For a long topic (≥ 7 characters), ≥50% of the keyphrase needs to be in the sentence. Function words are not taken into account.
**What it does**: Checks how well the words from the keyphrase are distributed throughout the text. For exact implementation check out https://github.com/Yoast/YoastSEO.js/issues/1558 and https://github.com/Yoast/YoastSEO.js/issues/1868.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: KeyphraseDistribution

**Title URL**: [https://yoa.st/33q](https://yoast.com/keyphrase-distribution-what-it-is-and-how-to-balance-it/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddistribution-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33u](https://yoast.com/keyphrase-distribution-what-it-is-and-how-to-balance-it/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddistribution-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                           | Feedback                                                                                                                                         |
|-------------------|--------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | Keyphrase was not set and/or keyphrase not found in the text		                      | **Keyphrase distribution**: **Please add both a keyphrase and some text containing the keyphrase or its synonyms.**                    |
| Red	              | 1	     | The resulting score is >0.6	                        | **Keyphrase distribution**: Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. **Distribute them more evenly.** |
| Orange	           | 6	     | The resulting score is between 0.4 and 0.6	                    | **Keyphrase distribution**: Uneven. Some parts of your text do not contain your keyphrase or its synonyms. **Distribute them more evenly.**	     |
| Green	            | 9	     | The resulting score is <0.4		                                   | **Keyphrase distribution**: Good job!                                                                                                            |


<sup>1</sup> The score is calculated using the following formula:

(maximum number of consecutive sentences that don't contain the keyphrase)/(total number of sentences) * 100.

Example: 6/15*100 = 0.4


## Other SEO assessments scoring criteria
### 4) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**Title URL**: [https://yoa.st/34n](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34o](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	                   | Criterion                                                                                                          | Feedback                                                                                                                                                                                                                                                                                                                  |
|-------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 199 characters (_cornerstone_: between 0 and 0)		                                                    | **Text length**: The text contains X words/characters. This is far below the recommended minimum of 300 words (cornerstone: 900 words, JA: 600 characters, JA cornerstone: 1800 characters). **Add more content.**                                                                                                        |
| Red	              | -10 (cornerstone: -20)		 | Between 200 and 399 characters (cornerstone: between 0 and 599)		                                                  | **Text length**: The text contains X words/characters. This is far below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                             |
| Red	              | 3 (cornerstone: -20)		   | Between 400 and 499 characters (cornerstone: between 600 and 799)			                                               | **Text length**: The text contains X words/characters. This is below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                                 |
| Orange	           | 6	                       | Between 500 and 599 characters (cornerstone: between 800 and 1799)		                                    | **Text length**: The text contains X words/characters. This is slightly below the recommended minimum of 300 words (JA: 600 characters). **Add more content.** (cornerstone: **Text length**: The text contains X words. This is below the recommended minimum of 900 words (JA: 1800 characters). **Add more content.**) |
| Green	            | 9	                       | More than or exactly 600 characters (cornerstone: 1800)		 | **Text length**: The text contains X words/characters. Good job!                                                                                                                                                                                                                                                          |


### 5) Meta description length
**What it does**: Checks if the meta description has a good length. The date (and the separator ' - ') length are also included in the calculation, if the date is shown in the Google preview.

**When it applies**: Always.

**Name in code**: MetaDescriptionLengthAssessment

**Title URL**: [https://yoa.st/34d](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34e](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	            | Score	                | Criterion                                                   | Feedback                                                                                                                                                     |
|------------------------------|-----------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	                         | 1	                    | No meta description		                                       | **Meta description length**: No meta description has been specified. Search engines will display copy from the page instead. **Make sure to write one!**     |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≤ 60 characters		        | **Meta description length**: The meta description is too short (under X characters). Up to X characters are available. **Use the space!**                    |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≥ 80 characters 		       | **Meta description length**: The meta description is over X characters. **To ensure the entire description will be visible, you should reduce the length!**	 |
| Green	                       | 9	                    | Meta description (incl. the date) > 60 and < 80 characters	 | **Meta description length**: Well done!                                                                                                                      |


<sup>1</sup> In case of the Google Docs add-on, an H1 at the top of the document is excluded from the count, since we treat it as the title.
