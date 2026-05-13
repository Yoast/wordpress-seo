<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Auth_Strategy_Factory;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract base for Auth_Strategy_Factory tests.
 *
 * @group ai-authentication
 */
abstract class Abstract_Auth_Strategy_Factory_Test extends TestCase {

	/**
	 * The MyYoast connection conditional mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Connection_Conditional
	 */
	protected $myyoast_connection_conditional;

	/**
	 * The MyYoast client mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Client
	 */
	protected $myyoast_client;

	/**
	 * The OAuth strategy mock.
	 *
	 * @var Mockery\MockInterface|OAuth_Auth_Strategy
	 */
	protected $oauth_strategy;

	/**
	 * The Token strategy mock.
	 *
	 * @var Mockery\MockInterface|Token_Auth_Strategy
	 */
	protected $token_strategy;

	/**
	 * The WP user passed into create().
	 *
	 * @var WP_User
	 */
	protected $user;

	/**
	 * The instance under test.
	 *
	 * @var Auth_Strategy_Factory
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->myyoast_connection_conditional = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->myyoast_client                 = Mockery::mock( MyYoast_Client::class );
		$this->oauth_strategy                 = Mockery::mock( OAuth_Auth_Strategy::class );
		$this->token_strategy                 = Mockery::mock( Token_Auth_Strategy::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->instance = new Auth_Strategy_Factory(
			$this->myyoast_connection_conditional,
			$this->myyoast_client,
			$this->oauth_strategy,
			$this->token_strategy,
		);
	}
}
