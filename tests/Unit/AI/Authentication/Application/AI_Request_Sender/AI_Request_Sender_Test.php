<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\AI_Request_Sender;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Interface;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Loop_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for AI_Request_Sender.
 *
 * @group ai-authentication
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender
 */
final class AI_Request_Sender_Test extends TestCase {

	/**
	 * The request handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	private $request_handler;

	/**
	 * The primary strategy mock.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	private $primary;

	/**
	 * The fallback strategy mock.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	private $fallback;

	/**
	 * The WP user.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The base request fed into send().
	 *
	 * @var Request
	 */
	private $request;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->primary         = Mockery::mock( Auth_Strategy_Interface::class );
		$this->fallback        = Mockery::mock( Auth_Strategy_Interface::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;
		$this->request  = new Request( '/openai/suggestions/seo-title' );
	}

	/**
	 * Happy path: primary's decorated request is dispatched and the response is returned.
	 *
	 * @covers ::__construct
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_returns_response_from_primary_decoration(): void {
		$decorated = new Request( '/openai/suggestions/seo-title', [], [ 'Authorization' => 'DPoP X' ] );
		$response  = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'decorate' )->with( $this->request, $this->user )->andReturn( $decorated );
		$this->request_handler->expects( 'handle' )->with( $decorated )->andReturn( $response );
		$this->primary->shouldNotReceive( 'on_failure' );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary );

		$this->assertSame( $response, $sender->send( $this->request, $this->user ) );
	}

	/**
	 * When on_failure returns true, the sender re-decorates and retries; second attempt succeeds.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_retries_when_on_failure_returns_true(): void {
		$response = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'decorate' )->twice()->andReturn( $this->request );
		$this->request_handler->expects( 'handle' )->twice()->andReturnUsing(
			static function () use ( $response ) {
				static $call = 0;
				++$call;
				if ( $call === 1 ) {
					throw new Unauthorized_Exception( 'first', 401 );
				}
				return $response;
			},
		);
		$this->primary->expects( 'on_failure' )->with( $this->request, $this->user, Mockery::type( Unauthorized_Exception::class ), 1 )->andReturn( true );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary );

		$this->assertSame( $response, $sender->send( $this->request, $this->user ) );
	}

	/**
	 * When on_failure returns false and a fallback exists, the sender dispatches via the fallback.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_falls_back_when_primary_gives_up(): void {
		$fallback_decorated = new Request( '/openai/suggestions/seo-title', [], [ 'Authorization' => 'Bearer Y' ] );
		$fallback_response  = new Response( '{}', 200, 'OK' );

		$this->primary->expects( 'decorate' )->andReturn( $this->request );
		$this->request_handler->expects( 'handle' )->with( $this->request )->andThrow( new Unauthorized_Exception( 'oauth-failed', 401 ) );
		$this->primary->expects( 'on_failure' )->andReturn( false );

		$this->fallback->expects( 'decorate' )->with( $this->request, $this->user )->andReturn( $fallback_decorated );
		$this->request_handler->expects( 'handle' )->with( $fallback_decorated )->andReturn( $fallback_response );
		$this->fallback->shouldNotReceive( 'on_failure' );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary, $this->fallback );

		$this->assertSame( $fallback_response, $sender->send( $this->request, $this->user ) );
	}

	/**
	 * When on_failure returns false and no fallback is configured, the exception propagates.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_rethrows_when_no_fallback(): void {
		$this->primary->expects( 'decorate' )->andReturn( $this->request );
		$this->request_handler->expects( 'handle' )->andThrow( new Unauthorized_Exception( 'no-recovery', 401 ) );
		$this->primary->expects( 'on_failure' )->andReturn( false );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary );

		$this->expectException( Unauthorized_Exception::class );
		$sender->send( $this->request, $this->user );
	}

	/**
	 * Insufficient_Scope_Exception thrown from on_failure propagates without invoking the fallback.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_propagates_insufficient_scope_without_fallback(): void {
		$this->primary->expects( 'decorate' )->andReturn( $this->request );
		$this->request_handler->expects( 'handle' )->andThrow( new Unauthorized_Exception( 'wrong-scope', 403 ) );
		$this->primary->expects( 'on_failure' )->andThrow( new Insufficient_Scope_Exception( 'INSUFFICIENT_SCOPE', 403, 'INSUFFICIENT_SCOPE' ) );

		$this->fallback->shouldNotReceive( 'decorate' );
		$this->fallback->shouldNotReceive( 'on_failure' );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary, $this->fallback );

		$this->expectException( Insufficient_Scope_Exception::class );
		$sender->send( $this->request, $this->user );
	}

	/**
	 * If a strategy keeps returning true past MAX_ATTEMPTS, the sender bails with the typed
	 * Auth_Strategy_Loop_Exception rather than looping forever or falling back. The fallback is
	 * intentionally not invoked: a runaway strategy should surface as a programmer-error sentinel.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_bails_when_strategy_loops_past_max_attempts(): void {
		$this->primary->shouldReceive( 'decorate' )->andReturn( $this->request );
		$this->request_handler->shouldReceive( 'handle' )->andThrow( new Unauthorized_Exception( 'stuck', 401 ) );
		$this->primary->shouldReceive( 'on_failure' )->andReturn( true );
		$this->fallback->shouldNotReceive( 'decorate' );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary, $this->fallback );

		$this->expectException( Auth_Strategy_Loop_Exception::class );
		$sender->send( $this->request, $this->user );
	}

	/**
	 * OAuth_Forbidden_Exception thrown from on_failure propagates without invoking the fallback.
	 * Mirrors the Insufficient_Scope_Exception behaviour for the broader "OAuth-side 4xx" case.
	 *
	 * @covers ::send
	 *
	 * @return void
	 */
	public function test_send_propagates_oauth_forbidden_without_fallback(): void {
		$this->primary->expects( 'decorate' )->andReturn( $this->request );
		$this->request_handler->expects( 'handle' )->andThrow( new Forbidden_Exception( 'policy', 403 ) );
		$this->primary->expects( 'on_failure' )->andThrow( new OAuth_Forbidden_Exception( 'policy', 403, 'policy' ) );

		$this->fallback->shouldNotReceive( 'decorate' );
		$this->fallback->shouldNotReceive( 'on_failure' );

		$sender = new AI_Request_Sender( $this->request_handler, $this->primary, $this->fallback );

		$this->expectException( OAuth_Forbidden_Exception::class );
		$sender->send( $this->request, $this->user );
	}
}
