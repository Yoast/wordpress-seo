<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Product_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Product_Helper
 *
 * @group helpers
 */
class Product_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\Mock|Product_Helper
	 */
	protected $instance;

	/**
	 * Prepares the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Product_Helper();
	}

	/**
	 * Retrieves the name when premium is not 'active'.
	 *
	 * @covers ::get_name
	 * @covers ::get_product_name
	 * @covers ::is_premium
	 */
	public function test_get_name_not_premium() {
		$this->assertEquals( 'Yoast SEO plugin', $this->instance->get_name() );
	}

	/**
	 * Retrieves the name when premium is 'active'.
	 *
	 * @covers ::get_name
	 * @covers ::get_product_name
	 * @covers ::is_premium
	 */
	public function test_get_name_premium() {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Intended use, constant already exists.
		\define( 'WPSEO_PREMIUM_PLUGIN_FILE', 'the_premium_plugin_file' );

		$this->assertEquals( 'Yoast SEO Premium plugin', $this->instance->get_name() );
	}
}
