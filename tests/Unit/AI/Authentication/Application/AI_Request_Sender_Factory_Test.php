<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Tests for AI_Request_Sender_Factory selection logic.
 *
 * @group ai-authentication
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory
 */
final class AI_Request_Sender_Factory_Test extends TestCase {

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

		$this->oauth_strategy = Mockery::mock( OAuth_Auth_Strategy::class );
		$this->token_strategy = Mockery::mock( Token_Auth_Strategy::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->instance = new AI_Request_Sender_Factory(
			$this->oauth_strategy,
			$this->token_strategy,
		);
	}

	/**
	 * Without a filter override: returns a sender with OAuth as primary and Token as fallback.
	 *
	 * @covers ::__construct
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_returns_oauth_with_token_fallback(): void {
		$sender = $this->instance->create( $this->user );

		$this->assertInstanceOf( AI_Request_Sender::class, $sender );
		$this->assertSame( $this->oauth_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * Filter pinning 'oauth' returns OAuth only, with no fallback.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_filter_can_pin_oauth(): void {
		Monkey\Filters\expectApplied( 'wpseo_ai_auth_method' )->andReturn( 'oauth' );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->oauth_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * Filter pinning 'token' returns Token only.
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_filter_can_pin_token(): void {
		Monkey\Filters\expectApplied( 'wpseo_ai_auth_method' )->andReturn( 'token' );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $this->token_strategy, $this->getPropertyValue( $sender, 'primary' ) );
		$this->assertNull( $this->getPropertyValue( $sender, 'fallback' ) );
	}

	/**
	 * The factory propagates its logger to the freshly-built sender, so the sender's fallback warning
	 * isn't silently dropped (the container's Logger_Aware_Pass doesn't reach non-registered services).
	 *
	 * @covers ::create
	 *
	 * @return void
	 */
	public function test_create_propagates_logger_to_sender(): void {
		// shouldIgnoreMissing(): the factory writes its own routing-decision debug logs we don't care about.
		$logger = Mockery::mock( LoggerInterface::class )->shouldIgnoreMissing();
		$this->instance->setLogger( $logger );

		$sender = $this->instance->create( $this->user );

		$this->assertSame( $logger, $this->getPropertyValue( $sender, 'logger' ) );
	}
}
