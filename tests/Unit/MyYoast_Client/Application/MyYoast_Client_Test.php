<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Grant_Handler;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\OAuth_Server_Client_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Site_URL_Provider_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client
 */
final class MyYoast_Client_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Client
	 */
	private $instance;

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The token storage mock.
	 *
	 * @var Token_Storage_Interface|Mockery\MockInterface
	 */
	private $token_storage;

	/**
	 * The OAuth grant handler mock.
	 *
	 * @var OAuth_Grant_Handler|Mockery\MockInterface
	 */
	private $grant_handler;

	/**
	 * The HTTP client mock.
	 *
	 * @var OAuth_Server_Client_Interface|Mockery\MockInterface
	 */
	private $http_client;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );
		$this->token_storage       = Mockery::mock( Token_Storage_Interface::class );
		$this->grant_handler       = Mockery::mock( OAuth_Grant_Handler::class );
		$this->http_client         = Mockery::mock( OAuth_Server_Client_Interface::class );

		$site_url_provider = Mockery::mock( Site_URL_Provider_Interface::class );
		$site_url_provider->allows( 'get' )->andReturn( 'https://example.com/' );

		$this->instance = new MyYoast_Client(
			$this->client_registration,
			$this->grant_handler,
			$this->http_client,
			$this->token_storage,
			$site_url_provider,
		);
	}

	/**
	 * Tests that is_registered delegates to client_registration.
	 *
	 * @covers ::is_registered
	 *
	 * @return void
	 */
	public function test_is_registered() {
		$this->client_registration
			->expects( 'is_registered' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->is_registered() );
	}

	/**
	 * Tests that ensure_registered delegates to client_registration.
	 *
	 * @covers ::ensure_registered
	 *
	 * @return void
	 */
	public function test_ensure_registered_delegates() {
		$registered = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );

		$this->client_registration
			->expects( 'ensure_registered' )
			->once()
			->andReturn( $registered );

		$result = $this->instance->ensure_registered();

		$this->assertSame( 'cid', $result->get_client_id() );
	}

	/**
	 * Tests that get_site_token returns cached token when valid.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_returns_cached() {
		$cached = new Token_Set( 'cached-token', ( \time() + 3600 ) );

		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( $cached );

		$result = $this->instance->get_site_token();

		$this->assertSame( 'cached-token', $result->get_access_token() );
	}

	/**
	 * Tests that get_site_token requests a new token when cache is expired.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_requests_new_when_expired() {
		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( null );

		$fresh = new Token_Set( 'new-site-token', ( \time() + 900 ) );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->andReturn( $fresh );

		$this->token_storage
			->expects( 'store' )
			->once();

		$result = $this->instance->get_site_token();

		$this->assertSame( 'new-site-token', $result->get_access_token() );
	}

	/**
	 * Tests that get_site_token requests a new token when cached token lacks required scopes.
	 *
	 * @covers ::get_site_token
	 *
	 * @return void
	 */
	public function test_get_site_token_requests_new_when_scopes_missing() {
		$cached = new Token_Set( 'cached-token', ( \time() + 3600 ), 'DPoP', null, null, 'service:licenses:read' );

		$this->token_storage
			->expects( 'get' )
			->once()
			->andReturn( $cached );

		$fresh = new Token_Set( 'new-token', ( \time() + 900 ), 'DPoP', null, null, 'service:licenses:read service:subscriptions:read' );

		$this->grant_handler
			->expects( 'request_token' )
			->once()
			->andReturn( $fresh );

		$this->token_storage
			->expects( 'store' )
			->once();

		$result = $this->instance->get_site_token( [ 'service:subscriptions:read' ] );

		$this->assertSame( 'new-token', $result->get_access_token() );
	}

	/**
	 * Tests that authenticated_request delegates to the HTTP client.
	 *
	 * @covers ::authenticated_request
	 *
	 * @return void
	 */
	public function test_authenticated_request_delegates() {
		$token_set = new Token_Set( 'my-access-token', ( \time() + 3600 ), 'DPoP' );

		$this->http_client
			->expects( 'authenticated_request' )
			->with( 'GET', 'https://api.example.com/resource', 'my-access-token', 'DPoP', [] )
			->once()
			->andReturn(
				[
					'status'  => 200,
					'headers' => [],
					'body'    => [ 'data' => 'value' ],
				],
			);

		$result = $this->instance->authenticated_request( 'GET', 'https://api.example.com/resource', $token_set );

		$this->assertSame( 200, $result['status'] );
		$this->assertSame( [ 'data' => 'value' ], $result['body'] );
	}

	/**
	 * Tests that clear_site_token delegates to token_storage.
	 *
	 * @covers ::clear_site_token
	 *
	 * @return void
	 */
	public function test_clear_site_token() {
		$this->token_storage
			->expects( 'delete' )
			->once();

		$this->instance->clear_site_token();
	}
}
