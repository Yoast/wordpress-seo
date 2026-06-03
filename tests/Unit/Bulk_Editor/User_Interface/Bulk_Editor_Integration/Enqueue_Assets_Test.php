<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Actions;
use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

/**
 * Tests enqueuing the assets.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::enqueue_assets
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 */
final class Enqueue_Assets_Test extends Abstract_Bulk_Editor_Integration_Test {

	/**
	 * Tests enqueuing the assets.
	 *
	 * @return void
	 */
	public function test_enqueue_assets() {
		$this->stubEscapeFunctions();

		$content_types = [
			[
				'name'  => 'post',
				'label' => 'Posts',
			],
		];

		$expected_script_data = [
			'contentTypes' => $content_types,
			'endpoints'    => [],
			'links'        => [],
			'nonce'        => 'rest-nonce',
			'restRoot'     => 'https://example.com/wp-json/',
			'preferences'  => [
				'isPremium' => false,
				'isRtl'     => false,
				'pluginUrl' => 'https://example.com/wp-content/plugins/wordpress-seo',
			],
			'linkParams'   => [ 'foo' => 'bar' ],
		];

		Actions\expectRemoved( 'admin_print_scripts' )->once()->with( 'print_emoji_detection_script' );

		$this->asset_manager->expects( 'enqueue_script' )->once()->with( Bulk_Editor_Integration::ASSETS_NAME );
		$this->asset_manager->expects( 'enqueue_style' )->once()->with( Bulk_Editor_Integration::ASSETS_NAME );

		$this->content_types_repository->expects( 'get_content_types' )->once()->andReturn( $content_types );
		$this->nonce_repository->expects( 'get_rest_nonce' )->once()->andReturn( 'rest-nonce' );
		Functions\expect( 'rest_url' )->once()->withNoArgs()->andReturn( 'https://example.com/wp-json/' );
		$this->product_helper->expects( 'is_premium' )->once()->andReturn( false );
		Functions\expect( 'is_rtl' )->once()->withNoArgs()->andReturn( false );
		Functions\expect( 'plugins_url' )
			->once()
			->andReturn( 'https://example.com/wp-content/plugins/wordpress-seo' );
		$this->short_link_helper->expects( 'get_query_params' )->once()->andReturn( [ 'foo' => 'bar' ] );

		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with( Bulk_Editor_Integration::ASSETS_NAME, 'wpseoBulkEditorData', $expected_script_data );

		$this->instance->enqueue_assets();
	}
}
