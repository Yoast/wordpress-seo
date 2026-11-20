<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class String_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\String_Helper
 */
final class String_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var String_Helper
	 */
	protected $instance;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new String_Helper();
	}

	/**
	 * Tests the stripping of all tags.
	 *
	 * @covers ::strip_all_tags
	 *
	 * @return void
	 */
	public function test_strip_all_tags() {
		$this->assertSame( 'This is an anchor', $this->instance->strip_all_tags( 'This is an <a>anchor</a>' ) );
	}

	/**
	 * Tests the standardization of the whitespace.
	 *
	 * @covers ::standardize_whitespace
	 *
	 * @dataProvider data_standardize_whitespace
	 *
	 * @param string $input    The text to standardize.
	 * @param string $expected The expected result.
	 *
	 * @return void
	 */
	public function test_standardize_whitespace( $input, $expected ) {
		$this->assertSame( $expected, $this->instance->standardize_whitespace( $input ) );
	}

	/**
	 * Data provider for test_standardize_whitespace().
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function data_standardize_whitespace() {
		return [
			'mixed whitespace'                         => [
				'input'    => " \nthis\r\ris  a string \t",
				'expected' => 'this is a string',
			],
			'three spaces left by two empty variables' => [
				'input'    => 'Post title   - Site name',
				'expected' => 'Post title - Site name',
			],
			'four spaces'                              => [
				'input'    => 'Post title    - Site name',
				'expected' => 'Post title - Site name',
			],
			'windows line breaks between paragraphs'   => [
				'input'    => "First paragraph.\r\n\r\nSecond paragraph.",
				'expected' => 'First paragraph. Second paragraph.',
			],
			'space next to a line break'               => [
				'input'    => "First line. \nSecond line.",
				'expected' => 'First line. Second line.',
			],
			'non-breaking space is left alone'         => [
				'input'    => "100\xC2\xA0km",
				'expected' => "100\xC2\xA0km",
			],
			'empty string'                             => [
				'input'    => '',
				'expected' => '',
			],
		];
	}

	/**
	 * Tests the stripping of shortcodes from a string.
	 *
	 * @covers ::strip_shortcode
	 *
	 * @return void
	 */
	public function test_strip_shortcode() {
		Monkey\Functions\expect( 'strip_shortcodes' )
			->with( 'this is a [shortcode] ' )
			->andReturn( 'this is a shortcode ' );

		$this->assertSame( 'this is a shortcode ', $this->instance->strip_shortcode( 'this is a [shortcode] ' ) );
	}
}
