<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Routes
 */

namespace Yoast\WP\SEO\Tests\Routes;

use Mockery;
use Yoast\WP\SEO\Tests\Doubles\Routes\Abstract_Indexation_Route_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Abstract_Indexation_Route_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Abstract_Indexation_Route
 *
 * @group routes
 * @group indexation
 */
class Abstract_Indexation_Route_Test extends TestCase {

	/**
	 * Tests the respond with method.
	 *
	 * @covers ::respond_with
	 */
	public function test_respond_with() {
		$instance = new Abstract_Indexation_Route_Mock();

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $instance->respond_with( [], 'https://example.org/next/url' ) );
	}
}
