<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Conditionals\Get_Request_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Get_Request_Conditional_Test
 *
 * @group indexables
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Get_Request_Conditional
 */
final class Get_Request_Conditional_Test extends TestCase {

	/**
	 * Holds the GET request conditional under test.
	 *
	 * @var Get_Request_Conditional
	 */
	private $instance;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Get_Request_Conditional();
	}

	/**
	 * Tests that the conditional is met on a GET request.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_on_get_request() {
		$_SERVER['REQUEST_METHOD'] = 'GET';

		$is_met = $this->instance->is_met();

		$this->assertEquals( true, $is_met );
	}

	/**
	 * Tests that the conditional is not met on a POST request.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_on_post_request() {
		$_SERVER['REQUEST_METHOD'] = 'POST';

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}

	/**
	 * Tests that the conditional is not met when method is not set in server vars.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_on_method_unset() {
		unset( $_SERVER['REQUEST_METHOD'] );

		$is_met = $this->instance->is_met();

		$this->assertEquals( false, $is_met );
	}
}
