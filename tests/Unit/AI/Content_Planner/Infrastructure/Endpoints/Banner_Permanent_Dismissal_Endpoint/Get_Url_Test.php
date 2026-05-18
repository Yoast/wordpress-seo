<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint;

use Brain\Monkey\Functions;

/**
 * Tests the Banner_Permanent_Dismissal_Endpoint get_url method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint::get_url
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Url_Test extends Abstract_Banner_Permanent_Dismissal_Endpoint_Test {

	/**
	 * Tests the get_url method.
	 *
	 * @return void
	 */
	public function test_get_url() {
		$url = 'yoast/v1/ai_content_planner/banner_permanent_dismissal';

		Functions\expect( 'rest_url' )
			->once()
			->with( $url )
			->andReturn( $url );

		$this->assertSame( $url, $this->instance->get_url() );
	}
}
