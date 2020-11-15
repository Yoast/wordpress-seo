<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Site_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Site_Helper
 */
class Site_Helper_Test extends TestCase {

	/**
	 * Tests retrieval of the site name.
	 *
	 * @covers ::get_site_name
	 */
	public function test_get_site_name() {
		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->with( 'name', true )
			->andReturn( 'name' );

		Monkey\Functions\expect( 'get_blog_info' )
			->with( 'name' )
			->andReturn( 'name' );

		$site_helper = new Site_Helper();

		$this->assertEquals( 'name', $site_helper->get_site_name() );
	}
}
