<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\Available_Posts\Available_Posts_Repository;

/**
 * Test class for the constructor.
 *
 * @group available_posts_route
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Available_Posts_Route_Constructor_Test extends Abstract_Available_Posts_Route_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Available_Posts_Repository::class,
			$this->getPropertyValue( $this->instance, 'available_posts_repository' )
		);

		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
	}
}
