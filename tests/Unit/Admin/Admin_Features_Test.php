<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use Wincher_Dashboard_Widget;
use WPSEO_Admin;
use WPSEO_Primary_Term_Admin;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Dashboard_Widget;

/**
 * Class Admin_Features.
 *
 * @coversDefaultClass WPSEO_Admin
 */
final class Admin_Features_Test extends TestCase {

	/**
	 * Sets up the YoastSEO function with the right expectations.
	 *
	 * @return void
	 */
	private function setup_yoastseo_with_expectations() {
		$this->stubTranslationFunctions();

		$current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$current_page_helper->expects( 'is_yoast_seo_page' )->once()->andReturn( true );

		$url_helper = Mockery::mock( Url_Helper::class );
		$url_helper->expects( 'is_plugin_network_active' )->twice()->andReturn( false );

		$container = $this->create_container_with(
			[
				Current_Page_Helper::class => $current_page_helper,
				Url_Helper::class          => $url_helper,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->times( 3 )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		Monkey\Functions\expect( 'get_user_locale' )
			->andReturn( 'en_US' );
	}

	/**
	 * Test that admin_features returns the correct array when we're editing/creating a post.
	 *
	 * @covers ::get_admin_features
	 *
	 * @return void
	 */
	public function test_get_admin_features_ON_post_edit() {
		global $pagenow;
		$pagenow = 'post.php';

		$this->setup_yoastseo_with_expectations();

		$class_instance = new WPSEO_Admin();

		$admin_features = [
			'primary_category'         => new WPSEO_Primary_Term_Admin(),
			'dashboard_widget'         => new Yoast_Dashboard_Widget(),
			'wincher_dashboard_widget' => new Wincher_Dashboard_Widget(),
		];

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}

	/**
	 * When we're not on a post edit page, the primary category should not be added to the array.
	 *
	 * @covers ::get_admin_features
	 *
	 * @return void
	 */
	public function test_get_admin_features_NOT_ON_post_edit() {
		global $pagenow;
		$pagenow = 'index.php';

		$this->setup_yoastseo_with_expectations();

		$class_instance = new WPSEO_Admin();

		$admin_features = [
			'dashboard_widget'         => new Yoast_Dashboard_Widget(),
			'wincher_dashboard_widget' => new Wincher_Dashboard_Widget(),
		];

		$this->assertEquals( $admin_features, $class_instance->get_admin_features() );
	}
}
