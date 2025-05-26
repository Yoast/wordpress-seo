# Overview of the SEO assessments scoring criteria on product pages
These are the scoring criteria applied when using the product pages SEO assessors.

For information on how the assessments scoring system works, check out these explanations:
* [How are individual and overall traffic lights assigned?](SCORING%20SEO.md#how-are-individual-and-overall-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20SEO.md#how-is-the-overall-score-calculated)

**Note on URLs in feedback texts**: The URLs used in the feedback texts differ between WordPress and Shopify (the URLs are different, but they lead to the same pages).
In this document, only the shortlinks used in WordPress are listed.

## Keyphrase-based SEO assessments scoring criteria
### Assessments with the same scoring criteria as with the regular SEO assessor
- [Keyphrase in introduction](SCORING%20SEO.md#1-keyphrase-in-introduction)
- [Keyphrase density](SCORING%20SEO.md#3-keyphrase-density)
- [Keyphrase in meta description](SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Keyphrase in subheadings](SCORING%20SEO.md#5-keyphrase-in-subheadings)
- [Competing links (link keyphrase)](SCORING%20SEO.md#6-competing-links-link-keyphrase)
- [Keyphrase in image alt attributes](SCORING%20SEO.md#7-keyphrase-in-image-alt-attributes)
- [Keyphrase in SEO title](SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [Keyphrase in slug](SCORING%20SEO.md#9-keyphrase-in-slug)
- [Previously used keyphrase](SCORING%20SEO.md#10-previously-used-keyphrase)
- [Keyphrase distribution](SCORING%20SEO.md#11-keyphrase-distribution-only-in-premium) (only in combination with Premium in WordPress, or in Shopify)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Keyphrase length

**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.
Additionally, Dutch, German and Swedish trigger an orange/red bullet with shorter keyphrases than other languages since keyphrases tend to be shorter in those languages (due to compound words being written as single words).

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**Title URL**: [https://yoa.st/33i](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/33j](https://yoast.com/why-keyphrase-length-matters/#utm_source=yoast-seo&utm_medium=software&utm_term=keyphrase-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                                                                 | Feedback                                                                                                                                                                      |
|-------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyword set		                                                                                                                    | **Keyphrase length**: No focus keyphrase was set for this page. **Set a focus keyphrase in order to calculate your SEO score**.                                               |
| Red   	           | 3		    | Keyphrase length > 8 words (> 9 for languages without function words support; > 7 for NL, DE, SV, > 18 characters for Japanese)	          | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's way more than the recommended maximum of X (content) words/characters. **Make it shorter!** |
| Red   	           | 3		    | Keyphrase length 1-2 words (1 word for NL, DE, SV, 1-4 characters for Japanese)	                                                          | **Keyphrase length**: The keyphrase contains X (content) word(s)/character(s). That's way less than the recommended minimum of X (content) words. **Make it longer!**         |
| Orange   	        | 6	     | Keyphrase length between 7-8 words (7-9 for languages without function words support; 7 for NL, DE, SV, 13-18 characters for Japanese )		 | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's more than the recommended maximum of X (content) words/characters. **Make it shorter!**     |
| Orange   	        | 6	     | Keyphrase length 3 words (2 words for NL, DE, SV, 5-7 characters for Japanese)		                                                          | **Keyphrase length**: The keyphrase contains X (content) words/characters. That's less than the recommended minimum of X (content) words/characters. **Make it longer!**      |
| Green   	         | 9	     | Keyphrase length between 4-6 words (3-6 for NL, DE, SV, 8-12 characters for Japanese)		                                                   | **Keyphrase length**: Good job!                                                                                                                                               |

## Other SEO assessments scoring criteria
### Assessments with the same scoring criteria as with the regular SEO assessor
- [SEO title width](SCORING%20SEO.md#4-seo-title-width)
- [Meta description length](SCORING%20SEO.md#5-meta-description-length)
- [Single title](SCORING%20SEO.md#6-single-title)
- [Function words in keyphrase](SCORING%20SEO.md#7-function-words-in-keyphrase)
- [Images](SCORING%20SEO.md#8-images)
- [Title](SCORING%20SEO.md#9-title-only-in-premium) (only in combination with Premium in WordPress, or in Shopify)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**Title URL**: [https://yoa.st/34n](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

**Call to action URL**: [https://yoa.st/34o](https://yoast.com/blog-post-word-count-seo/#utm_source=yoast-seo&utm_medium=software&utm_term=text-length-name&utm_content=content-analysis) (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	                   | Criterion                                                                                                                               | Feedback                                                                                                                                                                                                                                                                                                                |
|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 49 words (cornerstone: between 0 and 0, Japanese: 0-99 characters)		                                                      | **Text length**: The text contains X words/characters. This is far below the recommended minimum of 200 words (cornerstone: 400 words, Japanese: 400 characters, Japanese cornerstone: 800 characters). **Add more content.**                                                                                           |
| Red	              | -10 (cornerstone: -20)		 | Between 50 and 99 words (cornerstone: between 0 and 199, Japanese: 100-199 characters, Japanese cornerstone: 0-399 characters)		        | **Text length**: The text contains X words/characters. This is far below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                           |
| Red	              | 3 (cornerstone: -20)		   | Between 100 and 149 words (cornerstone: between 200 and 299, Japanese: 200-299 characters, Japanese cornerstone: 400-599 characters)			 | **Text length**: The text contains X words/characters. This is below the recommended minimum of X words/characters. **Add more content.**                                                                                                                                                                               |
| Orange	           | 6	                       | Between 150 and 199 words (cornerstone: between 300 and 399, Japanese: 300-399 characters, Japanese cornerstone: 600-799 characters)		  | **Text length**: The text contains X words/characters. This is slightly below the recommended minimum of 200 words/400 characters. **Add more content.** (cornerstone: **Text length**: the text contains X words/characters. This is below the recommended minimum of 400 words/800 characters. **Add more content.**) |
| Green	            | 9	                       | More than or exactly 200 words (cornerstone: 400, Japanese: 400 characters, Japanese cornerstone: 800 characters)		                     | **Text length**: The text contains X words/characters. Good job!                                                                                                                                                                                                                                                        |


### Assessments unique to product pages
### 1) Image alt attributes
**What it does**: Checks if all images have alt attributes.

**When it applies**: Always.

**Name in code**: ImageAltTagsAssessment

**Title URL**: https://yoa.st/33c (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/33d (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                  | Feedback                                                                                                      |
|-------------------|--------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Red	              | 3	     | No images	                                 | **Image alt attributes**: This page does not have images with alt attributes. **Add some!**                   |
| Red	              | 3	     | None of the images have alt attributes		   | **Image alt attributes**: None of the images have alt attributes. **Add alt attributes to your images!**      |
| Red	              | 3	     | Not all of the images have alt attributes	 | **Image alt attributes**: X images out of Y don’t have alt attributes. **Add alt attributes to your images!** |
| Green	            | 9	     | All of the images have alt attributes		    | **Image alt attributes**: All images have alt attributes. Good job!                                           |

### 2) Product identifier
**Name in code**: ProductIdentifiersAssessment

**What it does**: Checks whether a product, or each of its variants if the product has variants, has an identifier.

**When it applies**: _In Woo for products without variants_: if the content of all global identifier fields can be retrieved, or if at least one identifier is found for the product (even if the content of all identifier fields cannot be retrieved)

_In Woo for products with variants_: if the content of all global identifier fields for all variants can be retrieved, or if at least one identifier is found for every variant (even if the content of all identifier fields cannot be retrieved)

(The content of product identifier fields can't be retrieved if, for example, the user adds some code to remove them).

_In Shopify_: When a product doesn't have variants.

**Title URL**: https://yoa.st/4ly  (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4lz  (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                                                                                  | Feedback                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange	           | 6	     | No product identifier filled in for a simple product or (in Woo) no product identifier filled in for a variable product that doesn't have variations set		 | _WooCommerce_:<br> **Product identifier**: Your product is missing an identifier (like a GTIN code). **Include it if you can, as it will help search engines to better understand your content.** <br><br> _Shopify_: <br> **Barcode**: Your product is missing a barcode (like a GTIN code). **Include it if you can, as it will help search engines to better understand your content.** |
| Orange	           | 6	     | One or multiple variants are missing a product identifier		                                                                                                | _WooCommerce_:<br> **Product identifier**: Not all your product variants have an identifier. **Include it if you can, as it will help search engines to better understand your content.** <br><br> _Shopify_: N/A                                                                                                                                                                          |
| Green	            | 9	     | Product identifier is filled in for a simple product or (in Woo) product identifier is filled in for a variable product that doesn't have variations set		 | _WooCommerce_:<br> **Product identifier**: Your product has an identifier. Good job! <br><br> _Shopify_: Your product has a barcode. Good job!                                                                                                                                                                                                                                             |
| Green	            | 9	     | If there is at least one variant and a product identifier is filled in for each variant (regardless of whether the default is filled in or not).		         | _WooCommerce_:<br> **Product identifier**: All your product variants have an identifier. Good job! <br><br> _Shopify_: N/A                                                                                                                                                                                                                                                                 |

### 3) SKU
**What it does**: Checks whether a product, or each of its variants if the product has variants, has a SKU.

**When it applies**: _In Woo for products without variants_: if the content of the global SKU field can be retrieved.

_In Woo for products with variants_: when the content of the SKU fields of all variants can be retrieved.

(The content of SKU fields can't be retrieved if, for example, another plugin overrides the fields, such as the Product SKU Generator for WooCommerce).

_In Shopify_: When a product doesn't have variants.

**Name in code**: ProductSKUAssessment

**Title URL**: https://yoa.st/4lw  (link placement is in bold in the feedback strings)

**Call to action URL**: https://yoa.st/4lx  (link placement is in bold in the feedback strings)

| Traffic light   	 | Score	 | Criterion                                                                                                                           | Feedback                                                                                                                                        |
|-------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange	           | 6	     | No SKU filled in for a simple product or (in Woo) no SKU filled in for a variable product that doesn't have variations set		        | **SKU**: Your product is missing a SKU. **Include it if you can, as it will help search engines to better understand your content.**            |
| Orange	           | 6	     | One or multiple variants are missing a SKU		                                                                                        | **SKU**: Not all your product variants have a SKU. **Include it if you can, as it will help search engines to better understand your content.** |
| Green	            | 9	     | SKU is filled in for a simple product or (in Woo) SKU is filled in for a variable product that doesn't have variations set		        | **SKU**: Your product has a SKU. Good job!                                                                                                      |
| Green	            | 9	     | If there is at least one variant and a SKU is filled in for each variant (regardless of whether the default is filled in or not).		 | **SKU**: All your product variants have a SKU. Good job!                                                                                        |

### Unavailable assessments
The following assessments are not available for product pages:
* Outbound links
* Internal links

When a user is on a product page, the main action you want them to perform is to buy that product.
So that's why we don't actively encourage linking away to other pages.
(On informative blog posts, conversely, it does make sense to have links such as “continue reading another post” or “find more information here”.)
