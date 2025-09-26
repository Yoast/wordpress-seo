<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\User_Interface\Callback_Route;

use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository_Interface;

/**
 * Tests the Abstract_Callback_Route's construct method.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\User_Interface\Abstract_Callback_Route::__construct
 */
final class Constructor_Test extends Abstract_Callback_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Access_Token_User_Meta_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'access_token_repository' )
		);

		$this->assertInstanceOf(
			Refresh_Token_User_Meta_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'refresh_token_repository' )
		);

		$this->assertInstanceOf(
			Code_Verifier_User_Meta_Repository_Interface::class,
			$this->getPropertyValue( $this->instance, 'code_verifier_repository' )
		);
	}
}
