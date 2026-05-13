<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Token_Auth_Strategy;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Bad_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for Token_Auth_Strategy.
 *
 * @group ai-authentication
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy
 */
final class Token_Auth_Strategy_Test extends TestCase {

	/**
	 * The token manager mock.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	private $token_manager;

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The WP user.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The instance under test.
	 *
	 * @var Token_Auth_Strategy
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->token_manager = Mockery::mock( Token_Manager::class );
		$this->user_helper   = Mockery::mock( User_Helper::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->instance = new Token_Auth_Strategy( $this->token_manager, $this->user_helper );
	}

	/**
	 * Tests that decorate() attaches the Bearer header with the JWT from Token_Manager.
	 *
	 * @covers ::__construct
	 * @covers ::decorate
	 *
	 * @return void
	 */
	public function test_decorate_attaches_bearer_header(): void {
		$this->token_manager->expects( 'get_or_request_access_token' )->with( $this->user )->andReturn( 'jwt-token' );

		$decorated = $this->instance->decorate( new Request( '/openai/suggestions/seo-title' ), $this->user );

		$this->assertSame( 'Bearer jwt-token', ( $decorated->get_headers()['Authorization'] ?? null ) );
	}

	/**
	 * On the first 401, on_failure deletes both stored JWTs and returns true.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_deletes_jwts_on_first_401(): void {
		$this->user_helper->expects( 'delete_meta' )->with( $this->user->ID, '_yoast_wpseo_ai_generator_access_jwt' )->once();
		$this->user_helper->expects( 'delete_meta' )->with( $this->user->ID, '_yoast_wpseo_ai_generator_refresh_jwt' )->once();

		$retry = $this->instance->on_failure( new Request( '/x' ), $this->user, new Unauthorized_Exception( '401', 401 ), 1 );

		$this->assertTrue( $retry );
	}

	/**
	 * On a second 401 (attempt > 1), on_failure gives up without touching meta.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_returns_false_on_second_401(): void {
		$this->user_helper->shouldNotReceive( 'delete_meta' );

		$retry = $this->instance->on_failure( new Request( '/x' ), $this->user, new Unauthorized_Exception( '401', 401 ), 2 );

		$this->assertFalse( $retry );
	}

	/**
	 * Non-401 exceptions are not recoverable for the Token strategy.
	 *
	 * @covers ::on_failure
	 *
	 * @return void
	 */
	public function test_on_failure_returns_false_for_non_unauthorized(): void {
		$this->user_helper->shouldNotReceive( 'delete_meta' );

		$retry = $this->instance->on_failure( new Request( '/x' ), $this->user, new Bad_Request_Exception( '400', 400 ), 1 );

		$this->assertFalse( $retry );
	}
}
