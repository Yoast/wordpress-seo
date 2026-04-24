<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Http;

use Brain\Monkey\Functions;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Expiring_Store\Application\Expiring_Store;
use Yoast\WP\SEO\Expiring_Store\Domain\Key_Not_Found_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Handler;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\DPoP\DPoP_Proof_Exception;
use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the HTTP_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Http\HTTP_Client
 */
final class HTTP_Client_Test extends TestCase {

	/**
	 * The DPoP handler mock.
	 *
	 * @var DPoP_Handler|Mockery\MockInterface
	 */
	private $dpop_handler;

	/**
	 * The expiring store mock.
	 *
	 * @var Expiring_Store|Mockery\MockInterface
	 */
	private $expiring_store;

	/**
	 * The test instance.
	 *
	 * @var HTTP_Client
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->dpop_handler   = Mockery::mock( DPoP_Handler::class );
		$this->expiring_store = Mockery::mock( Expiring_Store::class );
		$this->instance       = new HTTP_Client( $this->dpop_handler, $this->expiring_store );
	}

	/**
	 * Tests that request() returns a parsed response on success.
	 *
	 * @covers ::request
	 * @covers ::parse_response
	 *
	 * @return void
	 */
	public function test_request_returns_parsed_response() {
		$this->expiring_store->expects( 'get' )->andThrow( new Key_Not_Found_Exception() );

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/api',
			],
		);
		Functions\expect( 'wp_remote_request' )->once()->andReturn( [ 'response' => [ 'code' => 200 ] ] );
		Functions\expect( 'wp_remote_retrieve_response_code' )->andReturn( 200 );
		Functions\expect( 'wp_remote_retrieve_headers' )->andReturn( [ 'content-type' => 'application/json' ] );
		Functions\expect( 'wp_remote_retrieve_body' )->andReturn( '{"key":"value"}' );
		Functions\expect( 'is_wp_error' )->andReturn( false );

		$result = $this->instance->request( 'GET', 'https://example.com/api' );

		$this->assertInstanceOf( HTTP_Response::class, $result );
		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( [ 'key' => 'value' ], $result->get_body() );
	}

	/**
	 * Tests that request() returns error array on WP_Error.
	 *
	 * @covers ::request
	 * @covers ::parse_response
	 *
	 * @return void
	 */
	public function test_request_returns_error_on_wp_error() {
		$this->expiring_store->expects( 'get' )->andThrow( new Key_Not_Found_Exception() );

		$wp_error = Mockery::mock( WP_Error::class );
		$wp_error->expects( 'get_error_message' )->twice()->andReturn( 'Connection failed' );

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/api',
			],
		);
		Functions\expect( 'wp_remote_request' )->andReturn( $wp_error );
		Functions\expect( 'is_wp_error' )->andReturn( true );

		$result = $this->instance->request( 'GET', 'https://example.com/api' );

		$this->assertSame( 0, $result->get_status() );
		$this->assertSame( 'network_error', $result->get_body_value( 'error' ) );
	}

	/**
	 * Tests that request() returns error array when DPoP proof generation fails.
	 *
	 * @covers ::request
	 *
	 * @return void
	 */
	public function test_request_returns_error_on_dpop_proof_failure() {
		$this->expiring_store->expects( 'get' )->andThrow( new Key_Not_Found_Exception() );

		$this->dpop_handler
			->expects( 'create_proof' )
			->andThrow( new DPoP_Proof_Exception( 'Key generation failed' ) );

		$this->dpop_handler->allows( 'handle_nonce_response' );

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/token',
			],
		);

		$result = $this->instance->request( 'POST', 'https://example.com/token', [ 'dpop' => true ] );

		$this->assertSame( 0, $result->get_status() );
		$this->assertSame( 'dpop_proof_failed', $result->get_body_value( 'error' ) );
		$this->assertStringContainsString( 'Key generation failed', (string) $result->get_body_value( 'error_description' ) );
	}

	/**
	 * Tests that request() retries once on use_dpop_nonce error when DPoP is active.
	 *
	 * @covers ::request
	 *
	 * @return void
	 */
	public function test_request_retries_on_dpop_nonce_error() {
		$this->expiring_store->expects( 'get' )->once()->andThrow( new Key_Not_Found_Exception() );

		$this->dpop_handler
			->expects( 'create_proof' )
			->twice()
			->andReturn( 'dpop-proof-jwt' );

		$this->dpop_handler
			->expects( 'handle_nonce_response' )
			->twice();

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/token',
			],
		);
		Functions\expect( 'wp_remote_request' )
			->twice()
			->andReturn(
				[ 'response' => [ 'code' => 400 ] ],
				[ 'response' => [ 'code' => 200 ] ],
			);

		Functions\expect( 'is_wp_error' )->andReturn( false );
		Functions\expect( 'wp_remote_retrieve_response_code' )->andReturn( 400, 200 );
		Functions\expect( 'wp_remote_retrieve_headers' )->andReturn(
			[ 'dpop-nonce' => 'new-nonce' ],
			[],
		);
		Functions\expect( 'wp_remote_retrieve_body' )->andReturn(
			'{"error":"use_dpop_nonce"}',
			'{"access_token":"tok"}',
		);

		$result = $this->instance->request(
			'POST',
			'https://example.com/token',
			[
				'headers' => [ 'Content-Type' => 'application/x-www-form-urlencoded' ],
				'body'    => [ 'grant_type' => 'client_credentials' ],
				'dpop'    => true,
			],
		);

		$this->assertSame( 200, $result->get_status() );
		$this->assertSame( 'tok', $result->get_body_value( 'access_token' ) );
	}

	/**
	 * Tests that request() returns cached 429 response when endpoint is rate limited.
	 *
	 * @covers ::request
	 *
	 * @return void
	 */
	public function test_request_returns_cached_429_when_rate_limited() {
		$stored_at = ( \time() - 30 );
		$this->expiring_store
			->expects( 'get' )
			->with( 'myyoast_rate_limit:example.com/api' )
			->andReturn(
				[
					'stored_at'       => $stored_at,
					'backoff_seconds' => 120,
					'status'          => 429,
					'headers'         => [ 'retry-after' => '120' ],
					'body'            => [ 'error' => 'rate_limited' ],
				],
			);

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/api',
			],
		);

		$result = $this->instance->request( 'GET', 'https://example.com/api' );

		$this->assertSame( 429, $result->get_status() );
		$this->assertSame( 'rate_limited', $result->get_body_value( 'error' ) );
		$this->assertEqualsWithDelta( 90, (int) ( $result->get_headers()['retry-after'] ?? 0 ), 2 );
	}

	/**
	 * Tests that a 429 response stores the full response for later replay.
	 *
	 * @covers ::request
	 * @covers ::parse_response
	 *
	 * @return void
	 */
	public function test_429_response_stores_response_with_retry_after() {
		$this->expiring_store->expects( 'get' )->andThrow( new Key_Not_Found_Exception() );
		$this->expiring_store
			->expects( 'persist' )
			->with(
				'myyoast_rate_limit:example.com/register',
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& isset( $value['stored_at'], $value['backoff_seconds'], $value['status'] )
							&& $value['backoff_seconds'] === 120
							&& $value['status'] === 429;
					},
				),
				120,
			)
			->once();

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/register',
			],
		);
		Functions\expect( 'wp_remote_request' )->andReturn( [ 'response' => [ 'code' => 429 ] ] );
		Functions\expect( 'is_wp_error' )->andReturn( false );
		Functions\expect( 'wp_remote_retrieve_response_code' )->andReturn( 429 );
		Functions\expect( 'wp_remote_retrieve_headers' )->andReturn( [ 'retry-after' => '120' ] );
		Functions\expect( 'wp_remote_retrieve_body' )->andReturn( '{"error":"rate_limited"}' );

		$result = $this->instance->request( 'POST', 'https://example.com/register' );

		$this->assertSame( 429, $result->get_status() );
	}

	/**
	 * Tests that a 429 response uses default backoff when Retry-After is absent.
	 *
	 * @covers ::request
	 * @covers ::parse_response
	 *
	 * @return void
	 */
	public function test_429_response_stores_default_backoff_without_retry_after() {
		$this->expiring_store->expects( 'get' )->andThrow( new Key_Not_Found_Exception() );
		$this->expiring_store
			->expects( 'persist' )
			->with(
				'myyoast_rate_limit:example.com/register',
				Mockery::on(
					static function ( $value ) {
						return \is_array( $value )
							&& $value['backoff_seconds'] === \MINUTE_IN_SECONDS;
					},
				),
				\MINUTE_IN_SECONDS,
			)
			->once();

		Functions\expect( 'wp_parse_url' )->andReturn(
			[
				'host' => 'example.com',
				'path' => '/register',
			],
		);
		Functions\expect( 'wp_remote_request' )->andReturn( [ 'response' => [ 'code' => 429 ] ] );
		Functions\expect( 'is_wp_error' )->andReturn( false );
		Functions\expect( 'wp_remote_retrieve_response_code' )->andReturn( 429 );
		Functions\expect( 'wp_remote_retrieve_headers' )->andReturn( [] );
		Functions\expect( 'wp_remote_retrieve_body' )->andReturn( '{"error":"rate_limited"}' );

		$result = $this->instance->request( 'POST', 'https://example.com/register' );

		$this->assertSame( 429, $result->get_status() );
	}
}
