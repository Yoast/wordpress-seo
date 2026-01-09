<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Access_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository_Interface;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Tests the constructor of the Token_Manager class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager
 */
final class Token_Manager_Constructor_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor(): void {
			$this->assertInstanceOf(
				Access_Token_User_Meta_Repository_Interface::class,
				$this->getPropertyValue( $this->instance, 'access_token_repository' )
			);
			$this->assertInstanceOf(
				Code_Verifier_Handler::class,
				$this->getPropertyValue( $this->instance, 'code_verifier' )
			);
			$this->assertInstanceOf(
				Consent_Handler::class,
				$this->getPropertyValue( $this->instance, 'consent_handler' )
			);
			$this->assertInstanceOf(
				Refresh_Token_User_Meta_Repository_Interface::class,
				$this->getPropertyValue( $this->instance, 'refresh_token_repository' )
			);
			$this->assertInstanceOf(
				User_Helper::class,
				$this->getPropertyValue( $this->instance, 'user_helper' )
			);
			$this->assertInstanceOf(
				Request_Handler::class,
				$this->getPropertyValue( $this->instance, 'request_handler' )
			);
			$this->assertInstanceOf(
				Code_Verifier_User_Meta_Repository::class,
				$this->getPropertyValue( $this->instance, 'code_verifier_repository' )
			);
			$this->assertInstanceOf(
				WordPress_URLs::class,
				$this->getPropertyValue( $this->instance, 'urls' )
			);
	}
}
