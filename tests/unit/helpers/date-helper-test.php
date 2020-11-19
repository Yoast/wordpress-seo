<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Date_Helper
 *
 * @group helpers
 */
class Date_Helper_Test extends TestCase {

	/**
	 * The date helper instance.
	 *
	 * @var Date_Helper
	 */
	protected $instance;

	/**
	 * Performs the setup.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Date_Helper();
	}

	/**
	 * Tests the formatting of the date.
	 *
	 * @dataProvider format_provider
	 *
	 * @param string $date     The date to format.
	 * @param string $format   The format.
	 * @param string $expected The expected value.
	 * @param string $message  Message to show when test fails.
	 *
	 * @covers ::format
	 */
	public function test_format( $date, $format, $expected, $message ) {
		static::assertEquals( $expected, $this->instance->format( $date, $format ), $message );
	}

	/**
	 * Provides data to the test_format.
	 *
	 * @return array The test data.
	 */
	public function format_provider() {
		return [
			[
				'date'     => '2020-12-31 13:37:00',
				'format'   => \DATE_W3C,
				'expected' => '2020-12-31T13:37:00+00:00',
				'message'  => 'Test formatting the date, the default way',
			],
			[
				'date'     => '1973-11-29 21:33:09',
				'format'   => 'U',
				'expected' => 123456789,
				'message'  => 'Test formatting the date to a timestamp',
			],
			[
				'date'     => '',
				'format'   => \DATE_W3C,
				'expected' => '',
				'message'  => 'Test formatting the date with no given date',
			],
			[
				'date'     => null,
				'format'   => \DATE_W3C,
				'expected' => null,
				'message'  => 'Test formatting the date with null as date',
			],
			[
				'date'     => false,
				'format'   => \DATE_W3C,
				'expected' => false,
				'message'  => 'Test formatting the date with false as date',
			],
			[
				'date'     => true,
				'format'   => \DATE_W3C,
				'expected' => true,
				'message'  => 'Test formatting the date with true as date',
			],
			[
				'date'     => 'this is a date',
				'format'   => \DATE_W3C,
				'expected' => 'this is a date',
				'message'  => 'Test formatting the date with a string as date',
			],
			[
				'date'     => '2020-12-31',
				'format'   => \DATE_W3C,
				'expected' => '2020-12-31',
				'message'  => 'Test formatting the date with date in wrong format being given',
			],
		];
	}

	/**
	 * Tests formatting of a timestamp.
	 *
	 * @dataProvider format_timestamp_provider
	 *
	 * @param string $timestamp The timestamp to format.
	 * @param string $format    The format.
	 * @param string $expected  The expected value.
	 * @param string $message   Message to show when test fails.
	 *
	 * @covers ::format_timestamp
	 */
	public function test_format_timestamp( $timestamp, $format, $expected, $message ) {
		static::assertEquals( $expected, $this->instance->format_timestamp( $timestamp, $format ), $message );
	}

	/**
	 * Provides data to the test_format.
	 *
	 * @return array The test data.
	 */
	public function format_timestamp_provider() {
		return [
			[
				'timestamp' => '1973-11-29 21:33:09',
				'format'    => \DATE_W3C,
				'expected'  => '1973-11-29 21:33:09',
				'message'   => 'Test formatting a date given as timestamp',
			],
			[
				'timestamp' => 123456789,
				'format'    => \DATE_W3C,
				'expected'  => '1973-11-29T21:33:09+00:00',
				'message'   => 'Test formatting the timestamp to a date',
			],
			[
				'date'     => null,
				'format'   => \DATE_W3C,
				'expected' => null,
				'message'  => 'Test formatting the date with null as timestamp',
			],
		];
	}

	/**
	 * Tests to a translated format.
	 *
	 * @covers ::format_translated
	 */
	public function test_format_translated() {
		Monkey\Functions\expect( 'date_i18n' )
			->once()
			->with( \DATE_W3C, '1609421820' )
			->andReturn( '2020-12-31' );

		static::assertEquals(
			'2020-12-31',
			$this->instance->format_translated( '2020-12-31 13:37:00' )
		);
	}

	/**
	 * Test the datetime with a valid date string.
	 *
	 * @covers ::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_valid_datetime() {
		static::assertTrue( $this->instance->is_valid_datetime( '2015-02-25T04:44:44+00:00' ) );
	}

	/**
	 * Test the datetime with an invalid date string.
	 *
	 * @covers ::is_valid_datetime
	 */
	public function test_is_valid_datetime_WITH_invalid_datetime() {
		static::assertFalse( $this->instance->is_valid_datetime( '-0001-11-30T00:00:00+00:00' ) );
	}
}
