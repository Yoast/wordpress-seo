<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Rate_Limited_Exception class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Rate_Limited_Exception
 */
final class Rate_Limited_Exception_Test extends TestCase {

	/**
	 * Tests that it extends Registration_Failed_Exception so existing catch
	 * sites keep working.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_extends_registration_failed_exception() {
		$exception = new Rate_Limited_Exception( 'Slow down.' );

		$this->assertInstanceOf( Registration_Failed_Exception::class, $exception );
		$this->assertSame( 'Slow down.', $exception->getMessage() );
	}

	/**
	 * Tests that the retry-after value defaults to null when not provided.
	 *
	 * @covers ::get_retry_after_seconds
	 *
	 * @return void
	 */
	public function test_retry_after_seconds_defaults_to_null() {
		$exception = new Rate_Limited_Exception( 'Slow down.' );

		$this->assertNull( $exception->get_retry_after_seconds() );
	}

	/**
	 * Tests that the retry-after value is exposed when provided.
	 *
	 * @covers ::__construct
	 * @covers ::get_retry_after_seconds
	 *
	 * @return void
	 */
	public function test_retry_after_seconds_is_exposed() {
		$exception = new Rate_Limited_Exception( 'Slow down.', 120 );

		$this->assertSame( 120, $exception->get_retry_after_seconds() );
	}

	/**
	 * Tests parse_retry_after on the delta-seconds form.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_seconds_form() {
		$this->assertSame( 120, Rate_Limited_Exception::parse_retry_after( '120' ) );
		$this->assertSame( 30, Rate_Limited_Exception::parse_retry_after( 30 ) );
		$this->assertSame( 0, Rate_Limited_Exception::parse_retry_after( '0' ) );
	}

	/**
	 * Tests that a negative seconds value is clamped to zero.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_clamps_negative_to_zero() {
		$this->assertSame( 0, Rate_Limited_Exception::parse_retry_after( '-5' ) );
	}

	/**
	 * Tests parse_retry_after on the HTTP-date form.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_http_date_form() {
		$future_seconds = 300;
		$date           = \gmdate( 'D, d M Y H:i:s', ( \time() + $future_seconds ) ) . ' GMT';

		$parsed = Rate_Limited_Exception::parse_retry_after( $date );

		// Allow a small jitter since `time()` is called twice (once here, once in the parser).
		$this->assertNotNull( $parsed );
		$this->assertGreaterThanOrEqual( ( $future_seconds - 5 ), $parsed );
		$this->assertLessThanOrEqual( ( $future_seconds + 5 ), $parsed );
	}

	/**
	 * Tests that a past HTTP-date is clamped to zero rather than going negative.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_past_date_clamps_to_zero() {
		$past_date = \gmdate( 'D, d M Y H:i:s', ( \time() - 3600 ) ) . ' GMT';

		$this->assertSame( 0, Rate_Limited_Exception::parse_retry_after( $past_date ) );
	}

	/**
	 * Tests that null / empty / garbage Retry-After values return null.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_returns_null_when_unparseable() {
		$this->assertNull( Rate_Limited_Exception::parse_retry_after( null ) );
		$this->assertNull( Rate_Limited_Exception::parse_retry_after( '' ) );
		$this->assertNull( Rate_Limited_Exception::parse_retry_after( 'not a date' ) );
	}

	/**
	 * Tests that a list-valued header (e.g. from wp_remote_*) is unwrapped.
	 *
	 * @covers ::parse_retry_after
	 *
	 * @return void
	 */
	public function test_parse_retry_after_unwraps_list_header() {
		$this->assertSame( 60, Rate_Limited_Exception::parse_retry_after( [ '60', '120' ] ) );
	}
}
