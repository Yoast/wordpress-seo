<?php

namespace Yoast\WP\SEO\Tests\Unit\Promotions\Domain;

use Yoast\WP\SEO\Promotions\Domain\Time_Interval;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Time_Interval_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Promotions\Domain\Time_Interval
 */
final class Time_Interval_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Time_Interval
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$start_date     = \gmmktime( 11, 00, 00, 12, 23, 2021 );
		$end_date       = \gmmktime( 11, 00, 00, 12, 28, 2025 );
		$this->instance = new Time_Interval( $start_date, $end_date );
	}

	/**
	 * Tests setting the start date.
	 *
	 * @covers ::set_start_date
	 *
	 * @return void
	 */
	public function test_set_start_date() {
		$new_start_date = \gmmktime( 11, 00, 00, 12, 23, 2021 );

		$this->instance->set_start_date( $new_start_date );

		$this->assertEquals( $new_start_date, $this->instance->time_start );
	}

	/**
	 * Tests checking if a time is within the interval.
	 *
	 * @covers ::contains
	 *
	 * @return void
	 */
	public function test_contains() {
		$time = \gmmktime( 11, 00, 00, 12, 23, 2022 );

		$this->assertTrue( $this->instance->contains( $time ) );
	}

	/**
	 * Tests setting the end date.
	 *
	 * @covers ::set_end_date
	 *
	 * @return void
	 */
	public function test_set_end_date() {
		$new_end_date = \gmmktime( 11, 00, 00, 12, 23, 2026 );

		$this->instance->set_end_date( $new_end_date );

		$this->assertEquals( $new_end_date, $this->instance->time_end );
	}
}
