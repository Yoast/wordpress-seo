<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Mockery;
use Mockery\MockInterface;
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
 * Class Abstract_Token_Manager_Test.
 *
 * @group AI_Authorization
 */
abstract class Abstract_Token_Manager_Test extends TestCase {

	/**
	 * The access token repository.
	 *
	 * @var MockInterface|Access_Token_User_Meta_Repository_Interface
	 */
	protected $access_token_repository;

	/**
	 * The code verifier handler.
	 *
	 * @var MockInterface|Code_Verifier_Handler
	 */
	protected $code_verifier;

	/**
	 * The consent handler.
	 *
	 * @var MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The refresh token repository.
	 *
	 * @var MockInterface|Refresh_Token_User_Meta_Repository_Interface
	 */
	protected $refresh_token_repository;

	/**
	 * The user helper.
	 *
	 * @var MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The request handler.
	 *
	 * @var MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The code verifier repository.
	 *
	 * @var MockInterface|Code_Verifier_User_Meta_Repository
	 */
	protected $code_verifier_repository;

	/**
	 * The WordPress URLs handler.
	 *
	 * @var MockInterface|WordPress_URLs
	 */
	protected $urls;

	/**
	 * Represents the class to test.
	 *
	 * @var Token_Manager
	 */
	protected $instance;

	/**
	 * Sets up the tess.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->access_token_repository  = Mockery::Mock( Access_Token_User_Meta_Repository_Interface::class );
		$this->code_verifier            = Mockery::Mock( Code_Verifier_Handler::class );
		$this->consent_handler          = Mockery::Mock( Consent_Handler::class );
		$this->refresh_token_repository = Mockery::Mock( Refresh_Token_User_Meta_Repository_Interface::class );
		$this->user_helper              = Mockery::Mock( User_Helper::class );
		$this->request_handler          = Mockery::Mock( Request_Handler::class );
		$this->code_verifier_repository = Mockery::Mock( Code_Verifier_User_Meta_Repository::class );
		$this->urls                     = Mockery::Mock( WordPress_URLs::class );

		$this->instance = new Token_Manager(
			$this->access_token_repository,
			$this->code_verifier,
			$this->consent_handler,
			$this->refresh_token_repository,
			$this->user_helper,
			$this->request_handler,
			$this->code_verifier_repository,
			$this->urls
		);
	}
}
