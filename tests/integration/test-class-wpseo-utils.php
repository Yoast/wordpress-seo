<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Utils_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests whether is_apache correctly returns if the site runs on apache.
	 *
	 * @covers WPSEO_Utils::is_apache
	 */
	public function test_wpseo_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( WPSEO_Utils::is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( WPSEO_Utils::is_apache() );
	}

	/**
	 * Tests whether is_apache correctly returns if the site runs on nginx.
	 *
	 * @covers WPSEO_Utils::is_nginx
	 */
	public function test_wpseo_is_nginx() {
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertTrue( WPSEO_Utils::is_nginx() );

		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertFalse( WPSEO_Utils::is_nginx() );
	}

	/**
	 * Tests whether trim_nbsp_from_string correctly strips no-break spaces.
	 *
	 * @covers WPSEO_Utils::trim_nbsp_from_string
	 */
	public function test_wpseo_trim_nbsp_from_string() {
		$old_string = ' This is an old string with&nbsp;as spaces.&nbsp;';
		$expected   = 'This is an old string with as spaces.';

		$this->assertEquals( $expected, WPSEO_Utils::trim_nbsp_from_string( $old_string ) );
	}

	/**
	 * Tests translate_score function.
	 *
	 * @dataProvider translate_score_provider
	 * @covers       WPSEO_Utils::translate_score
	 *
	 * @param int    $score     The decimal score to translate.
	 * @param bool   $css_value Whether to return the i18n translated score or the CSS class value.
	 * @param string $expected  Expected function result.
	 */
	public function test_translate_score( $score, $css_value, $expected ) {
		$this->assertEquals( $expected, WPSEO_Utils::translate_score( $score, $css_value ) );
	}

	/**
	 * Provides test data for test_translate_score().
	 *
	 * @return array
	 */
	public function translate_score_provider() {
		return [
			[ 0, true, 'na' ],
			[ 1, true, 'bad' ],
			[ 23, true, 'bad' ],
			[ 40, true, 'bad' ],
			[ 41, true, 'ok' ],
			[ 55, true, 'ok' ],
			[ 70, true, 'ok' ],
			[ 71, true, 'good' ],
			[ 83, true, 'good' ],
			[ 100, true, 'good' ],
			[ 0, false, 'Not available' ],
			[ 1, false, 'Needs improvement' ],
			[ 23, false, 'Needs improvement' ],
			[ 40, false, 'Needs improvement' ],
			[ 41, false, 'OK' ],
			[ 55, false, 'OK' ],
			[ 70, false, 'OK' ],
			[ 71, false, 'Good' ],
			[ 83, false, 'Good' ],
			[ 100, false, 'Good' ],
		];
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, is_yoast_seo_free_page() should return false.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages() {
		$current_page = '';

		$this->assertFalse( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	/**
	 * When current page is not in the list of Yoast SEO Free, but is a page of one of the plugin' addons,
	 * the function should return false.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_not_in_yoast_seo_free_pages_but_is_yoast_seo_addon_page() {
		$current_page = 'wpseo_news';

		$this->assertFalse( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	/**
	 * When the current page belongs to Yoast SEO Free, the function is_yoast_seo_free_page() should return true.
	 *
	 * @covers WPSEO_Utils::is_yoast_seo_free_page
	 */
	public function test_current_page_in_yoast_seo_free_pages() {
		$current_page = 'wpseo_dashboard';

		$this->assertTrue( WPSEO_Utils::is_yoast_seo_free_page( $current_page ) );
	}

	/**
	 * Tests whether the plugin is network-active or not.
	 *
	 * @covers WPSEO_Utils::is_plugin_network_active
	 */
	public function test_is_plugin_network_active() {
		$this->assertFalse( WPSEO_Utils::is_plugin_network_active() );
	}

	/**
	 * Tests the retrieve enabled features function without the defined variable or filter.
	 *
	 * @covers WPSEO_Utils::retrieve_enabled_features
	 */
	public function test_retrieve_enabled_features_without_define_or_filter() {
		$this->assertEmpty( WPSEO_Utils::retrieve_enabled_features() );
	}

	/**
	 * Tests the retrieve enabled features function with defined variables.
	 *
	 * @covers WPSEO_Utils::retrieve_enabled_features
	 */
	public function test_retrieve_enabled_features_with_define() {
		// Retrieve currently defined feature flags. Set them if they do not exist yet.
		if ( ! defined( 'YOAST_SEO_ENABLED_FEATURES' ) ) {
			define( 'YOAST_SEO_ENABLED_FEATURES', 'some-feature' );
		}
		$expected = preg_split( '/,\W*/', YOAST_SEO_ENABLED_FEATURES );
		$this->assertEquals( $expected, WPSEO_Utils::retrieve_enabled_features() );
	}

	/**
	 * Tests the retrieve enabled features function with filter.
	 *
	 * @covers WPSEO_Utils::retrieve_enabled_features
	 */
	public function test_retrieve_enabled_features_with_filter() {
		// Retrieve currently defined feature flags. Set them if they do not exist yet.
		if ( ! defined( 'YOAST_SEO_ENABLED_FEATURES' ) ) {
			define( 'YOAST_SEO_ENABLED_FEATURES', 'some-feature' );
		}
		$expected = preg_split( '/,\W*/', YOAST_SEO_ENABLED_FEATURES );

		// Features we expect to be added by the filter.
		$added_features = [ 'some functionality', 'other things' ];
		// Expected features are the ones in the PHP constant + the features added by the filter.
		$expected = array_merge( $expected, $added_features );

		add_filter( 'wpseo_enable_feature', [ $this, 'filter_wpseo_enable_feature' ] );
		$this->assertEquals( $expected, WPSEO_Utils::retrieve_enabled_features() );
	}

	/**
	 * Filter function to test the `wpseo_enable_feature` filter.
	 *
	 * @param string[] $enabled_features The unfiltered enabled features.
	 *
	 * @return array The filtered enabled features.
	 */
	public function filter_wpseo_enable_feature( $enabled_features ) {
		$second_array = [
			'some functionality',
			'other things',
		];

		return array_merge( $enabled_features, $second_array );
	}

	/**
	 * Tests the sanitize_url.
	 *
	 * @dataProvider sanitize_url_provider
	 *
	 * @covers WPSEO_Utils::sanitize_url
	 *
	 * @param string $expected        Expected function outcome.
	 * @param string $url_to_sanitize Input to pass to the function under test.
	 */
	public function test_sanitize_url( $expected, $url_to_sanitize ) {
		$this->assertEquals( $expected, WPSEO_Utils::sanitize_url( $url_to_sanitize ) );
	}

	/**
	 * Provides data to the sanitize_url test.
	 *
	 * @return array The test data.
	 */
	public function sanitize_url_provider() {
		return [
			// Related issue: https://github.com/Yoast/wordpress-seo/issues/14476.
			'with_encoded_url'               => [
				'expected'        => 'https://example.com/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
				'url_to_sanitize' => 'https://example.com/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
			],
			'with_non_encoded_non_latin_url' => [
				'expected'        => 'https://example.com/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88',
				'url_to_sanitize' => 'https://example.com/گروه-تلگرام-سئو',
			],
			// Related issue: https://github.com/Yoast/wordpress-seo/issues/7664.
			'invalid_url'                    => [
				'expected'        => '',
				'url_to_sanitize' => 'WordPress',
			],
			'only_absolute_path'             => [
				'expected'        => '/images/user-defined.png',
				'url_to_sanitize' => '/images/user-defined.png',
			],
			'with_non_encoded_url'           => [
				'expected'        => 'https://example.org/this-is-a-page',
				'url_to_sanitize' => 'https://example.org/this-is-a-page',
			],
			'with_html_in_url'               => [
				'expected'        => 'https://example.org/this-is-a-page',
				'url_to_sanitize' => 'https://example.org/this-<strong>is-a-</strong>page',
			],
			'with_all_components_in_url'     => [
				'expected'        => 'http://user:pass@example.com:8080/subdir/test1?mod%c3%a8le=num%c3%a9rique#compl%c3%a8tement',
				'url_to_sanitize' => 'http://user:pass@example.com:8080/subdir/test1?modèle=numérique#complètement',
			],
			'with_invalid_utf8_in_url'       => [
				'expected'        => 'https://example.com/',
				'url_to_sanitize' => 'https://example.com/%e2%28%a1-aaaaaa',
			],
			'with_reserved_chars_in_url'     => [
				'expected'        => 'https://www.example.com/%c2%a9-2020/?email=test%40example.com&%c3%a2lt=%c2%a9%c3%b2d%c3%abs',
				'url_to_sanitize' => 'https://www.example.com/©-2020/?email=test@example.com&âlt=©òdës',
			],
			'with_ipv6_in_url'               => [
				'expected'        => 'https://user:pass@[fc00::1]:8443/subdir/test1/?query=test2#fragment',
				'url_to_sanitize' => 'https://user:pass@[fc00::1]:8443/subdir/test1/?query=test2#fragment',
			],
			'html_injection'                 => [
				'expected'        => 'https://onafterprintconsole.log0',
				'url_to_sanitize' => 'https://" onafterprint="console.log(0)',
			],
		];
	}
}
