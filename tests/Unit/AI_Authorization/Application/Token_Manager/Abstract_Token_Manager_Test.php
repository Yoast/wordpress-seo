<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Token_Manager;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Token_Manager tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Token_Manager_Test extends TestCase {

	/**
	 * The access token repository.
	 *
	 * @var Mockery\MockInterface|Access_Token_User_Meta_Repository_Interface
	 */
	protected $access_token_repository;

	/**
	 * The code verifier service.
	 *
	 * @var Mockery\MockInterface|Code_Verifier_Handler
	 */
	protected $code_verifier;

	/**
	 * The consent handler.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The refresh token repository mock.
	 *
	 * @var Mockery\MockInterface|Refresh_Token_User_Meta_Repository_Interface
	 */
	protected $refresh_token_repository;

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The code verifier repository mock.
	 *
	 * @var Mockery\MockInterface|Code_Verifier_User_Meta_Repository
	 */
	protected $code_verifier_repository;

	/**
	 * The URLs service mock.
	 *
	 * @var Mockery\MockInterface|WordPress_URLs
	 */
	protected $urls;

	/**
	 * The request handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The instance to test.
	 *
	 * @var Token_Manager
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->access_token_repository  = Mockery::mock( Access_Token_User_Meta_Repository_Interface::class );
		$this->code_verifier            = Mockery::mock( Code_Verifier_Handler::class );
		$this->consent_handler          = Mockery::mock( Consent_Handler::class );
		$this->refresh_token_repository = Mockery::mock( Refresh_Token_User_Meta_Repository_Interface::class );
		$this->user_helper              = Mockery::mock( User_Helper::class );
		$this->request_handler          = Mockery::mock( Request_Handler::class );
		$this->code_verifier_repository = Mockery::mock( Code_Verifier_User_Meta_Repository::class );
		$this->urls                     = Mockery::mock( WordPress_URLs::class );

		$this->instance = new Token_Manager( $this->access_token_repository, $this->code_verifier, $this->consent_handler, $this->refresh_token_repository, $this->user_helper, $this->request_handler, $this->code_verifier_repository, $this->urls );
	}
}
