<?php

class WPSEO_Premium_Import_Manager_Double extends WPSEO_Premium_Import_Manager {

	public function match_with_given_regex( $regex, $htaccess ) {
		return $this->match_redirect_regex( $regex, $htaccess );
	}

}

class WPSEO_Premium_Import_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 *
	 * @dataProvider plain_redirect_provider
	 */
	public function test_match_plain_redirects_regex_without_quotes( $regex, $htaccess, $expected ) {
		$instance = new WPSEO_Premium_Import_Manager_Double();
		$match = $instance->match_with_given_regex( $regex , $htaccess );

		$this->assertEquals( $expected, $match[0][3] );

	}
	/**
	 *
	 * @dataProvider plain_redirect_provider_with_quotes
	 */
	public function test_match_plain_redirects_regex_with_quotes( $regex, $htaccess, $expected ) {
		$instance = new WPSEO_Premium_Import_Manager_Double();
		$match = $instance->match_with_given_regex( $regex , $htaccess );

		$this->assertEquals( $expected, $match[0][3] );

	}


	public function plain_redirect_provider(  ) {
		$regex_to_match = '`^Redirect ([0-9]{3}) ([^"\s]+) ([a-z0-9-_+/.:%&?=#\][]+)`im';

		return array(
			// Mentioned in https://github.com/Yoast/wordpress-seo-premium/issues/934.
			array(
				$regex_to_match,
				'Redirect 301 /denver-balayage-sal/ https://dothebangthingsalon.com/denver-balayage-salon/',
				'https://dothebangthingsalon.com/denver-balayage-salon/',
			),
			// Mentioned in https://github.com/Yoast/wordpress-seo-premium/issues/934.
			array(
				$regex_to_match,
				'Redirect 301 /video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/nqf3kv0qyp /video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/',
				'/video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/',
			),

			// Try to match the other ones.
			array(
				$regex_to_match,
				'Redirect 301 redirect-this https://to-an-url-starting-with/123-numeric-value',
				'https://to-an-url-starting-with/123-numeric-value',
			),
			array(
				$regex_to_match,
				'Redirect 301 redirect-this /with.html?attibute=one&another_attribute=two',
				'/with.html?attibute=one&another_attribute=two',
			),
			array(
				$regex_to_match,
				'Redirect 301 redirect-this /with.html?attibute[]=123',
				'/with.html?attibute[]=123',
			),
		);
	}


	public function plain_redirect_provider_with_quotes(  ) {
		$regex_to_match = '`^Redirect ([0-9]{3}) "([^"]+)" ([a-z0-9-_+/.:%&?=#\][]+)`im';

		return array(
			// Variant of https://github.com/Yoast/wordpress-seo-premium/issues/934.
			array(
				$regex_to_match,
				'Redirect 301 "/denver-balayage-sal/" https://dothebangthingsalon.com/denver-balayage-salon/',
				'https://dothebangthingsalon.com/denver-balayage-salon/',
			),
			// Variant of https://github.com/Yoast/wordpress-seo-premium/issues/934.
			array(
				$regex_to_match,
				'Redirect 301 "/video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/nqf3kv0qyp" /video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/',
				'/video/endoscopic-repair-of-tracheal-bronchial-sinus-tract/',
			),

			// Try to match the other ones.
			array(
				$regex_to_match,
				'Redirect 301 "redirect-this" https://to-an-url-starting-with/123-numeric-value',
				'https://to-an-url-starting-with/123-numeric-value',
			),
			array(
				$regex_to_match,
				'Redirect 301 "redirect-this" /with.html?attibute=one&another_attribute=two',
				'/with.html?attibute=one&another_attribute=two',
			),
			array(
				$regex_to_match,
				'Redirect 301 "redirect-this" /with.html?attibute[]=123',
				'/with.html?attibute[]=123',
			),
		);
	}
}