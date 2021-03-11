<?php

namespace Yoast\WP\SEO\Validators\Search_Engine_Verify;

/**
 * Class Baidu_Verify_Validator.
 */
class Baidu_Verify_Validator extends Search_Engine_Verify_Validator {

	/**
	 * Get the name of the search engine for which the verification code is validated.
	 *
	 * @return string The name of the search engine.
	 */
	protected function get_search_engine_name() {
		return 'Baidu Webmaster tools';
	}

	/**
	 * Get the regex to validate the verification code against.
	 *
	 * @return string The regex to use for validation.
	 */
	protected function get_validation_regex() {
		return '`^[A-Za-z0-9_-]+$`';
	}
}
