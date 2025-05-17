# Overview of the SEO assessments scoring criteria
## How are individual and overall traffic lights assigned?
| Individual score	                            | Rating	                       |
|----------------------------------------------|-------------------------------|
| <0		                                         | Very bad (red traffic light)  |
| 0 (if it is not explicitly set as a score)		 | Feedback (gray traffic light) |
| ≤4		                                         | Bad (red traffic light)       |
| 5-7		                                        | OK (orange traffic light)     |
| 8-9		                                        | Good (green traffic light)    |

## How is the overall score calculated?

* Overall score<sup>1</sup> = ( sum of individual scores from each assessment ) / ( number of individual scores * 9 ) * 100
* Round this number
* Example with three individual scores of 3, 6, and 9:

( 3 + 6 + 9 ) / ( 3 * 9 ) * 100 = **66.67** ---> rounded to **67**

<sup>1</sup>The logic behind the formula is as follows:
* The overall score is the mean of individual scores adjusted to fit a 0-100 scale.
* Multiplying the result by 100 is necessary to fit a 0-100 instead of a 0-10 scale.
* Dividing the sum of individual scores by the number of scores * 9 (rather than simply by the number of scores) is necessary because the maximum score an individual assessment can have is 9.
Thus, this calculation make the overall score work on a 0-100/0-10 scale rather than a 0-90/0-9 scale.
* For reference in the code, see [this file](https://github.com/Yoast/wordpress-seo/blob/ef27594180f1477166b5c0cd29d606e9d82ed8fe/packages/yoastseo/src/scoring/assessor.js#L228)

## Keyphrase-based SEO assessments scoring criteria
### 1) Keyphrase in introduction
**What it does**: Checks whether words from the keyphrase can be found in the first paragraph of the text.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: IntroductionKeywordAssessment

**Title URL**: [https://yoa.st/33e](https://yoast.com/focus-keyphrase-in-introduction/#utm_source=yoast-seo&utm_medium=software&utm_term=introduction-has-keyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33f](https://yoast.com/focus-keyphrase-in-introduction/#utm_source=yoast-seo&utm_medium=software&utm_term=introduction-has-keyword-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                              | Feedback                                                                                                                                            |
|-------------------|--------|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | 3	     | There is no keyphrase and/or content	                                                                  | **Keyphrase in introduction**: **Please add both a keyphrase and an introduction containing the keyphrase**.                                        |
| Red   	           | 3	     | Not all content words are found in the first paragraph	                                                | **Keyphrase in introduction**: Your keyphrase or its synonyms do not appear in the first paragraph. **Make sure the topic is clear immediately**.   |
| Orange   	        | 6	     | All content words are found in the first paragraph, but not in the same sentence	                      | **Keyphrase in introduction**: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. **Fix that**! |
| Green   	         | 9	     | All content words from the keyphrase or synonym phrase are within one sentence in the first paragraph	 | **Keyphrase in introduction**: Well done!                                                                                                           |

### 2) Keyphrase length
**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: [https://yoa.st/33i](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33j](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                                              | Feedback                                                                                                                                                                      |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyword set		                                                                                                 | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**.                                               |
| Red   	           | 3		    | Keyphrase length > 8 words (> 9 for languages without function words support, > 18 characters for Japanese)	           | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's way more than the recommended maximum of X (content) words/characters. **Make it shorter!** |
| Orange   	        | 6	     | Keyphrase length between 5-8 words (7-9 for languages without function words support, 13-18 characters for Japanese)		 | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's more than the recommended maximum of X (content) words/characters. **Make it shorter!**     |
| Green   	         | 9	     | Keyphrase length between 1-4 words (1-6 for languages without function words support, 1-12 characters for Japanese)		  | **Keyphrase length**: Good job!                                                                                                                                               |

### 3) Keyphrase density
**What it does**: Checks whether the (content) words from the keyphrase are used in the text and whether they are used often enough (but not too often). For a match to be found, all content words should occur in one sentence. Multiple occurrences of all content words within one sentence are considered multiple matches.

**Uses synonyms**: no

**When it applies**: If there is a text of at least 100 words and a keyword.

**Name in code**: KeywordDensityAssessment

**Title URL**: [https://yoa.st/33v](https://yoast.com/what-is-keyphrase-density-and-why-is-it-important/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddensity-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33w](https://yoast.com/what-is-keyphrase-density-and-why-is-it-important/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddensity-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                               | Feedback                                                                                                                                                            |
|-------------------|--------|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -50	   | kd > 4		                                                | **Keyphrase density**: The keyphrase was found X times. That's way more than the recommended maximum of X times for a text of this length. **Don't overoptimize!**  |
| Red	              | -10	   | 3 < kd ≤ 4 (3.5 < kd ≤ 4 for multiple word forms)		     | **Keyphrase density**: The keyphrase was found X times. That's more than the recommended maximum of X times for a text of this length. **Don't overoptimize!**      |
| Red	              | 4	     | 0 kd		                                                  | **Keyphrase density**: The keyphrase was found 0 times. That's less than the recommended minimum of X times for a text of this length. **Focus on your keyphrase!** |
| Red	              | 4	     | 0 < kd ≤ 0.5		                                          | **Keyphrase density**: The keyphrase was found X times. That's less than the recommended minimum of X times for a text of this length. **Focus on your keyphrase!** |
| green	            | 9	     | 0.5 < kd ≤ 3 (0.5 < kd ≤ 3.5 for multiple word forms)		 | **Keyphrase density**: The keyphrase was found X times. This is great!                                                                                              |

#### More on our minimal keyphrase usage requirements
A simple model shows that as the text length (in words) goes up, the keyphrase density assessment requires a larger number of keyphrase usages. This happens in steps, which are determined by keyphrase length (shorter step for shorter keyphrases) and which do not depend on text length. The step size for the shortest keyphrase (1 word) is 214 words.

### 4) Keyphrase in meta description
**What it does**: Checks whether all (content) words from the keyphrase are used in the metadescription. A match is counted if all words from the keyphrase appear in a sentence. Multiple matches per sentence are counted multiple times.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: MetaDescriptionKeywordAssessment

**Title URL**: [https://yoa.st/33k](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=metadescriptionkeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33l](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=metadescriptionkeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                       | Feedback                                                                                                                                               |
|-------------------|--------|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 3	     | There is no keyphrase and/or meta description		 | **Keyphrase in meta description**: **Please add both a keyphrase and a meta description containing the keyphrase.**                                    |
| Red	              | 3	     | 0 keyword matches		                             | **Keyphrase in meta description**: The metadescription has been specified, but it does not contain the keyphrase. **Fix that!**                        |
| Red	              | 3	     | >2 found matches		                              | **Keyphrase in meta description**: The meta description contains the keyphrase __ times, which is over the advised maximum of 2 times. **Limit that!** |
| Green	            | 9	     | 1-2 sentences with a found match		              | **Keyphrase in meta description**: Keyphrase or synonym appear in the metadescription. Well done!                                                      |

### 5) Keyphrase in subheadings
**What it does**: Checks whether H2 and H3 subheadings reflect the topic of the copy (based on keyphrase or synonyms). For languages with function word support, a subheading is considered to reflect the topic if at least half of words from the keyphrase are used in it. For languages without function word support, a subheading is considered to reflect the topic if all content words from the keyphrase are used in it.

**Uses synonyms**: yes

**When it applies**: If there is a text with at least one subheading and a keyphrase. Does not apply to taxonomies.

**Name in code**: SubHeadingsKeywordAssessment

**Title URL**: [https://yoa.st/33k](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheadingskeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33l](https://yoast.com/how-to-use-headings-on-your-site/#utm_source=yoast-seo&utm_medium=software&utm_term=subheadingskeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                       | Feedback                                                                                                                                              |
|-------------------|--------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 3	     | Less than 30% of H2/H3 headings reflect the topic		             | **Keyphrase in subheading**: **Use more keyphrases or synonyms in your higher-level subheadings!**                                                    |
| Red	              | 3	     | More than 75% of H2/H3 headings reflect the topic		             | **Keyphrase in subheading**: More than 75% of your higher-level subheadings reflect the topic of your copy. That's too much. **Don't over-optimize!** |
| Green	            | 9	     | Between 30 and 75% of H2/H3 headings reflect the topic		        | **Keyphrase in subheading**: (X of) your higher-level subheading(s) reflects the topic of your copy. Good job!                                        |
| Green	            | 9	     | The only H2/H3 subheading used in the text reflects the topic		 | **Keyphrase in subheading**: Your higher-level subheading reflects the topic of your copy. Good job!                                                  |

### 6) Competing links (Link keyphrase)
**What it does**: Checks if there are links in the text, which are attached to the keyphrase.

**Uses synonyms**: yes

**When it applies**: If there is a text, a keyword and a keyword in the text that has link. Does not apply to taxonomies.

**Name in code**: TextCompetingLinksAssessment

**Title URL**: [https://yoa.st/34l](https://yoast.com/what-is-anchor-text/#utm_source=yoast-seo&utm_medium=software&utm_term=competing-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34m](https://yoast.com/what-is-anchor-text/#utm_source=yoast-seo&utm_medium=software&utm_term=competing-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                         | Feedback                                                                                                             |
|-------------------|--------|---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Red	              | 2	     | There’s a link attached to keyphrase or synonym		 | **Link keyphrase**: You're linking to another page with the words you want this page to rank for. **Don't do that!** |
The feedback is returned only if a competing link is found.

With the example keyphrase `cat and dog` the following criteria would apply to count as a competing link:

| Link text	   	    | Regarded as competing link		 | Notes                                                                                                     |
|-------------------|------------------------------|-----------------------------------------------------------------------------------------------------------|
| cat and dog		     | yes	                         | full match                                                                                                |
| cat		             | no	                          | partial match of keyphrase not regarded as competing link                                                 |
| cat and dog food	 | no 	                         | full match of keyphrase not regarded as competing link if the link text contains additional content words |

### 7) Keyphrase in image alt attributes

**What it does**: Checks if there are keyphrase or synonyms in the alt attributes of images.

**Uses synonyms**: yes

**When it applies**: Always, except in taxonomies.

**Name in code**: ImageKeyphraseAssessment

**Title URL**: [https://yoa.st/4f7](https://yoast.com/image-seo-alt-tag-and-title-tag-optimization/#utm_source=yoast-seo&utm_medium=software&utm_term=images-keyphrase-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/4f6](https://yoast.com/image-seo-alt-tag-and-title-tag-optimization/#utm_source=yoast-seo&utm_medium=software&utm_term=images-keyphrase-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**What is counted as a keyphrase match**: ≥50% of all (content) words from the keyphrase in the alt attributes.

| Traffic light   	           | Score	               | Criterion                                                                                                     | Feedback                                                                                                                                                                                                                |
|-----------------------------|----------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red		                       | 3		                  | No images or no keyphrase set		                                                                               | **Keyphrase in image alt attributes**: This page does not have images, a keyphrase, or both. **Add some images with alt attributes that include the keyphrase or synonyms!**                                            |
| Orange (cornerstone: red)		 | 6 (cornerstone: 3)		 | No images with alt attributes while the keyphrase is set	                                                     | **Keyphrase in image alt attributes**: Images on this page do not have alt attributes that reflect the topic of your text. **Add your keyphrase or synonyms to the alt tags of relevant images!**                       |
| Orange (cornerstone: red)		 | 6 (cornerstone: 3)		 | There are images with alt attributes, but they don't contain the keyphrase even though the keyphrase is set		 | **Keyphrase in image alt attributes**: Images on this page do not have alt attributes with at least half of the words from your keyphrase. **Fix that!**                                                                |
| Orange	                     | 6	                   | There are at least 5 images and less than 30% have an alt-tag with keyphrase/synonym		                        | **Keyphrase in image alt attributes**: Out of X images on this page, only X have alt attribute that reflect the topic of your text. **Add your keyphrase or synonyms to the alt tags of more relevant images!**         |
| Orange	                     | 6	                   | There are at least 5 images and more than 75% have an alt-tag with keyphrase/synonym		                        | **Keyphrase in image alt attributes**: Out of X images on this page, X have alt attributes with words from your keyphrase or synonyms. That's a bit much. **Only include the keyphrase when it really fits the image**. |
| Green	                      | 9	                   | There are 5 images and 2-4 images have an alt-tag with keyphrase/synonym		                                    | **Keyphrase in image alt attributes**: Good job!                                                                                                                                                                        |
| Green	                      | 9	                   | There are less than 5 images and at least one has an alt-tag with a keyphrase/synonym		                       | **Keyphrase in image alt attributes**: Good job!                                                                                                                                                                        |
| Green	                      | 9	                   | There are at least 5 images and between 30 and 75% have an alt-tag with a keyphrase/synonym		                 | **Keyphrase in image alt attributes**: Good job!                                                                                                                                                                        |

### 8) Keyphrase in SEO title
**What it does**: Checks if the keyphrase is used in the page title (when function words precede the keyphrase in the title they are filtered out when determining the position of the keyphrase in the title).

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: TitleKeywordAssessment

**Title URL**: [https://yoa.st/33g](https://yoast.com/page-titles-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=title-keyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33h](https://yoast.com/page-titles-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=title-keyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                              | Feedback                                                                                                                                                                                                                                                     |
|-------------------|--------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 2	     | There is no keyphrase and/or SEO title		                                                               | **Keyphrase in SEO title**: **Please add both a keyphrase and an SEO title beginning with the keyphrase**.                                                                                                                                                   |
| Red	              | 2	     | You haven't used all the content words from your keyphrase and your keyphrase isn’t at the beginning		 | **Keyphrase in SEO title**: Not all the words from your keyphrase 'your_keyphrase_here' appear in the SEO title. **For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title.** |
| Red	              | 2	     | You haven’t used your exact keyphrase, when the keyphrase is enclosed in quotation marks		             | **Keyphrase in SEO title**: Does not contain the exact match. **Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title.**                                                                                  |
| Orange	           | 6	     | The exact match of the keyphrase doesn’t appear at the beginning of the SEO title		                    | **Keyphrase in SEO title**: The exact match of the focus keyphrase appears in the SEO title, but not at the beginning. **Move it to the beginning for the best results.**                                                                                    |
| Orange	           | 6	     | SEO title does not contain an exact match of your keyphrase		                                          | **Keyphrase in SEO title**: Does not contain the exact match. **Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title.**                                                                                  |
| Green	            | 9	     | SEO title contains the exact match of the focus keyphrase at beginning		                               | **Keyphrase in SEO title**: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job!                                                                                                                                      |

### 9) Keyphrase in slug
**What it does**: Checks if the keyphrase is used in the slug.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: SlugKeywordAssessment

**Title URL**: [https://yoa.st/33o](https://yoast.com/slug/#utm_source=yoast-seo&utm_medium=software&utm_term=urlkeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33p](https://yoast.com/slug/#utm_source=yoast-seo&utm_medium=software&utm_term=urlkeyword-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	              | Score	                  | Criterion                                                                                | Feedback                                                                                      |
|--------------------------------|-------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Red		                          | 3		                     | There is no keyphrase and/or slug		                                                      | **Keyphrase in slug**: **Please add both a keyphrase and a slug containing the keyphrase**.   |
| Orange (in cornerstone: Red)		 | 6 (in cornerstone: 3)		 | Not all content words are in the slug		                                                  | **Keyphrase in slug**: (Part of) your keyphrase does not appear in the slug. **Change that!** |
| Green	                         | 9	                      | For short keyphrases (1-2 content words): All content words are in the slug			           | **Keyphrase in slug**: Great work!                                                            |
| Green	                         | 9	                      | For longer keyphrases (>2 content words): More than half content words are in the slug		 | **Keyphrase in slug**: More than half of your keyphrase appears in the slug. That's great!    |

### 10) Previously used keyphrase

**What it does**: Checks if the words from the keyphrase were previously used in a keyphrase for a different post.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: PreviouslyUsedKeyword

**Title URL**: [https://yoa.st/33x](https://yoast.com/use-focus-keyword-once/#utm_source=yoast-seo&utm_medium=software&utm_term=previously-used-keywords-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33y](https://yoast.com/use-focus-keyword-once/#utm_source=yoast-seo&utm_medium=software&utm_term=previously-used-keywords-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                        | Feedback                                                                                                                                             |
|-------------------|--------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | There is no keyphrase	                           | **Previously used keyphrase**: No focus keyphrase was set for this page. **Please add a focus keyphrase you haven't used before on other content**.	 |
| Red	              | 1	     | The keyphrase is previously used more than once	 | **Previously used keyphrase**: You've used this keyphrase X times before. **Do not use your keyphrase more than once.**	                             |
| Orange	           | 6	     | The keyphrase is previously used once	           | **Previously used keyphrase**: You've used this keyphrase once before. **Do not use your keyphrase more than once.**	                                |
| Green	            | 9	     | The keyphrase hasn't been used before	           | **Previously used keyphrase**: You've not used this keyphrase before, very good.	                                                                    |

### 11) Keyphrase distribution (only in Premium)
**What it does**: Checks how well the words from the keyphrase are distributed throughout the text. For exact implementation check out https://github.com/Yoast/YoastSEO.js/issues/1558 and https://github.com/Yoast/YoastSEO.js/issues/1868.

**Uses synonyms**: yes

**When it applies**: If there is a text with at least 15 sentences and a keyword.

**Name in code**: KeyphraseDistribution

**Title URL**: [https://yoa.st/33q](https://yoast.com/keyphrase-distribution-what-it-is-and-how-to-balance-it/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddistribution-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33u](https://yoast.com/keyphrase-distribution-what-it-is-and-how-to-balance-it/#utm_source=yoast-seo&utm_medium=software&utm_term=keyworddistribution-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                       | Feedback                                                                                                                                         |
|-------------------|--------|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Grey	             | 0	     | Keyphrase was not set or not used in the text		 | **Keyphrase distribution**: **Include your keyphrase or its synonyms in the text so that we can check keyword distribution.**                    |
| Red	              | 1	     | The resulting score is >0.6	                    | **Keyphrase distribution**: Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. **Distribute them more evenly.** |
| Orange	           | 6	     | The resulting score is between 0.4 and 0.6		    | **Keyphrase distribution**: Uneven. Some parts of your text do not contain your keyphrase or its synonyms. **Distribute them more evenly.**	     |
| Green	            | 9	     | The resulting score is <0.4		                   | **Keyphrase distribution**: Good job!                                                                                                            |

## Other SEO assessments scoring criteria
### 1) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**Title URL**: [https://yoa.st/34n](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34o](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	                   | Criterion                                                                                                                               | Feedback                                                                                                                                                                                                                                                                                                                     |
|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 99 words (_cornerstone_: between 0 and 0, _Japanese_: 0-199)		                                                            | **Text length**: The text contains X words/characters. This is far below the recommended minimum of 300 words (cornerstone: 900 words, JA: 600 characters, JA cornerstone: 1800 characters). **Add more content.**                                                                                                           |
| Red	              | -10 (cornerstone: -20)		 | Between 100 and 199 words (cornerstone: between 0 and 299, Japanese: 200-399 characters, Japanese cornerstone: 0-599 characters)		      | **Text length**: The text contains X words/characters. This is far below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                                |
| Red	              | 3 (cornerstone: -20)		   | Between 200 and 249 words (cornerstone: between 300 and 399, Japanese: 400-499 characters, Japanese cornerstone: 600-799 characters)			 | **Text length**: The text contains X words/characters. This is below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                                    |
| Orange	           | 6	                       | Between 250 and 299 words (cornerstone: between 400 and 899, Japanese: 500-599 characters, Japanese cornerstone: 800-1799 characters)		 | **Text length**: The text contains X words/characters. This is slightly below the recommended minimum of 300 words (JA: 600 characters). **Add a bit more copy.** (cornerstone: **Text length**: The text contains X words. This is below the recommended minimum of 900 words (JA: 1800 characters). **Add more content.**) |
| Green	            | 9	                       | More than or exactly 300 words (cornerstone: 900, Japanese: 600 characters, Japanese cornerstone: 1800 characters)		                    | **Text length**: The text contains X words/characters. Good job!                                                                                                                                                                                                                                                             |

### 2) Outbound links
**What it does**: Checks if outbound links are present and followed.

**When it applies**: Always.

**Name in code**: OutboundLinksAssessment

**Title URL**: [https://yoa.st/34f](https://yoast.com/outbound-links/#utm_source=yoast-seo&utm_medium=software&utm_term=outbound-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34g](https://yoast.com/outbound-links/#utm_source=yoast-seo&utm_medium=software&utm_term=outbound-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score | Criterion                                     | Feedback                                                                                        |
|---------------|-------|-----------------------------------------------|-------------------------------------------------------------------------------------------------|
| Red           | 3     | No links                                      | **Outbound links**: No outbound links appear in this page. **Add some!**                        |
| Orange        | 7     | All links are no-followed                     | **Outbound links**: All outbound links on this page are nofollowed. **Add some normal links.**  |
| Green         | 8     | There are both followed and no-followed links | **Outbound links**: There are both nofollowed and normal outbound links on this page. Good job! |
| Green         | 9     | All links are followed                        | **Outbound links**: Good job!                                                                   |

### 3) Internal links
**What it does**: Checks if internal links are present and followed.

**When it applies**: Always.

**Name in code**: InternalLinksAssessment

**Title URL**: [https://yoa.st/33z](https://yoast.com/internal-linking-for-seo-why-and-how/#utm_source=yoast-seo&utm_medium=software&utm_term=internal-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34a](https://yoast.com/internal-linking-for-seo-why-and-how/#utm_source=yoast-seo&utm_medium=software&utm_term=internal-links-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score | Criterion                                              | Feedback                                                                                                  |
|---------------|-------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Red           | 3     | No internal links                                      | **Internal links**: No internal links appear in this page, **make sure to add some!**                     |
| Orange        | 7     | Only no-followed internal links                        | **Internal links**: The internal links in this page are all nofollowed. **Add some good internal links.** |
| Green         | 8     | There are both followed and no-followed internal links | **Internal links**: There are both nofollowed and normal internal links on this page. Good job!           |
| Green         | 9     | All internal links are followed                        | **Internal links**: You have enough internal links. Good job!                                             |

### 4) SEO Title width
**What it does**: Checks if the SEO title has a good length. Note that this assessment checks the SEO title as it appears in the snippet preview. Therefore, it also takes into account the content from replacement variables. However, we exclude the separator and the site title replacement variables from the calculation.

**When it applies**: Always.

**Name in code**: PageTitleWidthAssessment

**Title URL**: [https://yoa.st/34h](https://yoast.com/page-titles-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=title-width-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34i](https://yoast.com/page-titles-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=title-width-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                 | Feedback                                                                                      |
|-------------------|--------|-------------------------------------------|-----------------------------------------------------------------------------------------------|
| Red	              | 1	     | No SEO title		                            | **SEO title width**: Please create an SEO title.                                              |
| Red	              | 3	     | SEO title width > 600 px		                | **SEO title width**: The SEO title wider than the viewable limit. **Try to make it shorter.** |
| Green	            | 9	     | SEO title width between 1 px and 600 px		 | **SEO title width**: Good job!                                                                |

### 5) Meta description length
**What it does**: Checks if the meta description has a good length. The date (and the separator ' - ') length are also included in the calculation, if the date is shown in the Google preview.

**When it applies**: Always.

**Name in code**: MetaDescriptionLengthAssessment

**Title URL**: [https://yoa.st/34d](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34e](https://yoast.com/meta-descriptions/#utm_source=yoast-seo&utm_medium=software&utm_term=length-meta-description-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	            | Score	                | Criterion                                                                               | Feedback                                                                                                                                                     |
|------------------------------|-----------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	                         | 1	                    | No meta description		                                                                   | **Meta description length**: No meta description has been specified. Search engines will display copy from the page instead. **Make sure to write one!**     |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≤ 120 characters (Japanese: ≤ 60 characters)		       | **Meta description length**: The meta description is too short (under X characters). Up to X characters are available. **Use the space!**                    |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≥ 157 characters (Japanese: ≥ 80 characters) 		      | **Meta description length**: The meta description is over X characters. **To ensure the entire description will be visible, you should reduce the length!**	 |
| Green	                       | 9	                    | Meta description (incl. the date) > 120 and < 157 characters	(Japanese: > 60 and < 80)	 | **Meta description length**: Well done!                                                                                                                      |

### 6) Single title
**What it does**: Checks if there are multiple H1 headings present in the text.

**When it applies**: When there are at least two H1 headings in the text.

**Name in code**: SingleH1Assessment

**Title URL**: [https://yoa.st/3a6](https://yoast.com/one-h1-heading-per-post/#utm_source=yoast-seo&utm_medium=software&utm_term=single-h1-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/3a7](https://yoast.com/one-h1-heading-per-post/#utm_source=yoast-seo&utm_medium=software&utm_term=single-h1-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                        | Feedback                                                                                                                                                          |
|-------------------|--------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | There are at least two H1 headings in the text		 | **Single title**: H1s should only be used as your main title. **Find all H1s in your text that aren't your main title and change them to a lower heading level!** |

### 7) Function words in keyphrase
**What it does**: Checks if the keyphrase consists of only function words.

**When it applies**: When the keyphrase consists of only function words (and the language has function word support).

**Name in code**: FunctionWordsInKeyphraseAssessment

**Title URL**: [https://yoa.st/functionwordskeyphrase-1](https://yoast.com/focus-keyword/#utm_source=yoast-seo&utm_medium=software&utm_term=function-words-in-keyphrase-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/functionwordskeyphrase-2](https://yoast.com/focus-keyword/#utm_source=yoast-seo&utm_medium=software&utm_term=function-words-in-keyphrase-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                 | Feedback                                                                                                                          |
|-------------------|--------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Grey	             | 0	     | There is a keyphrase consisting only of function words			 | **Function words in keyphrase**: Your keyphrase X contains function words only. **Learn more about what makes a good keyphrase.** |

### 8) Images
**What it does**: Checks the presence of images in the text.

**When it applies**: Always.

**Name in code**: ImageCountAssessment

**Title URL**: [https://yoa.st/4f4](https://yoast.com/using-images-in-your-blog-post/#utm_source=yoast-seo&utm_medium=software&utm_term=images-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/4f5](https://yoast.com/using-images-in-your-blog-post/#utm_source=yoast-seo&utm_medium=software&utm_term=images-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score | Criterion                  | Feedback                                                 |
|---------------|-------|----------------------------|----------------------------------------------------------|
| Red           | 3     | No images                  | **Images**: No images appear on this page. **Add some!** |
| Green         | 9     | There are at least 1 image | **Images**: Good job!                                    |

### 9) Title (only in Premium)
**What it does**: Checks for the presence of a title.

**When it applies**: Always. Does not apply to taxonomies.

**Name in code**: TextTitleAssessment

**Title URL**: [https://yoa.st/4nh](https://yoast.com/help/title-check/#utm_source=yoast-seo&utm_medium=software&utm_term=text-title-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/4ni](https://yoast.com/how-to-add-a-title/#utm_source=yoast-seo&utm_medium=software&utm_term=text-title-cta&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light | Score	  | Criterion          | Feedback                                                     |
|---------------|---------|--------------------|--------------------------------------------------------------|
| Red	          | -10000	 | No title		         | **Title**: Your page does not have a title yet. **Add one!** |
| Green	        | 9	      | There is a title		 | **Title**: Your page has a title. Well done!                 |
