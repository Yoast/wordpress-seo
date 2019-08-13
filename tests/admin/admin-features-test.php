<?php

namespace Yoast\WP\Free\Tests\Admin;

use WPSEO_Admin;
use WPSEO_GSC;
use WPSEO_Primary_Term_Admin;
use Yoast_Dashboard_Widget;
use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Tests\Doubles\Shortlinker;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Admin_Features.
 *
 * @package Yoast\Tests\Admin
 *
 * @coversDefaultClass WPSEO_Admin
 * @covers <!public>
 */
class Admin_Features_Test extends TestCase {

	private function get_admin_with_expectations() {
		$shortlinker = new Shortlinker();

		Monkey\Functions\expect( 'add_query_arg' )
			->times( 4 )
			->with( $shortlinker->get_additional_shortlink_data(), Mockery::pattern( '/https:\/\/yoa.st\/*/' ) )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'admin_url' )
			->once()
			->with( '?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=upsell' )
			->andReturn( 'https://example.org' );

		return new WPSEO_Admin();
	}

	/**
	 * Test that admin_features returns the correct array when we're editing/creating a post.
	 *
	 * @covers ::get_admin_features
	 */
	public function test_get_admin_features_ON_post_edit() {
		global $pagenow;
		$pagenow = 'post.php';

		$class_instance = $this->get_admin_with_expectations();

		$admin_features = array(
			'google_search_console'  => new WPSEO_GSC(),
			'primary_category'       => new WPSEO_Primary_Term_Admin(),
			'dashboard_widget'       => new Yoast_Dashboard_Widget(),
		);

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}

	/**
	 * When we're not on a post edit page, the primary category should not be added to the array.
	 *
	 * @covers ::get_admin_features
	 */
	public function test_get_admin_features_NOT_ON_post_edit() {
		global $pagenow;
		$pagenow = 'index.php';

		$class_instance = $this->get_admin_with_expectations();

		$admin_features = array(
			'google_search_console' => new WPSEO_GSC(),
			'dashboard_widget'      => new Yoast_Dashboard_Widget(),
		);

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}

	/**
	 * @covers ::update_contactmethods
	 */
	public function test_update_contactmethods() {
		$class_instance = $this->get_admin_with_expectations();
		$result         = $class_instance->update_contactmethods( array() );
		\ksort( $result );

		$this->assertSame(
			array(
				'facebook'   => 'Facebook profile URL',
				'instagram'  => 'Instagram profile URL',
				'linkedin'   => 'LinkedIn profile URL',
				'myspace'    => 'MySpace profile URL',
				'pinterest'  => 'Pinterest profile URL',
				'soundcloud' => 'SoundCloud profile URL',
				'tumblr'     => 'Tumblr profile URL',
				'twitter'    => 'Twitter username (without @)',
				'wikipedia'  => 'Wikipedia page about you<br/><small>(if one exists)</small>',
				'youtube'    => 'YouTube profile URL',
			),
			$result
		);
	}
}
