<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Web_Stories_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Web_Stories_Conditional
 */
final class Web_Stories_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Web_Stories_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Web_Stories_Conditional();
	}

	/**
	 * Tests that the conditional is not met when the Story_Post_Type class does not exist.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the Story_Post_Type class exists.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		Monkey\Functions\expect( '\Google\Web_Stories\get_plugin_instance' )->never();

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
