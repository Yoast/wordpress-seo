<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Dynamic_Product_Permalinks_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Dynamic_Product_Permalinks_Conditional_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Dynamic_Product_Permalinks_Conditional
 *
 * @group conditionals
 */
final class Dynamic_Product_Permalinks_Conditional_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Dynamic_Product_Permalinks_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Dynamic_Product_Permalinks_Conditional();
	}

	/**
	 * Tests that the conditional returns the correct feature flag name.
	 *
	 * @covers ::get_feature_flag
	 *
	 * @return void
	 */
	public function test_get_feature_flag() {
		$this->assertSame( 'DYNAMIC_PRODUCT_PERMALINKS', $this->instance->get_feature_name() );
	}

	/**
	 * Tests that the conditional is not met when the constant is not defined.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_false_when_constant_not_defined() {
		$this->assertFalse( $this->instance->is_met() );
	}
}
