# Keyphrase matching

A number of SEO assessments check whether a keyphrase is found in a text (for example in the main body of the text, in the meta description, or in image alt tags).

This document explains what we consider as a keyphrase match, and how that may differ depending on factors like site language and whether you are using the Free or Premium version of Yoast SEO.

## How do site language and plugin type affect keyphrase matching?
There are three behaviors that depend on the site language and the plugin type (Free or Premium):

* **Whether function words are filtered out from the keyphrase**. Function words are words that carry little meaning on their own (examples: 'my', 'to', 'of', 'very'). They are unimportant to Google so it makes little sense to consider them during keyphrase matching.

* **Whether it's possible to add synonyms of the keyphrase**. Keyphrase synonyms (e.g. keyphrase: 'bike', synonym: 'bicycle') added by the user are considered in some of the keyphrase-related assessments.

* **Whether different word forms of the keyphrase are recognized**. For example, if a keyphrase contains the word 'bike', all possible forms of the word ('bikes', 'bike's', 'biking', 'biked'...) are considered during keyphrase matching.

Below is an overview of which behaviors occur in which languages and plugin types.

### Group 1: All languages

#### Free
For all users, keyphrase matching in most of the assessments is done using **per-word matching**, instead of **exact matching**. When per-word matching is used, a match is found as long as all words from the keyphrase appear within the same sentence, regardless of the order and their proximity to each other. For example, the keyphrase '**healthy cat food**' would be matched in the sentence 'Your **cat** may like a **food** brand that's not that **healthy**.' On the other hand, when exact matching is used, a match is only found when all the words from the keyphrase appear next to each other in the 'right' order. For example, in the sentence 'Here are our top recommendations for **healthy cat food** brands'.

#### Premium
All Premium users can also add **synonyms** of their keyphrase. Some of the assessments will then not only consider the keyphrase, but also its synonyms.

### Group 2: Languages with function word support
Here is the [list of languages with function word support](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo/README.md#seo-analysis).

#### Free
In addition to per-word matching, we also filter out **function words** from the keyphrase during keyphrase matching. For example, if the keyphrase is "how to decorate a room", we filter out the words 'how', 'to', and 'a', and only leave out the meaningful words 'decorate' and 'room'. This means that if we look, for example, if the keyphrase has been used in the introduction of the text, we are only looking for the words 'decorate' and 'room'.

#### Premium
In addition to the above, Premium users can add **synonyms** of their keyphrase.

### Group 3: Languages with word form support
Here is the list of [languages with word form support](https://github.com/Yoast/wordpress-seo/tree/trunk/packages/yoastseo/MORPHOLOGY.md).

#### Free
Free users with languages that have word form support have access to the same functionalities as Free users of group 2 (filtering out **function words** and **per-word matching**).

#### Premium
Premium users have access to **full word form support**. This means that in addition to all other functionalities mentioned above, **all possible forms of their keyphrase and all possible forms of their synonyms** are recognized. For example, if the keyphrase is "room decorating ideas" and the synonym is "apartment decorating ideas" all the possible forms of each word are recognized: 'apartments', 'rooms', 'room's', 'decorate', 'decorates', 'decorated', 'idea', etc. These are then taken into account during keyphrase matching, after possible function words have been filtered out.

### Summary
|    	      | All languages	     | Languages with function word support | Languages with word form support 	                          |
|------------	|------------------	|---------------------	|-------------------------------------------------------------|
| Free        | Per-word matching    | Per-word matching, filtering out function words | Per-word matching, filtering out function words             |
| Premium	  | The above + synonyms | The above + synonyms	      | The above + synonyms + word forms of keyphrase and synonyms |

###cc Important notes
* **Per-word matching**, filtering out of function words and morphological forms of keyphrase and synonyms **can be suppressed** by using double quotations marks around the keyphrase or around a synonym. E.g., `"SEO analysis"`. When the focus keyphrase is enclosed in quotation marks, the **exact matching** approach is used.
* Check the [documentation on scoring specific assessments](https://github.com/Yoast/wordpress-seo/blob/trunk/packages/yoastseo/src/scoring/assessments/SCORING%20SEO.md) for information about which assessments use synonyms, and whether any additional matching criteria apply.
