### RC-1: November 6th, 2016
* removed setSitename and unsetSitename functions, these are replaced by the data from the templates.

### 1.0-beta3: October 5th, 2015
* BC breaks:
	* `config.sampleText.url` is no longer used. Instead, you can now use `config.sampleText.baseUrl` and `config.sampleText.snippetCite`. However, sampleText is no longer required since we've introduced defaults for it	.

### 1.0-beta2: September 23st, 2015
* Fixes a bug where the slug wasn't taken into account when checking if the url contains the focus keyword.

### 1.0-beta: September 21st, 2015
* Initial beta release