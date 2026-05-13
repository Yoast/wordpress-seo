<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\AI_Request_Sender_Factory;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for AI_Request_Sender_Factory selection logic.
 *
 * @group ai-authentication
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory
 */
final class AI_Request_Sender_Factory_Test extends TestCase {

	/**
	 * The request handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	private $request_handler;

	/**
	 * The MyYoast connection conditional mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Connection_Conditional
	 */
	private $conditional;

	/**
	 * The MyYoast client mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Client
	 */
	private $myyoast_client;

	/**
	 * The OAuth strategy mock.
	 *
	 * @var Mockery\MockInterface|OAuth_Auth_Strategy
	 */
	private $oauth_strategy;

	/**
	 * The Token strategy mock.
	 *
	 * @var Mockery\MockInterface|Token_Auth_Strategy
	 */
	private $token_strategy;

	/**
	 * The WP user.
	 *
	 * @var WP_User
	 */
	private $user;

	/**
	 * The instance under test.
	 *
	 * @var AI_Request_Sender_Factory
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->conditional     = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->myyoast_client  = Mockery::mock( MyYoast_Client::class );
		$this->oauth_strategy  = Mockery::mock( OAuth_Auth_Strategy::class );
		$this->token_strategy  = Mockery::mock( Token_Auth_Strategy::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->instance = new AI_Request_Sender_Factory(
			$this->request_handler,
			$this->conditional,
			$this->myyoast_client,
			$this->oauth_strategy,
			$this->token_strategy,
		);
	}

	/**
	 * Feature flag off: returns a sender with Token as primary, no fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_returns_token_only_sender_when_feature_flag_off(): void {
		$this->conditional->expects( 'is_met' )->andReturn( false );
		$this->myyoast_client->shouldNotReceive( 'is_registered' );

		$sender = $this->instance->create( $this->user );

		$this->assertInstanceOf( AI_Request_Sender::class, $sender );
		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * MyYoast client not registered: Token primary, no fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_returns_token_only_sender_when_not_registered(): void {
		$this->conditional->expects( 'is_met' )->andReturn( true );
		$this->myyoast_client->expects( 'is_registered' )->andReturn( false );
		$this->myyoast_client->shouldNotReceive( 'has_any_user_token' );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * No user has connected yet (site-wide flag is false): Token primary, no fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_returns_token_only_sender_when_no_user_token(): void {
		$this->conditional->expects( 'is_met' )->andReturn( true );
		$this->myyoast_client->expects( 'is_registered' )->andReturn( true );
		$this->myyoast_client->expects( 'has_any_user_token' )->andReturn( false );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * All gates pass: OAuth primary, Token fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_returns_oauth_with_token_fallback_when_all_gates_pass(): void {
		$this->conditional->expects( 'is_met' )->andReturn( true );
		$this->myyoast_client->expects( 'is_registered' )->andReturn( true );
		$this->myyoast_client->expects( 'has_any_user_token' )->andReturn( true );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->oauth_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * Filter pinning 'oauth' bypasses the other gates and returns OAuth + Token fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_filter_can_pin_oauth(): void {
		Monkey\Filters\expectApplied( 'wpseo_ai_auth_method' )->andReturn( 'oauth' );
		$this->conditional->shouldNotReceive( 'is_met' );
		$this->myyoast_client->shouldNotReceive( 'is_registered' );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->oauth_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * Filter pinning 'token' bypasses the other gates and returns Token only.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_filter_can_pin_token(): void {
		Monkey\Filters\expectApplied( 'wpseo_ai_auth_method' )->andReturn( 'token' );
		$this->conditional->shouldNotReceive( 'is_met' );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}
}
