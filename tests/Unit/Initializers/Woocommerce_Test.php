<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Yoast\WP\SEO\Initializers\Woocommerce;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Woocommerce_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Woocommerce
 *
 * @group integrations
 */
final class Woocommerce_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Woocommerce
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Woocommerce();
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 *
	 * @return void
	 */
	public function test_initialize() {
		$this->instance->initialize();

		$this->assertNotFalse( \has_action( 'before_woocommerce_init', [ $this->instance, 'declare_custom_order_tables_compatibility' ] ), 'Does not have expected before_woocommerce_init action' );
	}
}
