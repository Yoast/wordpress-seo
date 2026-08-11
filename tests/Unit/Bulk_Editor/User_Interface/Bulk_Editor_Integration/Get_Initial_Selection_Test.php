<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;
use Yoast\WP\SEO\Routes\Endpoint\Endpoint_List;

/**
 * Tests the selection carried over from a post overview bulk action.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_script_data
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::get_initial_selection
 */
final class Get_Initial_Selection_Test extends Abstract_Test {

	/**
	 * Tears down the test fixtures.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset(
			$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ],
			$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ],
			$_GET[ Bulk_Editor_Integration::SELECTED_COUNT_PARAM ],
		);

		parent::tear_down();
	}

	/**
	 * Tests that without URL parameters there is no initial selection.
	 *
	 * @return void
	 */
	public function test_no_selection_without_parameters() {
		$this->assertSame(
			[
				'contentType'   => '',
				'postIds'       => [],
				'selectedCount' => 0,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that a supported content type is carried over, also without post IDs.
	 *
	 * @return void
	 */
	public function test_carries_a_supported_content_type() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ] = 'post';

		$this->assertSame(
			[
				'contentType'   => 'post',
				'postIds'       => [],
				'selectedCount' => 0,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that an unsupported content type drops the whole selection.
	 *
	 * @return void
	 */
	public function test_ignores_an_unsupported_content_type() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ] = 'unsupported';
		$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ]     = '1,2,3';

		$this->assertSame(
			[
				'contentType'   => '',
				'postIds'       => [],
				'selectedCount' => 0,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that duplicate, non-numeric, zero and negative post IDs are dropped.
	 *
	 * @return void
	 */
	public function test_sanitizes_the_post_ids() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ] = 'post';
		$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ]     = '5,3,3,0,-2,junk';

		$this->assertSame(
			[
				'contentType'   => 'post',
				'postIds'       => [ 5, 3 ],
				'selectedCount' => 2,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that the post IDs are capped at the batch limit while the count keeps the overview's total.
	 *
	 * @return void
	 */
	public function test_caps_the_post_ids_at_the_batch_limit() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ]   = 'post';
		$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ]       = \implode( ',', \range( 1, 25 ) );
		$_GET[ Bulk_Editor_Integration::SELECTED_COUNT_PARAM ] = '30';

		$this->assertSame(
			[
				'contentType'   => 'post',
				'postIds'       => \range( 1, 20 ),
				'selectedCount' => 30,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that the selected count can never be lower than the number of carried post IDs.
	 *
	 * @return void
	 */
	public function test_selected_count_never_undercuts_the_post_ids() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ]   = 'post';
		$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ]       = '1,2,3';
		$_GET[ Bulk_Editor_Integration::SELECTED_COUNT_PARAM ] = '1';

		$this->assertSame(
			[
				'contentType'   => 'post',
				'postIds'       => [ 1, 2, 3 ],
				'selectedCount' => 3,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Tests that a non-scalar selected count is ignored.
	 *
	 * @return void
	 */
	public function test_ignores_a_non_scalar_selected_count() {
		$_GET[ Bulk_Editor_Integration::CONTENT_TYPE_PARAM ]   = 'post';
		$_GET[ Bulk_Editor_Integration::POST_IDS_PARAM ]       = '1,2,3';
		$_GET[ Bulk_Editor_Integration::SELECTED_COUNT_PARAM ] = [ '25' ];

		$this->assertSame(
			[
				'contentType'   => 'post',
				'postIds'       => [ 1, 2, 3 ],
				'selectedCount' => 3,
			],
			$this->get_initial_selection(),
		);
	}

	/**
	 * Primes every collaborator the script data needs and returns the initial selection part.
	 *
	 * @return array<string, string|int|array<int>> The initial selection script data.
	 */
	private function get_initial_selection() {
		$this->stubEscapeFunctions();
		Functions\stubs(
			[
				'rest_url'            => 'https://example.com/wp-json/',
				'is_rtl'              => false,
				'get_locale'          => 'en_US',
				'plugins_url'         => 'https://example.com/wp-content/plugins/wordpress-seo',
				'wp_nonce_url'        => 'https://example.com/wp-admin/update.php',
				'admin_url'           => static function ( $path ) {
					return 'https://example.com/wp-admin/' . $path;
				},
				'wp_unslash'          => static function ( $value ) {
					return $value;
				},
				'sanitize_text_field' => static function ( $value ) {
					return $value;
				},
			],
		);

		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->allows( 'to_array' )->andReturn( [] );

		$this->content_types_repository->allows( 'get_content_types' )->andReturn(
			[
				[
					'name'          => 'post',
					'label'         => 'Posts',
					'singularLabel' => 'Post',
				],
			],
		);
		$this->endpoints_repository->allows( 'get_all_endpoints' )->andReturn( $endpoint_list );
		$this->nonce_repository->allows( 'get_rest_nonce' )->andReturn( 'rest-nonce' );
		$this->product_helper->allows( 'is_premium' )->andReturn( false );
		$this->product_helper->allows( 'get_premium_version' )->andReturn( null );
		$this->options_helper->allows( 'get' )->andReturn( true );
		$this->short_link_helper->allows( 'get_query_params' )->andReturn( [] );
		$this->myyoast_connection_data_presenter->allows( 'present' )->andReturn( null );
		$this->user_helper->allows( 'get_current_user_id' )->andReturn( 1 );
		$this->user_helper->allows( 'get_meta' )->andReturn( false );

		return $this->instance->get_script_data()['initialSelection'];
	}
}
