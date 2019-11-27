<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\Free\Tests\Helpers
 */

namespace Yoast\WP\Free\Tests\Helpers;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Date_Helper
 *
 * @group helpers
 */
class Date_Helper_Test extends TestCase {

	/**
	 * The date helper instance.
	 *
	 * @var \WPSEO_Date_Helper
	 */
	protected $instance;

	/**
	 * Performs the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new \WPSEO_Date_Helper();
	}

	/**
	 * Test the datetime with a valid date string.
	 *
	 * @covers ::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_valid_datetime() {
		$this->assertTrue( $this->instance->is_valid_datetime( '2015-02-25T04:44:44+00:00' ) );
	}

	/**
	 * Test the datetime with an invalid date string.
	 *
	 * @covers ::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_invalid_datetime() {
		$this->assertFalse( $this->instance->is_valid_datetime( '-0001-11-30T00:00:00+00:00' ) );
	}
}
