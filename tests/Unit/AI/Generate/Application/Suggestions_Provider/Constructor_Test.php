<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\Application\Suggestions_Provider;

use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Tests the Suggestions_Provider constructor.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generate\Application\Suggestions_Provider::__construct
 */
final class Constructor_Test extends Abstract_Suggestions_Provider_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Consent_Handler::class,
			$this->getPropertyValue( $this->instance, 'consent_handler' )
		);

		$this->assertInstanceOf(
			Request_Handler::class,
			$this->getPropertyValue( $this->instance, 'request_handler' )
		);

		$this->assertInstanceOf(
			Token_Manager::class,
			$this->getPropertyValue( $this->instance, 'token_manager' )
		);

		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}
}
