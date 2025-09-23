<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Bust_Subscription_Cache_Route;

use WPSEO_Addon_Manager;

/**
 * Tests the Bust_Subscription_Cache_Route's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Bust_Subscription_Cache_Route::__construct
 */
final class Constructor_Test extends Abstract_Bust_Subscription_Cache_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Addon_Manager::class,
			$this->getPropertyValue( $this->instance, 'addon_manager' )
		);
	}
}
