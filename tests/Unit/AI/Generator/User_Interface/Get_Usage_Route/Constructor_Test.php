<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\Get_Usage_Route;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;

/**
 * Tests the Get_Usage_Route's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\Get_Usage_Route::__construct
 */
final class Constructor_Test extends Abstract_Get_Usage_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Auth_Strategy_Factory::class,
			$this->getPropertyValue( $this->instance, 'auth_strategy_factory' ),
		);

		$this->assertInstanceOf(
			WPSEO_Addon_Manager::class,
			$this->getPropertyValue( $this->instance, 'addon_manager' ),
		);
	}
}
