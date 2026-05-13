<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Token_Type;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Shared setup for OAuth_Auth_Strategy tests.
 *
 * @group ai-authentication
 */
abstract class Abstract_OAuth_Auth_Strategy_Test extends TestCase {

	/**
	 * The MyYoast OAuth client mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Client
	 */
	protected $myyoast_client;

	/**
	 * The AI API client mock.
	 *
	 * @var Mockery\MockInterface|API_Client
	 */
	protected $api_client;

	/**
	 * The WP user.
	 *
	 * @var WP_User
	 */
	protected $user;

	/**
	 * A site-level Token_Set returned by get_site_token() in the happy path.
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

		$this->myyoast_client = Mockery::mock( MyYoast_Client::class );
		$this->api_client     = Mockery::mock( API_Client::class );

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

		$this->instance = new OAuth_Auth_Strategy( $this->myyoast_client, $this->api_client );
	}
}
