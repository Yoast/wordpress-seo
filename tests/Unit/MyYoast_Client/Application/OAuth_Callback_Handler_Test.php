<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Exception;
use Mockery;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Authorization_Code_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Token_Request_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Tests the OAuth_Callback_Handler class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler
 */
final class OAuth_Callback_Handler_Test extends TestCase {

	private const OUTCOME_KEY = 'myyoast_oauth_callback_outcome';

	/**
	 * The MyYoast client mock.
	 *
	 * @var MyYoast_Client|Mockery\MockInterface
	 */
	private $myyoast_client;

	/**
	 * The authorization code handler mock.
	 *
	 * @var Authorization_Code_Handler|Mockery\MockInterface
	 */
	private $auth_code_handler;

	/**
	 * The expiring store mock.
	 *
	 * @var Expiring_Store|Mockery\MockInterface
	 */
	private $expiring_store;

	/**
	 * The instance under test.
	 *
	 * @var OAuth_Callback_Handler
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->myyoast_client    = Mockery::mock( MyYoast_Client::class );
		$this->auth_code_handler = Mockery::mock( Authorization_Code_Handler::class );
		$this->expiring_store    = Mockery::mock( Expiring_Store::class );

		$this->instance = new OAuth_Callback_Handler(
			$this->myyoast_client,
			$this->auth_code_handler,
			$this->expiring_store,
		);
	}

	/**
	 * Tests a provider `access_denied` error discards the flow state and reports the native code.
	 *
	 * @covers ::__construct
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_provider_access_denied() {
		$this->auth_code_handler->shouldReceive( 'discard_flow_state' )->once()->with( 7 );
		$this->myyoast_client->shouldNotReceive( 'exchange_authorization_code' );
		$this->expect_persist( 7 );

		$outcome = $this->instance->handle( 7, '', '', 'access_denied' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_PROVIDER, $outcome->get_error_phase() );
		$this->assertSame( 'access_denied', $outcome->get_error_code() );
	}

	/**
	 * Tests another provider error still discards the flow state and passes the native code through.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_provider_other_error() {
		$this->auth_code_handler->shouldReceive( 'discard_flow_state' )->once()->with( 7 );
		$this->expect_persist( 7 );

		$outcome = $this->instance->handle( 7, '', '', 'server_error' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_PROVIDER, $outcome->get_error_phase() );
		$this->assertSame( 'server_error', $outcome->get_error_code() );
	}

	/**
	 * Tests a missing code is treated as a no-op without exchanging or discarding.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_missing_code_is_no_op() {
		$this->auth_code_handler->shouldNotReceive( 'discard_flow_state' );
		$this->myyoast_client->shouldNotReceive( 'exchange_authorization_code' );
		$this->expiring_store->shouldNotReceive( 'persist_for_user' );

		$outcome = $this->instance->handle( 42, '', 'xyz', '' );

		$this->assertTrue( $outcome->is_no_op() );
		$this->assertFalse( $outcome->is_failure() );
	}

	/**
	 * Tests a missing state is treated as a no-op without exchanging or discarding.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_missing_state_is_no_op() {
		$this->auth_code_handler->shouldNotReceive( 'discard_flow_state' );
		$this->myyoast_client->shouldNotReceive( 'exchange_authorization_code' );
		$this->expiring_store->shouldNotReceive( 'persist_for_user' );

		$outcome = $this->instance->handle( 42, 'abc', '', '' );

		$this->assertTrue( $outcome->is_no_op() );
	}

	/**
	 * Tests a successful exchange reports success.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_success() {
		$this->myyoast_client->shouldReceive( 'exchange_authorization_code' )
			->once()
			->with( 42, 'abc', 'xyz' );
		$this->expect_persist( 42 );

		$outcome = $this->instance->handle( 42, 'abc', 'xyz', '' );

		$this->assertTrue( $outcome->is_success() );
		$this->assertFalse( $outcome->is_failure() );
		$this->assertNull( $outcome->get_error_code() );
	}

	/**
	 * Tests an `invalid_grant` token failure passes the native code through as an exchange error.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_invalid_grant_exchange_error() {
		$this->myyoast_client->shouldReceive( 'exchange_authorization_code' )
			->once()
			->andThrow( new Token_Request_Failed_Exception( 'invalid_grant', 'expired' ) );
		$this->expect_persist( 11 );

		$outcome = $this->instance->handle( 11, 'abc', 'xyz', '' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_EXCHANGE, $outcome->get_error_phase() );
		$this->assertSame( 'invalid_grant', $outcome->get_error_code() );
	}

	/**
	 * Tests another token failure passes its native code through as an exchange error.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_other_token_exchange_error() {
		$this->myyoast_client->shouldReceive( 'exchange_authorization_code' )
			->once()
			->andThrow( new Token_Request_Failed_Exception( 'invalid_request', 'state mismatch' ) );
		$this->expect_persist( 11 );

		$outcome = $this->instance->handle( 11, 'abc', 'xyz', '' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_EXCHANGE, $outcome->get_error_phase() );
		$this->assertSame( 'invalid_request', $outcome->get_error_code() );
	}

	/**
	 * Tests an unexpected exception is logged and reported as a code-less exchange error.
	 *
	 * @covers ::handle
	 *
	 * @return void
	 */
	public function test_handle_unexpected_exception_is_logged() {
		$this->myyoast_client->shouldReceive( 'exchange_authorization_code' )
			->once()
			->andThrow( new Exception( 'boom' ) );

		$logger = Mockery::mock( LoggerInterface::class );
		$logger->shouldReceive( 'error' )->once();
		$this->instance->setLogger( $logger );
		$this->expect_persist( 11 );

		$outcome = $this->instance->handle( 11, 'abc', 'xyz', '' );

		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_EXCHANGE, $outcome->get_error_phase() );
		$this->assertNull( $outcome->get_error_code() );
	}

	/**
	 * Tests consuming the outcome reads, deletes, and reconstructs it.
	 *
	 * @covers ::consume_outcome
	 *
	 * @return void
	 */
	public function test_consume_outcome_reads_and_deletes() {
		$stored = Callback_Outcome::provider_error( 'access_denied' )->to_array();

		$this->expiring_store->shouldReceive( 'get_for_user' )->once()->with( self::OUTCOME_KEY, 7 )->andReturn( $stored );
		$this->expiring_store->shouldReceive( 'delete_for_user' )->once()->with( self::OUTCOME_KEY, 7 );

		$outcome = $this->instance->consume_outcome( 7 );

		$this->assertInstanceOf( Callback_Outcome::class, $outcome );
		$this->assertTrue( $outcome->is_failure() );
		$this->assertSame( Callback_Outcome::PHASE_PROVIDER, $outcome->get_error_phase() );
		$this->assertSame( 'access_denied', $outcome->get_error_code() );
	}

	/**
	 * Tests consuming returns null and does not delete when nothing is stored.
	 *
	 * @covers ::consume_outcome
	 *
	 * @return void
	 */
	public function test_consume_outcome_returns_null_when_absent() {
		$this->expiring_store->shouldReceive( 'get_for_user' )
			->once()
			->with( self::OUTCOME_KEY, 7 )
			->andThrow( new Key_Not_Found_Exception() );
		$this->expiring_store->shouldNotReceive( 'delete_for_user' );

		$this->assertNull( $this->instance->consume_outcome( 7 ) );
	}

	/**
	 * Tests consuming is skipped for an invalid user id.
	 *
	 * @covers ::consume_outcome
	 *
	 * @return void
	 */
	public function test_consume_outcome_skips_invalid_user() {
		$this->expiring_store->shouldNotReceive( 'get_for_user' );

		$this->assertNull( $this->instance->consume_outcome( 0 ) );
	}

	/**
	 * Configures the expectation that the outcome is persisted once for a user.
	 *
	 * @param int $user_id The user id the outcome should be stored for.
	 *
	 * @return void
	 */
	private function expect_persist( int $user_id ): void {
		$this->expiring_store->shouldReceive( 'persist_for_user' )
			->once()
			->with( self::OUTCOME_KEY, Mockery::type( 'array' ), \MINUTE_IN_SECONDS, $user_id );
	}
}
