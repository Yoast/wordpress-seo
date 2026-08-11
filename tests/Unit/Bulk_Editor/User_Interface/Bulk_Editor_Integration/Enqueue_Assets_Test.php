<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Actions;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests enqueuing the assets.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::enqueue_assets
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 */
final class Enqueue_Assets_Test extends Abstract_Test {

	/**
	 * Tests enqueuing the assets.
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		$this->stubEscapeFunctions();

		$content_types = [
			[
				'name'          => 'post',
				'label'         => 'Posts',
				'singularLabel' => 'Post',
			],
		];

		$expected_script_data = [
			'contentTypes'          => $content_types,
			'endpoints'             => [
				'posts' => 'https://example.com/wp-json/yoast/v1/bulk_editor/posts',
			],
			'links'                 => [
				'dashboard' => 'https://example.com/wp-admin/admin.php?page=wpseo_dashboard',
				'tools'     => 'https://example.com/wp-admin/admin.php?page=wpseo_tools',
			],
			'nonce'                 => 'rest-nonce',
			'restRoot'              => 'https://example.com/wp-json/',
			'preferences'           => [
				'isPremium'                 => false,
				'isPremiumVersionSupported' => false,
				'isAiEnabled'               => true,
				'isRtl'                     => false,
				'pluginUrl'                 => 'https://example.com/wp-content/plugins/wordpress-seo',
				'premiumUpdateUrl'          => 'https://example.com/wp-admin/update.php?action=upgrade-plugin&plugin=wordpress-seo-premium%2Fwp-seo-premium.php&_wpnonce=92ba59f0da',
			],
			'linkParams'            => [ 'foo' => 'bar' ],
			'analysis'              => [
				'contentLocale'         => 'en_US',
				'keywordAnalysisActive' => true,
			],
			'initialSelection'      => [
				'contentType'   => '',
				'postIds'       => [],
				'selectedCount' => 0,
			],
			'myyoastConnection'     => null,
			'optInNotificationSeen' => [
				'bulk_editor_tour' => false,
			],
		];

		Actions\expectRemoved( 'admin_print_scripts' )->once()->with( 'print_emoji_detection_script' );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( Bulk_Editor_Integration::ASSETS_NAME );
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( Bulk_Editor_Integration::ASSETS_NAME );

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_array' )->once()->andReturn(
			[ 'posts' => 'https://example.com/wp-json/yoast/v1/bulk_editor/posts' ],
		);

		$this->content_types_repository->expects( 'get_content_types' )->once()->andReturn( $content_types );
		$this->endpoints_repository->expects( 'get_all_endpoints' )->once()->andReturn( $endpoint_list );
		$this->nonce_repository->expects( 'get_rest_nonce' )->once()->andReturn( 'rest-nonce' );
		Functions\expect( 'rest_url' )->once()->withNoArgs()->andReturn( 'https://example.com/wp-json/' );
		$this->product_helper->expects( 'is_premium' )->once()->andReturn( false );
		Functions\expect( 'wp_nonce_url' )->once()->andReturn( 'https://example.com/wp-admin/update.php?action=upgrade-plugin&plugin=wordpress-seo-premium%2Fwp-seo-premium.php&_wpnonce=92ba59f0da' );
		Functions\expect( 'admin_url' )->once()->with( 'update.php?action=upgrade-plugin&plugin=wordpress-seo-premium%2Fwp-seo-premium.php' );
		$this->options_helper->expects( 'get' )->once()->with( 'enable_ai_generator' )->andReturn( true );
		$this->options_helper->expects( 'get' )->once()->with( 'keyword_analysis_active' )->andReturn( true );
		Functions\expect( 'is_rtl' )->once()->withNoArgs()->andReturn( false );
		Functions\expect( 'get_locale' )->once()->withNoArgs()->andReturn( 'en_US' );
		Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'https://example.com/wp-content/plugins/wordpress-seo' );
		Functions\expect( 'admin_url' )
			->twice()
			->andReturnUsing(
				static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
			);
		$this->short_link_helper->expects( 'get_query_params' )->once()->andReturn( [ 'foo' => 'bar' ] );
		$this->myyoast_connection_data_presenter->expects( 'present' )->once()->andReturnNull();
		$this->user_helper->expects( 'get_current_user_id' )->once()->andReturn( 1 );
		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( 1, '_yoast_wpseo_bulk_editor_tour_opt_in_notification_seen', true )
			->andReturn( '' );

		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with( Bulk_Editor_Integration::ASSETS_NAME, 'wpseoBulkEditorData', $expected_script_data );

		$this->instance->enqueue_assets();
	}
}
