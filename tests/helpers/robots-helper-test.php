<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Brain\Monkey;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Robots_Helper
 */
class Robots_Helper_Test extends TestCase {

	/**
	 * @var Robots_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Robots_Helper();
	}

	/**
	 * Tests whether the get_base_values function returns the right values when noindex and nofollow are true.
	 *
	 * @covers ::get_base_values
	 */
	public function test_get_base_values_true() {
		$indexable = new Indexable();

		$indexable->is_robots_nofollow = true;
		$indexable->is_robots_noindex  = true;

		$actual = $this->instance->get_base_values( $indexable );

		$expected = [
			'index'  => 'noindex',
			'follow' => 'nofollow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the get_base_values function returns the right values when noindex and nofollow are false.
	 *
	 * @covers ::get_base_values
	 */
	public function test_get_base_values_false() {
		$indexable = new Indexable();

		$indexable->is_robots_nofollow = false;
		$indexable->is_robots_noindex  = false;

		$actual = $this->instance->get_base_values( $indexable );

		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
	/**
	 * Tests setting the robots to no index when having robots value already.
	 *
	 * @covers ::set_robots_no_index
	 */
	public function test_set_robots_no_index_with_having_a_noindex_value() {
		$presentation         = new Indexable_Presentation();
		$presentation->robots = [ 'index' => 'noindex', 'follow' => 'follow' ];

		$this->assertEquals(
			'noindex,follow',
			$this->instance->set_robots_no_index( 'noindex,follow', $presentation )
		);
	}

	/**
	 * Tests setting the robots to no index.
	 *
	 * @covers ::set_robots_no_index
	 */
	public function test_set_robots_no_index_with() {
		$presentation         = new Indexable_Presentation();
		$presentation->robots = [ 'index' => 'index', 'follow' => 'follow' ];

		$this->assertEquals(
			'index,follow',
			$this->instance->set_robots_no_index( 'index,follow', $presentation )
		);
	}
}
