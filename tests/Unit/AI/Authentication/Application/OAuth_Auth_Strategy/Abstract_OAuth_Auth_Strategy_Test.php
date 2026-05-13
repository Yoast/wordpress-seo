<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract base for OAuth_Auth_Strategy tests.
 *
 * @group ai-authentication
 */
abstract class Abstract_OAuth_Auth_Strategy_Test extends TestCase {

	/**
	 * The MyYoast client mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Client
	 */
	protected $myyoast_client;

	/**
	 * The request handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The API client mock.
	 *
	 * @var Mockery\MockInterface|API_Client
	 */
	protected $api_client;

	/**
	 * The Token strategy mock used for runtime fallback.
	 *
	 * @var Mockery\MockInterface|Token_Auth_Strategy
	 */
	protected $token_strategy;

	/**
	 * The WP user the request is on behalf of.
	 *
	 * @var WP_User
	 */
	protected $user;

	/**
	 * The site-level token set the strategy receives.
	 *
	 * @var Token_Set
	 */
	protected $token_set;

	/**
	 * The instance under test.
	 *
	 * @var OAuth_Auth_Strategy
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->myyoast_client  = Mockery::mock( MyYoast_Client::class );
		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->api_client      = Mockery::mock( API_Client::class );
		$this->token_strategy  = Mockery::mock( Token_Auth_Strategy::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->token_set = new Token_Set( 'opaque-token', ( \time() + 3600 ), Auth_Token_Type::DPOP );

		$this->api_client->shouldReceive( 'get_url' )
			->andReturnUsing(
				static function ( string $path ): string {
					return 'https://ai.yoa.st/api/v1' . $path;
				},
			)
			->byDefault();

		$this->myyoast_client->shouldReceive( 'create_dpop_proof' )->andReturn( 'dpop.proof.jwt' )->byDefault();

		$this->instance = new OAuth_Auth_Strategy(
			$this->myyoast_client,
			$this->request_handler,
			$this->api_client,
			$this->token_strategy,
		);
	}
}
