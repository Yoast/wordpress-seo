<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Routes\Abstract_Indexation_Route_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Indexation_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Abstract_Indexation_Route
 *
 * @group routes
 * @group indexing
 */
final class Abstract_Indexation_Route_Test extends TestCase {

	/**
	 * Tests the respond with method.
	 *
	 * @covers ::respond_with
	 *
	 * @return void
	 */
	public function test_respond_with() {
		$options_helper = Mockery::mock( Options_Helper::class );
		$instance       = new Abstract_Indexation_Route_Mock( $options_helper );

		Mockery::mock( 'overload:' . WP_REST_Response::class );

		$this->assertInstanceOf( WP_REST_Response::class, $instance->respond_with( [], 'https://example.org/next/url' ) );
	}
}
