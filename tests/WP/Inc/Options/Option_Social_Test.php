<?php

namespace Yoast\WP\SEO\Tests\WP\Inc\Options;

use WPSEO_Option_Social;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 */
final class Option_Social_Test extends TestCase {

	/**
	 * Tests if the validate_twitter_id() is validating as expected.
	 *
	 * @dataProvider provider_test_validate_twitter_id_return_value
	 * @covers       \WPSEO_Option_Social::validate_twitter_id
	 *
	 * @param string|false $expected      The expected return value.
	 * @param string       $twitter_id    The twitter id to be validated.
	 * @param bool         $strip_at_sign Whether to strip the `@` sign. Defaults to true.
	 *
	 * @return void
	 */
	public function test_validate_twitter_id_return_value(
		$expected,
		string $twitter_id,
		bool $strip_at_sign = true
	): void {
		/**
		 * The WPSEO_Option_Social instance.
		 *
		 * @var WPSEO_Option_Social $wpseo_option_titles
		 */
		$wpseo_option_titles = WPSEO_Option_Social::get_instance();

		$this->assertEquals( $expected, $wpseo_option_titles->validate_twitter_id( $twitter_id, $strip_at_sign ) );
	}

	/**
	 * Data provider for test_validate_twitter_id_return_value().
	 *
	 * @return array<array{0: string|false, 1: string, 2: bool}>
	 */
	public static function provider_test_validate_twitter_id_return_value(): array {
		return [
			'Twitter domain and secure protocol'   => [ 'yoast', 'https://twitter.com/yoast' ],
			'Twitter domain and unsecure protocol' => [ 'yoast', 'http://twitter.com/yoast' ],
			'X domain and secure protocol'         => [ 'yoast', 'https://x.com/yoast' ],
			'X domain and unsecure protocol'       => [ 'yoast', 'http://x.com/yoast' ],
			'Invalid domain'                       => [ false, 'https://example.com/yoast' ],
			'Handle with @'                        => [ 'yoast', '@yoast' ],
			'Handle without @ but no stripping'    => [ 'yoast', 'yoast', false ],
			'Handle without @ but with stripping'  => [ false, '@yoast', false ],
			'Length and characters check'          => [
				'thisIS25characterslong1_3',
				'https://x.com/thisIS25characterslong1_3',
			],
			'Too long'                             => [ false, 'https://x.com/thisis26characterslong1234' ],
			'Invalid character'                    => [ false, 'https://x.com/invalidchars!' ],
			'HTML should be stripped'              => [ 'yoast', 'https://x.com/<div>yoast</div>' ],
		];
	}
}
