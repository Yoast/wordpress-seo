<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Integrations\Settings_Integration;
use Mockery;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Integrations\Admin\Social_Profiles_Helper;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;

/**
 * Class Settings_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Settings_Integration
 *
 * @group integrations
 */
class Settings_Integration_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Settings_Integration
	 */
	protected $instance;

	/**
	 * Runs the setup to prepare the needed instance
	 */
	public function set_up() {
		$asset_manager          = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$replace_vars           = Mockery::mock( WPSEO_Replace_Vars::class );
		$schema_types           = Mockery::mock( Schema_Types::class );
		$current_page_helper    = Mockery::mock( Current_Page_Helper::class );
		$post_type_helper       = Mockery::mock( Post_Type_Helper::class );
		$taxonomy_helper        = Mockery::mock( Taxonomy_Helper::class );
		$product_helper         = Mockery::mock( Product_Helper::class );
		$woocommerce_helper     = Mockery::mock( Woocommerce_Helper::class );
		$article_helper         = Mockery::mock( Article_Helper::class );
		$social_profiles_helper = Mockery::mock( Social_Profiles_Helper::class );

		$this->instance = new Settings_Integration(
			$asset_manager,
			$replace_vars,
			$schema_types,
			$current_page_helper,
			$post_type_helper,
			$taxonomy_helper,
			$product_helper,
			$woocommerce_helper,
			$article_helper,
			$social_profiles_helper
		);
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Settings_Conditional::class,
			],
			Settings_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the addition of a submenu page.
	 *
	 * @covers ::add_submenu_page
	 */
	public function test_add_submenu_page() {

		Monkey\Functions\expect( 'add_submenu_page' )
			->with( '', '', '', 'wpseo_manage_options', 'wpseo_settings_saved', Mockery::type( 'Closure' ) );

		$submenu_pages = [
			'array',
			'that',
			'should',
			'remain',
			'untouched',
		];

		$this->assertSame( $submenu_pages, $this->instance->add_settings_saved_page( $submenu_pages ) );
	}
}
