<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Routes
 */

namespace Yoast\WP\SEO\Tests\Routes;

use Yoast\WP\SEO\Routes\Route_Interface;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Indexation_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Route_Interface
 *
 * @group routes
 */
class Route_Interface_Test extends TestCase {

	/**
	 * Tests calling the register_routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		$interface = \Mockery::mock( Route_Interface::class );
		$interface
			->shouldReceive( 'register_routes' )
			->andReturnNull();

		$this->assertEmpty( $interface->register_routes() );
	}
}
