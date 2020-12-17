<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Blocks_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional
 */
class Schema_Blocks_Conditional_Test extends TestCase {

	/**
	 * The schema blocks feature flag conditional.
	 *
	 * @var Schema_Blocks_Feature_Flag_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Schema_Blocks_Conditional();
	}

	/**
	 * Tests that the conditional is not met when the feature flag is not set.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the feature flag is set.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		if ( ! \defined( 'YOAST_SEO_SCHEMA_BLOCKS' ) ) {
			\define( 'YOAST_SEO_SCHEMA_BLOCKS', true );
		}

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
