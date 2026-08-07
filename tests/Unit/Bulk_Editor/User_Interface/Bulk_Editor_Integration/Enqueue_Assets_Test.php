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
				'name'          => 'post',
				'label'         => 'Posts',
				'singularLabel' => 'Post',
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
		$this->replace_vars->expects( 'get_replacement_variables_with_labels' )->once()->andReturn( [] );

		$this->asset_manager->expects( 'localize_script' )
			->once()
			->with(
				Bulk_Editor_Integration::ASSETS_NAME,
				'wpseoBulkEditorData',
				Mockery::on(
					static function ( $data ) use ( $content_types ) {
						return $data['contentTypes'] === $content_types
							&& $data['nonce'] === 'rest-nonce'
							&& $data['preferences']['isPremium'] === false
							&& \array_key_exists( 'replacementVariables', $data )
							&& \array_key_exists( 'variables', $data['replacementVariables'] )
							&& \array_key_exists( 'recommended', $data['replacementVariables'] )
							&& \array_key_exists( 'specific', $data['replacementVariables'] )
							&& \array_key_exists( 'shared', $data['replacementVariables'] );
					},
				),
			);

		$this->instance->enqueue_assets();
	}
}
