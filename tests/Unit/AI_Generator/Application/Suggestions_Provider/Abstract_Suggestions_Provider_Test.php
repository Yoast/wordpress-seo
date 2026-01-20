<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Application\Suggestions_Provider;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Suggestions_Provider tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Suggestions_Provider_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Suggestions_Provider
	 */
	protected $instance;

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The request handler instance.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The token manager instance.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * The options helper instance.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->consent_handler = Mockery::mock( Consent_Handler::class );
		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->token_manager   = Mockery::mock( Token_Manager::class );
		$this->user_helper     = Mockery::mock( User_Helper::class );

		$this->instance = new Suggestions_Provider(
			$this->consent_handler,
			$this->request_handler,
			$this->token_manager,
			$this->user_helper
		);
	}
}
