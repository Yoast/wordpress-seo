# Scoring SEO analysis
The SEO analysis is a collection of assessments that check how well a text performs with respect to SEO. Below is a detailed overview of how scores for the SEO assessments are calculated, as well as the feedback that each assessment returns.

At the moment, the exact way in which the assessments relating to **keyphrase use** work depends on the language of the user, as well as on which version of the plugin they are using (Free or Premium). This is because of the continuous development of morphological support, and the fact that morphology features are currently restricted to the premium version. These differences in language- and version-dependent functionalities are also outlined below.

## How are keyphrase-related assessments affected by language and plugin version?
There are three functionalities that depend on the user's language and/or plugin version:

* **Whether or not function words are filtered out from the keyphrase**. Function words are words that carry little meaning on their own (examples: 'my', 'to', 'of', 'very'). They are therefore unimportant to Google, and it makes little sense to consider them in our keyphrase-related assessments.

* **Whether or not it is possible to add synonyms of the keyphrase**. Keyphrase synonyms (e.g. keyphrase: 'bike', synonym: 'bicycle') added by the user are considered in some of the keyphrase-related assessments.

* **Whether or not morphological forms of the keyphrase are generated**. For example, if a keyphrase contains the word 'bike', all possible forms of the word are generated ('bikes', 'bike's', 'biking', 'biked'...) and considered in the assessments.

The availability of these features depends on which of the three language categories, outlined below, the user's language falls into. Within each category, a further distinction between Premium and Free users can be made.

### Group 1: All languages

#### Free
For all users, the majority of keyphrase-related assessments are now done using **per-word matching**, instead of **exact matching**. When exact matching is used, the assessments are only concerned with the exact keyphrase. For example, if the keyphrase is "room decorating ideas", an assessment that looks whether the keyphrase has been used in the first sentence of the text will only return a positive result if the exact phrase is found. When per-word matching is used, on the other hand, the result will be positive as long as the words 'room', 'decorating', and 'ideas' are found in the first sentence - but they don't need to appear next to each other and in that exact order.

#### Premium
All Premium users can also add **synonyms** of their keyphrase. Some of the assessments will then not only consider the keyphrase, but also its synonyms.

### Group 2: Languages for which we can filter out function words
A list of those languages can be found [here](https://github.com/Yoast/javascript/blob/master/packages/yoastseo/README.md#supported-languages) - look for the ones with a green tick in the 'function words' cell.

#### Free
In addition to per-word matching, we also filter out **function words** from the keyphrase during the keyword-related assessments. For example, if the keyphrase is "how to decorate a room", we filter out the words 'how', 'to', and 'a', and only leave out the meaningful words 'decorate' and 'room'. This means that if we look, for example, if the keyphrase has been used in the introduction of the text, we are only looking for the words 'decorate' and 'room'.

#### Premium
In addition to the above, Premium users can add **synonyms** of their keyphrase.

### Group 3: English language

#### Free
Free users with English as their language have access to the same functionalities as Free users of group 2 (filtering out **function words** and **per-word matching**)

#### Premium
Premium users have access to **full morphological support**. This means that in addition to all other functionalities mentioned above, **all possible forms of their keyphrase and all possible forms of their synonyms** are generated. It depends on the assessment whether synonym forms will be taken into consideration or not (see per-assessment specifications below). For example, if the keyphrase is "room decorating ideas" and the synonym is "apartment decorating ideas" all the possible forms of each word are generated: 'apartments', 'rooms', 'room's', 'decorate', 'decorates', 'decorated', 'idea', etc. These are then taken into account during the keyword-related assessments, after possible function words have been filtered out.

### Summary
|    	      | All languages	     | Function words developed | English 	|
|------------	|------------------	|---------------------	|---------------	|
| Free        | Per-word matching    | Per-word matching, filtering out function words | Per-word matching, filtering out function words |
| Premium	  | The above + synonyms | The above + synonyms	      | The above + synonyms + morphological forms of keyphrase and synonyms |

### Important
Per-word matching, filtering out of function words and morphological forms of keyphrase and synonyms **can be suppressed** by using double quotations marks around the keyphrase or around a synonym. E.g., `"SEO analysis"`.

## How are individual bullets assigned?
| Individual score	| Rating	     |
|------------	|------------------	|
| 0 (if it is not explicitly set as a score)		| Feedback (gray) |
| ≤4		| Bad (red circle) |
| 5-7		| OK (orange circle) |
| 8-10		| Good (Green circle)|

## How is the overall score calculated?

* Overall score = (sum of individual scores)/(number of results *9 ) * 10
* Round this number.

## Keyphrase-based SEO assessments
### Keyphrase in introduction
**What it does**: Checks whether words from the keyphrase can be found in the first paragraph of the text.

**Uses synonyms**: yes

**When applies**: If there is a text and a keyword.

**Name in code**: IntroductionKeywordAssessment

**Title URL**: https://yoa.st/33e (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33f (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red   	      | 3	     | Not all content words are found in the first paragraph	 | **Keyphrase in introduction**: Your keyphrase or its synonyms do not appear in the first paragraph. **Make sure the topic is clear immediately**. |
| Orange   	      | 6	     | All content words are found in the first paragraph, but not in the same sentence	 | **Keyphrase in introduction**: Your keyphrase or its synonyms appear in the first paragraph of the copy, but not within one sentence. **Fix that**! |
| Green   	      | 9	     | All content words from the keyphrase or synonym phrase are within one sentence in the first paragraph	 | **Keyphrase in introduction**: Well done! |

### Keyphrase length
**What it does**: Checks whether the number of ( content ) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.

**Uses synonyms**: no

**When applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: https://yoa.st/33i (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33j (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red   	      | -999	     | No focus keyword set		 | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**. |
| Red   	      | 3		     | Keyphrase length > 8 words (> 9 for languages without function words support)	 | **Keyphrase length**: The keyphrase is x words long. That's way more than the recommended maximum of 4 words. **Make it shorter!**|
| Orange   	      | 6	     | Keyphrase length between 5-8 words (7-9 for languages without function words support)		 | **Keyphrase length**: The keyphrase is x words long. That's more than the recommended maximum of 4 words. **Make it shorter!**|
| Green   	      | 9	     | Keyphrase length between 1-4 words (1-6 or languages without function words support)		 | **Keyphrase length**: Good job! |

### Keyword density
**What it does**: Checks whether the (content) words from the keyphrase are used in the text and whether they are used often enough (but not too often). For a match to be found, all content words should occur in one sentence. Multiple occurrences of all content words within one sentence are considered multiple matches.

**Uses synonyms**: no

**When applies**: If there is a text of at least 100 words and a keyword.

**Name in code**: KeywordDensityAssessment

**Title URL**: https://yoa.st/33v (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33w (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| -50	| kd > 4		| **Keyphrase density**: The focus keyphrase was found X times. That's way more than the recommended maximum of X times for a text of this length. **Don't overoptimize!** |
| Red	| -10	| 3 < kd ≤ 4 (3.5 < kd ≤ 4 for multiple word forms)		| **Keyphrase density**: The focus keyphrase was found X times. That's more than the recommended maximum of X times for a text of this length. **Don't overoptimize!** |
| Red	| 4	| 0 kd		| **Keyphrase density**: The focus keyphrase was found 0 times. That's less than the recommended minimum of X times for a text of this length. **Focus on your keyphrase!** |
| Red	| 4	| 0 < kd ≤ 0.5		| **Keyphrase density**: The focus keyphrase was found X times. That's less than the recommended minimum of X times for a text of this length. **Focus on your keyphrase!** |
| green	| 9	| 0.5 < kd ≤ 3 (0.5 < kd ≤ 3.5 for multiple word forms)		| **Keyphrase density**: The focus keyphrase was found X times. This is great! |

#### More on our minimal keyphrase usage requirements
A [simple model](https://docs.google.com/spreadsheets/d/1rwOs-4-pJB1PBgB8hDbCPWgwTe0HYiLdQG23O2FdLq8/edit?usp=sharing) shows that as the text length (in words) goes up, the keyphrase density assessment requires a larger number of keyphrase usages. This happens in steps, which are determined by keyphrase length (shorter step for shorter keyphrases) and which do not depend on text length. The step size for the shortest keyphrase (1 word) is 214 words.

### Keyword in meta description
**What it does**: Checks whether all (content) words from the keyphrase are used in the metadescription. A match is counted if all words from the keyphrase appear in a sentence. Multiple matches per sentence are counted multiple times.

**Uses synonyms**: yes

**When applies**: If there is a meta description and a keyword.

**Name in code**: MetaDescriptionKeywordAssessment

**Title URL**: https://yoa.st/33k (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33l (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| 3	| 0 keyword matches		| **Keyphrase in meta description**: The metadescription has been specified, but it does not contain the keyphrase. **Fix that!** |
| Red	| 3	| >2 found matches		| **Keyphrase in meta description**: The meta description contains the keyphrase __ times, which is over the advised maximum of 2 times. **Limit that!** |
| Green	| 9	| 1-2 sentences with a found match		| **Keyphrase in meta description**: Keyphrase or synonym appear in the metadescription. Well done! |

### Keyphrase in subheadings
**What it does**: Checks whether all (content) words from the keyphrase are used in the metadescription. A match is counted if all words from the keyphrase appear in a sentence. Multiple matches per sentence are counted multiple times.

**Uses synonyms**: yes

**When applies**: If there is a meta description and a keyword.

**Name in code**: MetaDescriptionKeywordAssessment

**Title URL**: https://yoa.st/33k (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33l (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| 3	| Less than 30% of H2/H3 headings reflect the topic		| **Keyphrase in subheading**: **Use more keyphrases or synonyms in your higher-level subheadings!** |
| Red	| 3	| More than 75% of H2/H3 headings reflect the topic		| **Keyphrase in subheading**: More than 75% of your higher-level subheadings reflect the topic of your copy. That's too much. **Don't over-optimize!** |
| Green	| 9	| Between 30 and 75% of H2/H3 headings reflect the topic		| **Keyphrase in subheading**: (X of) your higher-level subheading(s) reflects the topic of your copy. Good job! |
| Green	| 9	| The only H2/H3 subheading used in the text reflects the topic		| **Keyphrase in subheading**: Your higher-level subheading reflects the topic of your copy. Good job! |

### Competing links (Link keyphrase)
**What it does**: Checks if there are links in the text, which are attached to the keyphrase.

**Uses synonyms**: yes

**When applies**: If there is a text, a keyword and a keyword in the text that has link. Does not apply to taxonomies.

**Name in code**: TextCompetingLinksAssessment

**Title URL**: https://yoa.st/34l (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/34m (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| 2	| There’s a link attached to keyphrase or synonym		| **Link keyphrase**: You're linking to another page with the words you want this page to rank for. **Don't do that!** |
The feedback is returned only if a competing link is found.

With the example keyphrase `cat and dog` the following criteria would apply to count as a competing link:

| Link text	   	      | Regarded as competing link		     | Notes |
|------------	|------------------	|---------------------	|
| cat and dog		| yes	| full match |
| cat		| no	| partial match of keyhrase not regarded as competing link |
| cat and dog food	| no 	| full match of keyphrase not regarded as competing link if the link text contains additional content words |

### Images
**What it does**: Checks the presence of images in the text.

**When applies**: If there is a text with at least one image present.

**Name in code**: ImageCountAssessment

**Title URL**: https://yoa.st/4f4 (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4f5 (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| 3	| No images		| **Images**: No images appear on this page. **Add some!** |
| Green	| 9	| There are at least 1 image		| **Images**: Good job! |

### Keyphrase in text images

**What it does**: Checks if there are keyphrase or synonyms in the alt attributes of images.

**Uses synonyms**: yes

**When applies**: If there is a text. Does not apply to taxonomies.

**Name in code**: ImageKeyphraseAssessment

**Title URL**: https://yoa.st/4f7 (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4f6 (link placement is in bold in the feedback strings)

**What is counted as a keyphrase match**: ≥50% of all (content) words from the keyphrase in the alt tag.

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Orange (cornerstone: red)		| 6 (cornerstone: 3)		| No images with keyphrase/synonym in alt-tags		| **Image Keyphrase**: Images on this page do not have alt attributes with at least half of the words from your keyphrase. **Fix that!** |
| Orange	| 6	| There are at least 5 images and less than 30% have an alt-tag with keyphrase/synonym		| **Image Keyphrase**: Out of X images on this page, only X have an alt attribute that reflects the topic of your text. **Add your keyphrase or synonyms to the alt tags of more relevant images!** |
| Orange	| 6	| There are at least 5 images and more than 75% have an alt-tag with keyphrase/synonym		| **Image Keyphrase**: Out of X images on this page, X have alt attributes with words from your keyphrase or synonyms. That's a bit much. **Only include the focus keyphrase when it really fits the image**. |
| Green	| 9	| There are less than 5 images and at least one has an alt-tag with a keyphrase/synonym		| **Image Keyphrase**: Good job! |
| Green	| 9	| There are at least 5 images and between 30 and 75% have an alt-tag with a keyphrase/synonym		| **Image Keyphrase**: Good job! |

### Page title keyword assessment
**What it does**: Checks if the keyphrase is used in the page title (when function words precede the keyphrase in the title they are filtered out when determining the position of the keyphrase in the title).

**Uses synonyms**: no

**When applies**: If there is a title and a keyword.

**Name in code**: TitleKeywordAssessment

**Title URL**: https://yoa.st/33g (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33h (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	| 2	| You haven’t used your exact keyphrase, and, your keyphrase isn’t at the beginning		| **Keyphrase in title**: Not all the words from your keyphrase 'your_keyphrase_here' appear in the SEO title. **For the best SEO results write the exact match of your keyphrase in the SEO title, and put the keyphrase at the beginning of the title.** |
| Red	| 2	| You haven’t used your exact keyphrase, when the keyphrase is enclosed in quotation marks		| **Keyphrase in title**: Does not contain the exact match. **Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title.** |
| Orange	| 6	| The exact match of the keyphrase doesn’t appear at the beginning of the SEO title		| **Keyphrase in title**: The exact match of the focus keyphrase appears in the SEO title, but not at the beginning. **Move it to the beginning for the best results.** |
| Orange	| 6	| SEO title does not contain an exact match of your keyphrase		| **Keyphrase in title**: Does not contain the exact match. **Try to write the exact match of your keyphrase in the SEO title and put it at the beginning of the title.** |
| Green	| 9	| SEO title contains the exact match of the focus keyphrase at beginning		| **Keyphrase in title**: The exact match of the focus keyphrase appears at the beginning of the SEO title. Good job! |

### URL keyword assessment
**What it does**: Checks if the keyphrase is used in the URL.

**Uses synonyms**: no

**When applies**: If there is a URL and a keyword.

**Name in code**: UrlKeywordAssessment

**Title URL**: https://yoa.st/33o (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33p (link placement is in bold in the feedback strings)

| Bullet   	      | Score	     | Criterion | Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Orange (in cornerstone: Red)		| 6 (in cornerstone: 3)		| Not all content words are in URL		| **Keyphrase in slug**: (Part of) your keyphrase does not appear in the slug. **Change that!** |
| Green	| 9	| For short keyphrases (1-2 content words): All content words are in URL			| **Keyphrase in slug**: Great work! |
| Green	| 9	| For longer keyphrases (>2 content words): More than half content words are in URL		| **Keyphrase in slug**: More than half of your keyphrase appears in the slug. That's great! |
