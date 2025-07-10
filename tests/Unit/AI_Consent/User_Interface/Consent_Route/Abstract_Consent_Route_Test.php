<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\Consent_Route;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Consent_Route tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Route_Test extends TestCase {

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The token manager instance.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * The instance to test.
	 *
	 * @var Consent_Route
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->consent_handler = Mockery::mock( Consent_Handler::class );
		$this->token_manager   = Mockery::mock( Token_Manager::class );

		$this->instance = new Consent_Route( $this->consent_handler, $this->token_manager );
	}
}
