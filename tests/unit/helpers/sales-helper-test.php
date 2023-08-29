<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Helpers\Sales_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Time_Interval;
/**
 * Class Sales_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Sales_Helper
 */
class Sales_Helper_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Sales_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$interval = new Time_Interval( \time() - 10000, \time() + 10000 );
		$this->instance    = new Sales_Helper( [ "Test Sale" => $interval ] );
	}

	/**
	 * Tests the is function which tests if a date is inside the interval of the sale.
	 *
	 * @covers ::is
	 */
	public function test_is() {
		$this->assertTrue( $this->instance->is( "Test Sale" ) );
	}

	/**
	 * Tests the add_sale function which adds a sale to the list.
	 *
	 * @covers ::add_sale
	 */
	public function test_add_sale() {
		$interval = new Time_Interval( 1234, 5678 );
		$this->instance->add_sale( "Test Sale 2", $interval );
		$this->assertEquals( $interval->time_start, $this->instance->get_sales_list()["Test Sale 2"]->time_start );
		$this->assertEquals( $interval->time_end, $this->instance->get_sales_list()["Test Sale 2"]->time_end );

	}
}
