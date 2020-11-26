<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Jetpack_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Jetpack_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Jetpack_Conditional
 */
class Jetpack_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Jetpack_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Jetpack_Conditional();
	}

	/**
	 * Tests that the conditional is not met when the Jetpack class does not exist.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the Jetpack class exists.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Mockery::mock( 'Jetpack' );

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
