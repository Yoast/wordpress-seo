<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Conditionals
 */

namespace Yoast\WP\SEO\Tests\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Web_Stories_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Web_Stories_Conditional
 */
class Web_Stories_Conditional_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var Web_Stories_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Web_Stories_Conditional();
	}

	/**
	 * Tests that the conditional is not met when the Story_Post_Type class does not exist.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the Story_Post_Type class exists.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( '\Google\Web_Stories\get_plugin_instance' )->never();

		$this->assertEquals( true, $this->instance->is_met() );
	}
}
