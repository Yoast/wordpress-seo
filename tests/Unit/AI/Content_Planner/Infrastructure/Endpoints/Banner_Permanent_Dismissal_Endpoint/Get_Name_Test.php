<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint;

/**
 * Tests the Banner_Permanent_Dismissal_Endpoint get_name method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Endpoints\Banner_Permanent_Dismissal_Endpoint::get_name
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Name_Test extends Abstract_Banner_Permanent_Dismissal_Endpoint_Test {

	/**
	 * Tests the get_name method.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'bannerPermanentDismissal', $this->instance->get_name() );
	}
}
