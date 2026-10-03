<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Callback_Outcome value object.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome
 */
final class Callback_Outcome_Test extends TestCase {

	/**
	 * Tests the success outcome.
	 *
	 * @covers ::success
	 * @covers ::is_success
	 * @covers ::is_no_op
	 * @covers ::is_failure
	 * @covers ::get_error_phase
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_success() {
		$outcome = Callback_Outcome::success();

		$this->assertTrue( $outcome->is_success() );
		$this->assertFalse( $outcome->is_no_op() );
		$this->assertFalse( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_NONE, $outcome->get_error_phase() );
		$this->assertNull( $outcome->get_error_code() );
	}

	/**
	 * Tests the no-op outcome.
	 *
	 * @covers ::no_op
	 * @covers ::is_success
	 * @covers ::is_no_op
	 * @covers ::is_failure
	 *
	 * @return void
	 */
	public function test_no_op() {
		$outcome = Callback_Outcome::no_op();

		$this->assertFalse( $outcome->is_success() );
		$this->assertTrue( $outcome->is_no_op() );
		$this->assertFalse( $outcome->is_failure() );
	}

	/**
	 * Tests the provider-error outcome.
	 *
	 * @covers ::provider_error
	 * @covers ::is_failure
	 * @covers ::get_error_phase
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_provider_error() {
		$outcome = Callback_Outcome::provider_error( 'access_denied' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertFalse( $outcome->is_success() );
		$this->assertFalse( $outcome->is_no_op() );
		$this->assertSame( Callback_Outcome::PHASE_PROVIDER, $outcome->get_error_phase() );
		$this->assertSame( 'access_denied', $outcome->get_error_code() );
	}

	/**
	 * Tests the exchange-error outcome, including the code-less case.
	 *
	 * @covers ::exchange_error
	 * @covers ::is_failure
	 * @covers ::get_error_phase
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_exchange_error() {
		$with_code = Callback_Outcome::exchange_error( 'invalid_grant' );
		$this->assertTrue( $with_code->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_EXCHANGE, $with_code->get_error_phase() );
		$this->assertSame( 'invalid_grant', $with_code->get_error_code() );

		$without_code = Callback_Outcome::exchange_error( null );
		$this->assertTrue( $without_code->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_EXCHANGE, $without_code->get_error_phase() );
		$this->assertNull( $without_code->get_error_code() );
	}

	/**
	 * Tests an outcome survives a round-trip through array serialization.
	 *
	 * @covers ::to_array
	 * @covers ::from_array
	 *
	 * @dataProvider provide_round_trip_outcomes
	 *
	 * @param Callback_Outcome $outcome The outcome to round-trip.
	 *
	 * @return void
	 */
	public function test_array_round_trip( Callback_Outcome $outcome ) {
		$restored = Callback_Outcome::from_array( $outcome->to_array() );

		$this->assertSame( $outcome->is_success(), $restored->is_success() );
		$this->assertSame( $outcome->is_no_op(), $restored->is_no_op() );
		$this->assertSame( $outcome->is_failure(), $restored->is_failure() );
		$this->assertSame( $outcome->get_error_phase(), $restored->get_error_phase() );
		$this->assertSame( $outcome->get_error_code(), $restored->get_error_code() );
	}

	/**
	 * Provides outcomes for the array round-trip test.
	 *
	 * @return array<string, array{Callback_Outcome}>
	 */
	public static function provide_round_trip_outcomes(): array {
		return [
			'success'              => [ Callback_Outcome::success() ],
			'no_op'                => [ Callback_Outcome::no_op() ],
			'provider error'       => [ Callback_Outcome::provider_error( 'access_denied' ) ],
			'exchange error'       => [ Callback_Outcome::exchange_error( 'invalid_grant' ) ],
			'code-less exchange'   => [ Callback_Outcome::exchange_error( null ) ],
		];
	}
}
