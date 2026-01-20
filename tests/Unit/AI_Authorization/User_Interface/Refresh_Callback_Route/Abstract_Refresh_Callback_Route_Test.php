<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\User_Interface\Refresh_Callback_Route;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\User_Interface\Refresh_Callback_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Refresh_Callback_Route tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Refresh_Callback_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Callback_Route
	 */
	protected $instance;

	/**
	 * The access token repository instance.
	 *
	 * @var Mockery\MockInterface|Access_Token_User_Meta_Repository_Interface
	 */
	protected $access_token_repository;

	/**
	 * The refresh token repository instance.
	 *
	 * @var Mockery\MockInterface|Refresh_Token_User_Meta_Repository_Interface
	 */
	protected $refresh_token_repository;

	/**
	 * The code verifier instance.
	 *
	 * @var Mockery\MockInterface|Code_Verifier_User_Meta_Repository_Interface
	 */
	protected $code_verifier_repository;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->access_token_repository  = Mockery::mock( Access_Token_User_Meta_Repository_Interface::class );
		$this->refresh_token_repository = Mockery::mock( Refresh_Token_User_Meta_Repository_Interface::class );
		$this->code_verifier_repository = Mockery::mock( Code_Verifier_User_Meta_Repository_Interface::class );

		$this->instance = new Refresh_Callback_Route(
			$this->access_token_repository,
			$this->refresh_token_repository,
			$this->code_verifier_repository
		);
	}
}
