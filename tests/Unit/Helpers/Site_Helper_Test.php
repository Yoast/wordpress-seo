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
final class Site_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Site_Helper
	 */
	protected $instance;

	/**
	 * Set up.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Site_Helper();
	}

	/**
	 * Tests retrieval of the site name.
	 *
	 * @covers ::get_site_name
	 *
	 * @return void
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

	/**
	 * Checks the result of is_multisite_and_switched.
	 *
	 * @covers ::is_multisite_and_switched
	 *
	 * @return void
	 */
	public function test_is_multisite_and_switched() {
		Monkey\Functions\stubs(
			[
				'is_multisite'   => true,
				'ms_is_switched' => true,
			]
		);

		self::assertTrue( $this->instance->is_multisite_and_switched() );
	}
}
