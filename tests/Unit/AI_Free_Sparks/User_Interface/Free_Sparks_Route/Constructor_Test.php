<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Free_Sparks\User_Interface\Free_Sparks_Route;

use Yoast\WP\SEO\AI_Free_Sparks\Application\Free_Sparks_Handler_Interface;

/**
 * Tests the Free_Sparks_Route's construct method.
 *
 * @group ai-free-sparks
 *
 * @covers \Yoast\WP\SEO\AI_Free_Sparks\User_Interface\Free_Sparks_Route::__construct
 */
final class Constructor_Test extends Abstract_Free_Sparks_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Free_Sparks_Handler_Interface::class,
			$this->getPropertyValue( $this->instance, 'free_sparks_handler' )
		);
	}
}
