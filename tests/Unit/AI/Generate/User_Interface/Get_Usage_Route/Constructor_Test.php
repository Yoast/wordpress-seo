<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Get_Usage_Route;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;

/**
 * Tests the Get_Usage_Route's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route::__construct
 */
final class Constructor_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Token_Manager::class,
			$this->getPropertyValue( $this->instance, 'token_manager' )
		);

		$this->assertInstanceOf(
			Request_Handler::class,
			$this->getPropertyValue( $this->instance, 'request_handler' )
		);

		$this->assertInstanceOf(
			WPSEO_Addon_Manager::class,
			$this->getPropertyValue( $this->instance, 'addon_manager' )
		);
	}
}
