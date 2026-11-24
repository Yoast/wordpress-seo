<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Social_Profiles_Helper;
use Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the enqueue_assets method of the First_Time_Configuration_Integration.
 *
 * @group integrations
 *
 * @covers \Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Integration::__construct
 * @covers \Yoast\WP\SEO\Integrations\Admin\First_Time_Configuration_Integration::enqueue_assets
 */
final class First_Time_Configuration_Integration_Test extends TestCase {

	/**
	 * The stored options the first-time configuration reads.
	 */
	private const OPTIONS = [
		'configuration_finished_steps' => [],
		'company_or_person'            => 'company',
		'company_name'                 => 'Example',
		'website_name'                 => 'Example site',
		'company_logo'                 => 'https://example.org/wp-content/uploads/company.png',
		'company_logo_id'              => 505,
		'person_logo'                  => 'https://example.org/wp-content/uploads/person.png',
		'person_logo_id'               => 12,
		'company_or_person_user_id'    => 1,
		'tracking'                     => false,
	];

	/**
	 * Resets the request data.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset( $_GET['page'] );

		parent::tear_down();
	}

	/**
	 * Tests that each logo is passed to the first-time configuration with its own ID.
	 *
	 * @return void
	 */
	public function test_enqueue_assets_passes_each_logo_with_its_own_id() {
		$_GET['page'] = 'wpseo_dashboard';

		$admin_asset_manager    = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$addon_manager          = Mockery::mock( WPSEO_Addon_Manager::class );
		$shortlinker            = Mockery::mock( WPSEO_Shortlinker::class );
		$options_helper         = Mockery::mock( Options_Helper::class );
		$social_profiles_helper = Mockery::mock( Social_Profiles_Helper::class );
		$product_helper         = Mockery::mock( Product_Helper::class );
		$indexable_helper       = Mockery::mock( Indexable_Helper::class );
		$indexing_helper        = Mockery::mock( Indexing_Helper::class );

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Monkey\Functions\stubs(
			[
				'is_network_admin' => false,
				'rest_url'         => 'https://example.org/wp-json/',
				'wp_create_nonce'  => 'nonce',
				'get_userdata'     => false,
				'current_user_can' => true,
				'is_main_site'     => true,
			],
		);

		Monkey\Functions\expect( 'YoastSEO' )->andReturn(
			(object) [
				'helpers' => (object) [
					'indexable' => $indexable_helper,
					'indexing'  => $indexing_helper,
				],
			],
		);

		$indexable_helper->expects( 'should_index_indexables' )->andReturn( true );
		$indexing_helper->expects( 'get_filtered_unindexed_count' )->andReturn( 0 );
		$indexing_helper->expects( 'is_initial_indexing' )->andReturn( false );

		$options_helper
			->allows( 'get' )
			->andReturnUsing(
				static function ( $key ) {
					return self::OPTIONS[ $key ];
				},
			);

		$social_profiles_helper->expects( 'get_organization_social_profiles' )->andReturn(
			[
				'facebook_site'     => '',
				'twitter_site'      => '',
				'other_social_urls' => [],
			],
		);

		$product_helper->allows( 'is_premium' )->andReturn( false );
		$addon_manager->allows( 'is_installed' )->andReturn( false );
		$shortlinker->allows( 'build_shortlink' )->andReturnArg( 0 );

		$admin_asset_manager->expects( 'enqueue_script' )->once()->with( 'indexation' );
		$admin_asset_manager->expects( 'enqueue_style' )->times( 3 );
		$admin_asset_manager->expects( 'localize_script' )->once()->with( 'indexation', 'yoastIndexingData', Mockery::type( 'array' ) );
		$admin_asset_manager
			->expects( 'localize_script' )
			->once()
			->with(
				'general-page',
				'wpseoFirstTimeConfigurationData',
				Mockery::on(
					static function ( $data ) {
						return $data['companyLogoId'] === 505 && $data['personLogoId'] === 12;
					},
				),
			);

		$instance = new First_Time_Configuration_Integration(
			$admin_asset_manager,
			$addon_manager,
			$shortlinker,
			$options_helper,
			$social_profiles_helper,
			$product_helper,
			Mockery::mock( Meta_Tags_Context::class ),
		);

		$instance->enqueue_assets();
	}
}
