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
	protected function set_up() {
		parent::set_up();

		$this->instance = new Date_Helper();
	}

	/**
	 * Tests the formatting of the date.
	 *
	 * @dataProvider format_provider
	 * @covers       ::format
	 *
	 * @param string $date     The date to format.
	 * @param string $format   The format.
	 * @param string $expected The expected value.
	 */
	public function test_format( $date, $format, $expected ) {
		static::assertSame( $expected, $this->instance->format( $date, $format ) );
	}

	/**
	 * Provides data to the test_format.
	 *
	 * @return array The test data.
	 */
	public function format_provider() {
		return [
			'Test formatting the date, the default way' => [
				'date'     => '2020-12-31 13:37:00',
				'format'   => \DATE_W3C,
				'expected' => '2020-12-31T13:37:00+00:00',
			],
			'Test formatting the date to a timestamp' => [
				'date'     => '1973-11-29 21:33:09',
				'format'   => 'U',
				'expected' => '123456789',
			],
			'Test formatting the date with no given date' => [
				'date'     => '',
				'format'   => \DATE_W3C,
				'expected' => '',
			],
			'Test formatting the date with null as date' => [
				'date'     => null,
				'format'   => \DATE_W3C,
				'expected' => null,
			],
			'Test formatting the date with false as date' => [
				'date'     => false,
				'format'   => \DATE_W3C,
				'expected' => false,
			],
			'Test formatting the date with true as date' => [
				'date'     => true,
				'format'   => \DATE_W3C,
				'expected' => true,
			],
			'Test formatting the date with an integer as date' => [
				'date'     => 123456789,
				'format'   => \DATE_W3C,
				'expected' => 123456789,
			],
			'Test formatting the date with a string as date' => [
				'date'     => 'this is a date',
				'format'   => \DATE_W3C,
				'expected' => 'this is a date',
			],
			'Test formatting the date with date in wrong format being given' => [
				'date'     => '2020-12-31',
				'format'   => \DATE_W3C,
				'expected' => '2020-12-31',
			],
		];
	}

	/**
	 * Tests formatting of a timestamp.
	 *
	 * @dataProvider format_timestamp_provider
	 * @covers       ::format_timestamp
	 *
	 * @param string $timestamp The timestamp to format.
	 * @param string $format    The format.
	 * @param string $expected  The expected value.
	 */
	public function test_format_timestamp( $timestamp, $format, $expected ) {
		static::assertSame( $expected, $this->instance->format_timestamp( $timestamp, $format ) );
	}

	/**
	 * Provides data to the test_format.
	 *
	 * @return array The test data.
	 */
	public function format_timestamp_provider() {
		return [
			'Test formatting a date given as timestamp' => [
				'timestamp' => '1973-11-29 21:33:09',
				'format'    => \DATE_W3C,
				'expected'  => '1973-11-29 21:33:09',
			],
			'Test formatting an integer timestamp to a date' => [
				'timestamp' => 123456789,
				'format'    => \DATE_W3C,
				'expected'  => '1973-11-29T21:33:09+00:00',
			],
			'Test formatting a string timestamp to a date' => [
				'timestamp' => '123456789',
				'format'    => \DATE_W3C,
				'expected'  => '1973-11-29T21:33:09+00:00',
			],
			'Test formatting the date with null as timestamp' => [
				'date'     => null,
				'format'   => \DATE_W3C,
				'expected' => null,
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

		static::assertSame(
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
