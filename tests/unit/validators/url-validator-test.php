<?php

namespace Yoast\WP\SEO\Tests\Unit\Validators;

use Brain\Monkey;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Url_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Validators\Url_Validator;

/**
 * Tests the Url_Validator class.
 *
 * @group options
 * @group validators
 *
 * @coversDefaultClass \Yoast\WP\SEO\Validators\Url_Validator
 */
class Url_Validator_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Url_Validator
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
		Monkey\Functions\stubs(
			[
				'wp_parse_url'  => 'parse_url',
				'wp_parse_str'  => 'parse_str',
				'add_query_arg' => static function ( $data, $url ) {
					return $url . '?' . \http_build_query( $data );
				},
			]
		);

		$this->instance = new Url_Validator();
	}

	/**
	 * Tests validation.
	 *
	 * @dataProvider url_provider
	 *
	 * @covers ::validate
	 * @covers ::sanitize
	 * @covers ::sanitize_encoded_text_field
	 * @covers ::get_charset
	 *
	 * @param mixed  $value     The value to test/validate.
	 * @param mixed  $expected  The expected result.
	 * @param string $exception The expected exception class. Optional, use when the expected result is false.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Url_Exception
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Validation_Exception
	 */
	public function test_validate( $value, $expected, $exception = '' ) {
		if ( ! $expected ) {
			$this->expectException( $exception );
			$this->instance->validate( $value );

			return;
		}

		$this->assertEquals( $expected, $this->instance->validate( $value ) );
	}

	/**
	 * Data provider to test multiple URLs.
	 *
	 * @return array A mapping of methods and expected inputs.
	 */
	public function url_provider() {
		return [
			// Basic URLs.
			'protocol_https'                 => [
				'value'    => 'https://example.org',
				'expected' => 'https://example.org',
			],
			'protocol_http'                  => [
				'value'    => 'http://example.org',
				'expected' => 'http://example.org',
			],
			'no_protocol'                    => [
				'value'     => 'example.org',
				'expected'  => false,
				'exception' => Invalid_Url_Exception::class,
			],
			'with_path'                      => [
				'value'    => 'https://example.org/foo',
				'expected' => 'https://example.org/foo',
			],
			'with_query'                     => [
				'value'    => 'https://example.org/foo?bar=baz',
				'expected' => 'https://example.org/foo?bar=baz',
			],
			'strip_invalid_characters'       => [
				'value'    => 'https://ex!!ample.org',
				'expected' => 'https://example.org',
			],

			// Characters should be encoded.
			'already_encoded'                => [
				'value'    => 'https://fr.wikipedia.org/wiki/Fran%C3%A7ais',
				'expected' => 'https://fr.wikipedia.org/wiki/Fran%c3%a7ais',
			],
			'should_encode'                  => [
				'value'    => 'https://fr.wikipedia.org/wiki/Français',
				'expected' => 'https://fr.wikipedia.org/wiki/Fran%c3%a7ais',
			],

			// Invalid types.
			'empty_string'                   => [
				'value'     => '',
				'expected'  => false,
				'exception' => Invalid_Url_Exception::class,
			],
			'integer'                        => [
				'value'     => 1,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'array'                          => [
				'value'     => [],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'object'                         => [
				'value'     => (object) [],
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'null'                           => [
				'value'     => null,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],
			'boolean'                        => [
				'value'     => false,
				'expected'  => false,
				'exception' => Invalid_Type_Exception::class,
			],

			// Note the protocol filter does not work in the tests due to `esc_url_raw` being mocked.
			'ftp_protocol'                   => [
				'value'    => 'ftp://ftp.is.co.za/rfc/rfc1808.txt',
				'expected' => 'ftp://ftp.is.co.za/rfc/rfc1808.txt',
			],

			// Related issue: https://github.com/Yoast/wordpress-seo/issues/14476.
			'with_encoded_url'               => [
				'value'    => 'https://example.com/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
				'expected' => 'https://example.com/%da%af%d8%b1%d9%88%d9%87-%d8%aa%d9%84%da%af%d8%b1%d8%a7%d9%85-%d8%b3%d8%a6%d9%88/',
			],
			'with_non_encoded_non_latin_url' => [
				'value'    => 'https://example.com/گروه-تلگرام-سئو',
				'expected' => 'https://example.com/%da%af%d8%b1%d9_%d9_-%d8%aa%d9_%da%af%d8%b1%d8%a7%d9_-%d8%b3%d8%a6%d9_',
			],
			// Related issue: https://github.com/Yoast/wordpress-seo/issues/7664.
			'invalid_url'                    => [
				'value'     => 'WordPress',
				'expected'  => false,
				'exception' => Invalid_Url_Exception::class,
			],
			'only_absolute_path'             => [
				'value'     => '/images/user-defined.png',
				'expected'  => false,
				'exception' => Invalid_Url_Exception::class,
			],
			'with_non_encoded_url'           => [
				'value'    => 'https://example.org/this-is-a-page',
				'expected' => 'https://example.org/this-is-a-page',
			],
			'with_html_in_url'               => [
				'value'    => 'https://example.org/this-<strong>is-a-</strong>page',
				'expected' => 'https://example.org/this-%26lt%3bstrong%26gt%3bis-a-%26lt%3b/strong%26gt%3bpage',
			],
			'with_all_components_in_url'     => [
				'value'    => 'http://user:pass@example.com:8080/subdir/test1?modèle=numérique#complètement',
				'expected' => 'http://user:pass@example.com:8080/subdir/test1?mod%25C3%25A8le=num%25C3%25A9rique#compl%c3%a8tement',
			],
			'with_invalid_utf8_in_url'       => [
				'value'    => 'https://example.com/%e2%28%a1-aaaaaa',
				'expected' => 'https://example.com/%e2%28%a1-aaaaaa',
			],
			'with_reserved_chars_in_url'     => [
				'value'    => 'https://www.example.com/©-2020/?email=test@example.com&âlt=©òdës',
				'expected' => 'https://www.example.com/%c2%a9-2020/?email=test%2540example.com&amp%253B%25C3%25A2lt=%25C2%25A9%25C3%25B2d%25C3%25ABs',
			],
			'with_ipv6_in_url'               => [
				'value'    => 'https://user:pass@[fc00::1]:8443/subdir/test1/?query=test2#fragment',
				'expected' => 'https://user:pass@[fc00::1]:8443/subdir/test1/?query=test2#fragment',
			],
			'html_injection'                 => [
				'value'    => 'https://" onafterprint="console.log(0)',
				'expected' => 'https://quotonafterprintquotconsole.log0',
			],
		];
	}
}
