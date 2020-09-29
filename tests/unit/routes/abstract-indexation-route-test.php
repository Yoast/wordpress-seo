<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Routes\Abstract_Indexation_Route_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexation_Route_Test.
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
		$options_helper = Mockery::mock( Options_Helper::class );
		$instance       = new Abstract_Indexation_Route_Mock( $options_helper );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_Rest_Response', $instance->respond_with( [], 'https://example.org/next/url' ) );
	}
}
