# Overview of the SEO assessments scoring criteria on product pages
These are the scoring criteria applied when using the product pages SEO assessor in Japanese.

The SEO assessments check your content to make sure it adheres to SEO best practices.

This file describes the Japanese scoring criteria for SEO assessments on product pages. Not all assessments have language-specific scoring criteria in Japanese. To find more general information on the scoring criteria of the SEO assessments on product pages, you can consult the following page:
* [Scoring criteria for SEO assessments on product pages](../SCORING%20SEO%20PRODUCT.md)

### Assessments with the same language-specific scoring criteria as with the SEO assessor for posts and pages
- [Keyphrase in subheadings](SCORING%20SEO%20JA.md#2-keyphrase-in-subheadings)
- [Keyphrase distribution](SCORING%20SEO%20JA.md#3-keyphrase-distribution-only-in-premium) (only in combination with Premium in WordPress, or in Shopify)
- [Meta description length](SCORING%20SEO%20JA.md#2-meta-description-length)

### Assessments with the same scoring criteria as with the SEO assessor for posts and pages
- [Keyphrase in introduction](../SCORING%20SEO.md#1-keyphrase-in-introduction)
- [Keyphrase density](../SCORING%20SEO.md#3-keyphrase-density)
- [Keyphrase in meta description](../SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Competing links](../SCORING%20SEO.md#6-competing-links)
- [Keyphrase in image alt attributes](../SCORING%20SEO.md#7-keyphrase-in-image-alt-attributes)
- [Keyphrase in SEO title](../SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [Previously used keyphrase](../SCORING%20SEO.md#10-previously-used-keyphrase) (not available in Shopify)
- [SEO title width](../SCORING%20SEO.md#4-seo-title-width)
- [Single title](../SCORING%20SEO.md#6-single-title)
- [Function words in keyphrase](../SCORING%20SEO.md#7-function-words-in-keyphrase)
- [Title](../SCORING%20SEO.md#9-title-only-in-premium) (only in combination with Premium in WordPress, or in Shopify)

### Assessments with the same scoring criteria as with the product page assessor
- [Images](../SCORING%20SEO%20PRODUCT.md#2-images)
- [Image alt attributes](../SCORING%20SEO%20PRODUCT.md#1-image-alt-attributes)
- [Product identifier](../SCORING%20SEO%20PRODUCT.md#2-product-identifier)
- [SKU](../SCORING%20SEO%20PRODUCT.md#3-sku)

## Assessments with a language-specific criteria different from the SEO assessor for posts and pages
### Keyphrase-based SEO assessments scoring criteria
### 1) Keyphrase length

**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.
Additionally, Dutch, German and Swedish trigger an orange/red bullet with shorter keyphrases than other languages since keyphrases tend to be shorter in those languages (due to compound words being written as single words).

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: [https://yoa.st/33i](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33j](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                             | Feedback                                                                                                                                                           |
|-------------------|--------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyword set		                                | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**.                                    |
| Red   	           | 3		    | Keyphrase length > 18 characters	                     | **Keyphrase length**: The keyphrase contains X (content) characters. That's way more than the recommended maximum of X (content) characters. **Make it shorter!**  |
| Red   	           | 3		    | Keyphrase length 1-4 characters	                      | **Keyphrase length**: The keyphrase contains X (content) character(s). That's way less than the recommended minimum of X (content) characters. **Make it longer!** |
| Orange   	        | 6	     | Keyphrase length between 13 and 18 characters	        | **Keyphrase length**: The keyphrase contains X (content) characters. That's more than the recommended maximum of X (content) characters. **Make it shorter!** |
| Orange   	        | 6	     | Keyphrase length between 5 and 7 characters		         | **Keyphrase length**: The keyphrase contains X (content) characters. That's less than the recommended minimum of X (content) characters. **Make it longer!** |
| Green   	         | 9	     | Keyphrase length between 8 and 12 characters		 | **Keyphrase length**: Good job!                                                                                                                                    |

### Other SEO assessments scoring criteria

### 1) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**Title URL**: [https://yoa.st/34n](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34o](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	                   | Criterion                                                                                                  | Feedback                                                                                                                                                                                                                                                                                                                |
|-------------------|--------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 99 characters		                                                                              | **Text length**: The text contains X characters. This is far below the recommended minimum of 400 characters (cornerstone: 800 characters). **Add more content.**                                                                                           |
| Red	              | -10 (cornerstone: -20)		 | Between 100 and 199 characters (cornerstone: between 0 and 399)		                                          | **Text length**: The text contains X characters. This is far below the recommended minimum of X characters. **Add more content.**                                                                                                                                                                           |
| Red	              | 3 (cornerstone: -20)		   | Between 200 and 299 characters (cornerstone: between 400 and 599)			                                       | **Text length**: The text contains X characters. This is below the recommended minimum of X characters. **Add more content.**                                                                                                                                                                               |
| Orange	           | 6	                       | Between 300 and 399 characters (cornerstone: between 600 and 799)		                                        | **Text length**: The text contains X characters. This is slightly below the recommended minimum of 400 characters. **Add more content.** (cornerstone: **Text length**: the text contains X characters. This is below the recommended minimum of 800 characters. **Add more content.**) |
| Green	            | 9	                       | More than or exactly 400 characters (cornerstone: 800 characters)		 | **Text length**: The text contains X characters. Good job!                                                                                                                                                                                                                                                        |


## Unavailable assessments
The following assessments are not available for product pages:
* [Outbound links](../SCORING%20SEO.md#2-outbound-links) (removed because we don't actively encourage linking away from product pages, where the main action is buying the product)
* [Internal links](../SCORING%20SEO.md#3-internal-links) (removed because we don't actively encourage linking away from product pages, where the main action is buying the product)

The following assessments are not available for pages in Japanese:
* [Keyphrase in slug](../SCORING%20SEO.md#9-keyphrase-in-slug)
