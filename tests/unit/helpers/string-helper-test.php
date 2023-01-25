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
class String_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var String_Helper
	 */
	protected $instance;

	/**
	 * Setup.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new String_Helper();
	}

	/**
	 * Tests the stripping of all tags.
	 *
	 * @covers ::strip_all_tags
	 */
	public function test_strip_all_tags() {
		static::assertSame( 'This is an anchor', $this->instance->strip_all_tags( 'This is an <a>anchor</a>' ) );
	}

	/**
	 * Tests the standardization of the whitespace.
	 *
	 * @covers ::standardize_whitespace
	 */
	public function test_standardize_whitespace() {
		static::assertSame( 'this is a string', $this->instance->standardize_whitespace( " \nthis\r\ris  a string \t" ) );
	}

	/**
	 * Tests the stripping of shortcodes from a string.
	 *
	 * @covers ::strip_shortcode
	 */
	public function test_strip_shortcode() {
		Monkey\Functions\expect( 'strip_shortcodes' )
			->with( 'this is a [shortcode] ' )
			->andReturn( 'this is a shortcode ' );

		static::assertSame( 'this is a shortcode ', $this->instance->strip_shortcode( 'this is a [shortcode] ' ) );
	}
}
