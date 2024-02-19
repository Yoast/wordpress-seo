<?php

namespace Yoast\WP\SEO\Tests\Unit\WooCommerce_Editor\Framework;

use Error;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional;

/**
 * Tests WooCommerce_Product_Block_Editor_Conditional.
 *
 * @group woocommerce-editor
 * @coversDefaultClass \Yoast\WP\SEO\WooCommerce_Editor\Framework\WooCommerce_Product_Block_Editor_Conditional
 */
final class WooCommerce_Product_Block_Editor_Conditional_Test extends TestCase {

	/**
	 * The WooCommerce_Product_Block_Editor_Conditional.
	 *
	 * @var WooCommerce_Product_Block_Editor_Conditional
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new WooCommerce_Product_Block_Editor_Conditional();
	}

	/**
	 * Tests is_met.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		try {
			$this->instance->is_met();
		} catch ( Error $e ) {
			$this->fail( 'The is_met method should not throw an error when FeaturesUtil class is not available.' );
		}

		$registry = Mockery::mock( 'alias:\Automattic\WooCommerce\Utilities\FeaturesUtil' );

		$registry->shouldReceive( 'feature_is_enabled' )->andReturn( true, false );

		$this->assertTrue( $this->instance->is_met() );
		$this->assertFalse( $this->instance->is_met() );
	}
}
