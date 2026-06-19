<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Hold_Back_Premium_Update_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Hold_Back_Premium_Update_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Hold_Back_Premium_Update_Conditional
 */
final class Hold_Back_Premium_Update_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Hold_Back_Premium_Update_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Hold_Back_Premium_Update_Conditional();
	}

	/**
	 * Tests that the conditional maps to the expected feature flag.
	 *
	 * @covers ::get_feature_flag
	 *
	 * @return void
	 */
	public function test_get_feature_name() {
		$this->assertSame( 'HOLD_BACK_PREMIUM_UPDATE', $this->instance->get_feature_name() );
	}

	/**
	 * Tests that the conditional is not met when the feature flag constant is not defined.
	 *
	 * @covers \Yoast\WP\SEO\Conditionals\Feature_Flag_Conditional::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met_when_flag_is_not_defined() {
		$this->assertFalse( $this->instance->is_met() );
	}
}
