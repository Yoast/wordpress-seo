<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium
 */

/**
 * Unit Test Class.
 */
class WPSEO_Premium_Free_Translations_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether the HTTP request args filter provides the expected results.
	 *
	 * This functionality tests if the Yoast SEO plugin is added to the upgrade request to WordPress.org
	 * which will collect translation files if they are out of date or missing.
	 *
	 * @dataProvider upgrade_request_data_provider
	 *
	 * @param array  $arguments HTTP request body.
	 * @param string $url       HTTP request URL.
	 * @param array  $expected  Expected HTTP request body after filtering.
	 * @param string $message   Error message the unit test should display if the test fails.
	 */
	public function test_yoast_seo_added_to_upgrade_request( $arguments, $url, $expected, $message = '' ) {

		$result = apply_filters( 'http_request_args', $arguments, $url );

		$this->assertEquals( $result, $expected, $message );
	}

	/**
	 * Provides the data for the upgrade request test.
	 *
	 * Format:
	 * [0] array HTTP Body that is passed to the filter.
	 * [1] string The URL that will be called in the HTTP request.
	 * [2] array HTTP Body that is expected to be returned from the filter.
	 *
	 * @return array List of upgrade request data.
	 */
	public function upgrade_request_data_provider() {
		return array(
			array(
				$this->get_http_body( array() ),
				'http://not-an-upgrade-request',
				$this->get_http_body( array() ),
				'Unexpected URL should not have any effect on the arguments',
			),
			array(
				$this->get_http_body(
					array(
						'yoast-seo/wp-seo.php' => array(
							'name' => 'Yoast SEO',
						),
					)
				),
				'http://api.wordpress.org/plugins/update-check/1.1',
				$this->get_http_body(
					array(
						'yoast-seo/wp-seo.php' => array(
							'name' => 'Yoast SEO',
						),
					)
				),
				'Plugin with Yoast SEO name exists in the list of plugins',
			),
			array(
				$this->get_http_body(
					array(
						plugin_basename( WPSEO_PREMIUM_PLUGIN_FILE ) => array(
							'name'    => 'Yoast SEO Premium',
							'Version' => '1.0',
						),
					)
				),
				'http://api.wordpress.org/plugins/update-check/1.1',
				$this->get_http_body(
					array(
						plugin_basename( WPSEO_PREMIUM_PLUGIN_FILE ) => array(
							'name'    => 'Yoast SEO Premium',
							'Version' => '1.0',
						),
						'wordpress-seo/wp-seo.php' => array(
							'name'    => 'Yoast SEO',
							'Version' => '1.0',
						),
					)
				),
				'WordPress SEO should be added when it does not exist yet',
			),
		);
	}

	/**
	 * Builds the HTTP Body that is expected from the filter.
	 *
	 * @param array $plugins List of plugins to use.
	 *
	 * @return array The HTTP Body.
	 */
	protected function get_http_body( $plugins ) {
		return array(
			'body' => array(
				'plugins' => wp_json_encode( array( 'plugins' => $plugins ) ),
			),
		);
	}
}
