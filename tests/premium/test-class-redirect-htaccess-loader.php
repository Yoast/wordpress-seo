<?php

/**
 * Test double for testing the result of the match_redirects function.
 */
class WPSEO_Redirect_HTAccess_Loader_Double extends WPSEO_Redirect_HTAccess_Loader {
	public function match_with_given_regex( $regex ) {
		return $this->match_redirects( $regex );
	}

}

/**
 * Test class for the WPSEO Redirect HTAccess Loader
 */
class WPSEO_Redirect_HTAccess_Loader_Test extends WPSEO_UnitTestCase {

	private $htaccess_base = 'AuthName "Under Development"' . PHP_EOL .
							 'AuthUserFile /web/sitename.com/.htpasswd' . PHP_EOL .
							 'AuthType basic' . PHP_EOL .
							 'Require valid-user' . PHP_EOL .
							 'Order deny,allow' . PHP_EOL .
							 'Deny from all' . PHP_EOL .
							 'Allow from 208.113.134.190 w3.org htmlhelp.com googlebot.com' . PHP_EOL .
							 'Satisfy Any';

	public function test_simple_load() {
		$htaccess = $this->htaccess_base . PHP_EOL .
					'Redirect 301 /origin1 /target1' . PHP_EOL .
					'Redirect 301 /origin2 /target2';

		$instance  = new WPSEO_Redirect_HTAccess_Loader( $htaccess );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );

		$this->assertEquals( 'origin2', $redirects[1]->get_origin() );
		$this->assertEquals( 'target2', $redirects[1]->get_target() );
	}

	public function test_regex_load() {
		$htaccess = $this->htaccess_base . PHP_EOL .
					'RedirectMatch 301 /regex(\d+) /target' . PHP_EOL .
					'Redirect 301 /origin1 /target1';

		$instance  = new WPSEO_Redirect_HTAccess_Loader( $htaccess );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		// Plains redirects are always added first.
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );

		$this->assertEquals( '/regex(\d+)', $redirects[1]->get_origin() );
		$this->assertEquals( 'target', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );
	}

	public function test_regex_quote_load() {
		$htaccess = $this->htaccess_base . PHP_EOL .
					'RedirectMatch 301 "regex in quotes.*" /target' . PHP_EOL .
					'Redirect 301 /origin1 /target1';

		$instance  = new WPSEO_Redirect_HTAccess_Loader( $htaccess );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirect->get_type() );
		}
		// Plains redirects are always added first.
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirects[0]->get_format() );

		$this->assertEquals( 'regex in quotes.*', $redirects[1]->get_origin() );
		$this->assertEquals( 'target', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::FORMAT_REGEX, $redirects[1]->get_format() );
	}

	public function test_deleted_load() {
		$htaccess = $this->htaccess_base . PHP_EOL .
					'Redirect 410 /deleted' . PHP_EOL .
					'Redirect 301 /origin1 /target1';

		$instance  = new WPSEO_Redirect_HTAccess_Loader( $htaccess );
		$redirects = $instance->load();

		$this->assertCount( 2, $redirects );

		foreach ( $redirects as $redirect ) {
			$this->assertInstanceOf( 'WPSEO_Redirect', $redirect );
			$this->assertEquals( WPSEO_Redirect::FORMAT_PLAIN, $redirect->get_format() );
		}
		// Non-deleted redirects are always matched first.
		$this->assertEquals( 'origin1', $redirects[0]->get_origin() );
		$this->assertEquals( 'target1', $redirects[0]->get_target() );
		$this->assertEquals( WPSEO_Redirect::PERMANENT, $redirects[0]->get_type() );

		$this->assertEquals( 'deleted', $redirects[1]->get_origin() );
		$this->assertEquals( '', $redirects[1]->get_target() );
		$this->assertEquals( WPSEO_Redirect::DELETED, $redirects[1]->get_type() );
	}

	/**
	 * Test the plain redirect regex when the redirect origin does not contain quotes.
	 *
	 * @dataProvider plain_redirect_provider
	 */
	public function test_match_plain_redirects_regex_without_quotes( $regex, $htaccess, $expected ) {
		$instance = new WPSEO_Redirect_HTAccess_Loader_Double( $htaccess );
		$match = $instance->match_with_given_regex( $regex );

		$this->assertEquals( $expected, $match[0][3] );

	}
	/**
	 * Test the plain redirect regex when the redirect origin contain quotes.
	 *
	 * @dataProvider plain_redirect_provider_with_quotes
	 */
	public function test_match_plain_redirects_regex_with_quotes( $regex, $htaccess, $expected ) {
		$instance = new WPSEO_Redirect_HTAccess_Loader_Double( $htaccess );
		$match = $instance->match_with_given_regex( $regex );

		$this->assertEquals( $expected, $match[0][3] );

	}

	/**
	 * Provider for the redirects without quotes around the origin.
	 *
	 * @return array
	 */
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

	/**
	 * Provider for the redirects with the origin surrounded by quotes.
	 *
	 * @return array
	 */
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
