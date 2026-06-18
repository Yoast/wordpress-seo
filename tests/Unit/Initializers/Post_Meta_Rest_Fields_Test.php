<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey;
use Mockery;
use stdClass;
use WPSEO_Meta;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests for Post_Meta_Rest_Fields.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields
 *
 * @group initializers
 */
final class Post_Meta_Rest_Fields_Test extends TestCase {

	/**
	 * Minimal meta_fields fixture — two fields across two subsets, enough to
	 * exercise every code path without dragging in the full production data.
	 *
	 * @var array
	 */
	private const FIXTURE_META_FIELDS = [
		'general' => [
			'title' => [
				'type'          => 'text',
				'default_value' => '',
			],
		],
		'schema'  => [
			'schema_page_type' => [
				'type' => 'hidden',
			],
		],
	];

	/**
	 * The instance under test.
	 *
	 * @var Post_Meta_Rest_Fields
	 */
	private $instance;

	/**
	 * Mocked taxonomy helper.
	 *
	 * @var Mockery\MockInterface&Taxonomy_Helper
	 */
	private $taxonomy_helper;

	/**
	 * Snapshot of WPSEO_Meta::$meta_fields, restored after each test.
	 *
	 * @var array<string, array<string, array<string, mixed>>>
	 */
	private $original_meta_fields;

	/**
	 * Snapshot of WPSEO_Meta::$fields_index, restored after each test.
	 *
	 * @var array<string, array<string, string>>
	 */
	private $original_fields_index;

	/**
	 * Snapshot of WPSEO_Meta::$defaults, restored after each test.
	 *
	 * @var array<string, string>
	 */
	private $original_defaults;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->original_meta_fields  = WPSEO_Meta::$meta_fields;
		$this->original_fields_index = WPSEO_Meta::$fields_index;
		$this->original_defaults     = WPSEO_Meta::$defaults;

		WPSEO_Meta::$meta_fields  = self::FIXTURE_META_FIELDS;
		WPSEO_Meta::$fields_index = [];
		WPSEO_Meta::$defaults     = [];

		$this->taxonomy_helper = Mockery::mock( Taxonomy_Helper::class );
		$this->instance        = new Post_Meta_Rest_Fields( $this->taxonomy_helper );
	}

	/**
	 * Tears down the test fixtures.
	 *
	 * @return void
	 */
	protected function tear_down() {
		WPSEO_Meta::$meta_fields  = $this->original_meta_fields;
		WPSEO_Meta::$fields_index = $this->original_fields_index;
		WPSEO_Meta::$defaults     = $this->original_defaults;

		parent::tear_down();
	}

	/**
	 * Tests that initialize registers the wp_loaded hook.
	 *
	 * @covers ::initialize
	 *
	 * @return void
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'wp_loaded' )
			->once()
			->with( [ $this->instance, 'register_post_meta' ] );

		$this->instance->initialize();
	}

	/**
	 * Tests that register_post_meta populates fields_index and defaults from
	 * WPSEO_Meta::$meta_fields before the post-type loop.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_populates_fields_index_and_defaults() {
		$this->stub_get_post_types( [] );

		$this->instance->register_post_meta();

		$prefix = WPSEO_Meta::$meta_prefix;

		$this->assertSame(
			[
				'subset' => 'general',
				'key'    => 'title',
			],
			WPSEO_Meta::$fields_index[ $prefix . 'title' ],
		);
		$this->assertSame( '', WPSEO_Meta::$defaults[ $prefix . 'title' ] );

		$this->assertSame(
			[
				'subset' => 'schema',
				'key'    => 'schema_page_type',
			],
			WPSEO_Meta::$fields_index[ $prefix . 'schema_page_type' ],
		);
		$this->assertSame( '', WPSEO_Meta::$defaults[ $prefix . 'schema_page_type' ] );
	}

	/**
	 * Tests that register_post_meta calls the WP register_post_meta function
	 * once per field per REST-enabled post type.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_calls_wp_register_post_meta_for_each_field() {
		// Fixture has 2 fields; expect 2 WP register_post_meta calls for one post type.
		Monkey\Functions\expect( 'register_post_meta' )->twice();

		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that add_post_type_support is called when the filter is on, the post type
	 * uses the block editor, and does not yet support custom-fields.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_adds_custom_fields_support_when_missing() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )
			->once()
			->with( 'post' )
			->andReturn( true );
		Monkey\Functions\expect( 'post_type_supports' )
			->once()
			->with( 'post', 'custom-fields' )
			->andReturn( false );
		Monkey\Functions\expect( 'add_post_type_support' )
			->once()
			->with( 'post', 'custom-fields' );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that add_post_type_support is NOT called when the post type already
	 * supports custom-fields.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_skips_add_custom_fields_support_when_already_supported() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )
			->once()
			->with( 'post' )
			->andReturn( true );
		Monkey\Functions\expect( 'post_type_supports' )
			->once()
			->with( 'post', 'custom-fields' )
			->andReturn( true );
		Monkey\Functions\expect( 'add_post_type_support' )->never();
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that add_post_type_support is NOT called when wpseo_disable_metabox_in_block_editor is false.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_skips_add_custom_fields_support_when_filter_is_off() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )->never();
		Monkey\Functions\expect( 'add_post_type_support' )->never();
		Monkey\Filters\expectAdded( 'rest_prepare_post' );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that add_post_type_support is NOT called for a post type that does not use the block editor.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_skips_add_custom_fields_support_when_not_block_editor_post_type() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )
			->once()
			->with( 'post' )
			->andReturn( false );
		Monkey\Functions\expect( 'post_type_supports' )->never();
		Monkey\Functions\expect( 'add_post_type_support' )->never();
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that the rest_prepare_{post_type} filter is registered with the
	 * correct callback, priority, and accepted-args count.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_adds_rest_prepare_filter() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' )
			->once()
			->with( [ $this->instance, 'hide_meta_from_unauthorized_rest_response' ], 10, 2 );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that rest_after_insert_{post_type} is hooked when
	 * wpseo_disable_metabox_in_block_editor returns true.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_adds_rest_after_insert_action_when_metabox_is_disabled() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )->andReturn( false );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' )
			->once()
			->with( Mockery::type( 'Closure' ), 10, 3 );

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that rest_after_insert_{post_type} is NOT hooked when
	 * wpseo_disable_metabox_in_block_editor returns false.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_no_rest_after_insert_action_when_metabox_is_enabled() {
		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' )->never();

		$this->instance->register_post_meta();
	}

	/**
	 * Tests that the rest_after_insert callback fires wpseo_saved_postdata when
	 * it is invoked for an update ($creating === false).
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_rest_after_insert_callback_fires_saved_postdata_on_update() {
		$captured_closure = null;

		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )->andReturn( false );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' )
			->once()
			->whenHappen(
				static function ( $callback ) use ( &$captured_closure ) {
					$captured_closure = $callback;
				},
			);

		$this->instance->register_post_meta();

		Monkey\Functions\expect( 'do_action' )->once()->with( 'wpseo_saved_postdata' );

		$captured_closure( Mockery::mock( 'WP_Post' ), null, false );
	}

	/**
	 * Tests that the rest_after_insert callback does NOT fire wpseo_saved_postdata
	 * when it is invoked for a new post creation ($creating === true).
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_rest_after_insert_callback_skips_saved_postdata_on_create() {
		$captured_closure = null;

		$this->stub_wp_register_post_meta();
		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [] );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( true );
		Monkey\Functions\expect( 'use_block_editor_for_post_type' )->andReturn( false );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Actions\expectAdded( 'rest_after_insert_post' )
			->once()
			->whenHappen(
				static function ( $callback ) use ( &$captured_closure ) {
					$captured_closure = $callback;
				},
			);

		$this->instance->register_post_meta();

		Monkey\Functions\expect( 'do_action' )
			->with( 'wpseo_saved_postdata' )
			->never();

		$captured_closure( Mockery::mock( 'WP_Post' ), null, true );
	}

	/**
	 * Tests that hide_meta_from_unauthorized_rest_response returns the
	 * response unchanged when the current user can edit the post.
	 *
	 * @covers ::hide_meta_from_unauthorized_rest_response
	 *
	 * @return void
	 */
	public function test_hide_meta_returns_unchanged_response_for_authorized_user() {
		$post     = Mockery::mock( 'WP_Post' );
		$post->ID = 1;
		$response = Mockery::mock( 'WP_REST_Response' );

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 1 )
			->andReturn( true );

		$result = $this->instance->hide_meta_from_unauthorized_rest_response( $response, $post );

		$this->assertSame( $response, $result );
	}

	/**
	 * Tests that hide_meta_from_unauthorized_rest_response strips all Yoast
	 * meta fields from the response when the current user cannot edit the post.
	 *
	 * @covers ::hide_meta_from_unauthorized_rest_response
	 *
	 * @return void
	 */
	public function test_hide_meta_strips_yoast_meta_for_unauthorized_user() {
		$prefix   = WPSEO_Meta::$meta_prefix;
		$post     = Mockery::mock( 'WP_Post' );
		$post->ID = 2;
		$response = Mockery::mock( 'WP_REST_Response' );

		$original_data = [
			'title' => 'My Post',
			'meta'  => [
				$prefix . 'title'            => 'SEO Title',
				$prefix . 'schema_page_type' => 'WebPage',
				'unrelated_meta_key'         => 'keep_me',
			],
		];

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_post', 2 )
			->andReturn( false );

		$response->expects( 'get_data' )->once()->andReturn( $original_data );
		$response->expects( 'set_data' )
			->once()
			->with(
				Mockery::on(
					static function ( $data ) use ( $prefix ) {
						return ! \array_key_exists( $prefix . 'title', $data['meta'] )
							&& ! \array_key_exists( $prefix . 'schema_page_type', $data['meta'] )
							&& \array_key_exists( 'unrelated_meta_key', $data['meta'] );
					},
				),
			);

		$result = $this->instance->hide_meta_from_unauthorized_rest_response( $response, $post );

		$this->assertSame( $response, $result );
	}

	/**
	 * Tests that register_post_meta registers primary-term meta for a
	 * hierarchical, non-excluded taxonomy.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_registers_primary_term_meta_for_hierarchical_taxonomy() {
		$taxonomy               = new stdClass();
		$taxonomy->name         = 'category';
		$taxonomy->hierarchical = true;

		$this->taxonomy_helper->expects( 'is_excluded' )
			->once()
			->with( 'category' )
			->andReturn( false );

		// 2 fixture fields + 1 primary term field.
		Monkey\Functions\expect( 'register_post_meta' )->times( 3 );

		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [ $taxonomy ] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );

		$this->instance->register_post_meta();

		$full_key = WPSEO_Meta::$meta_prefix . 'primary_category';
		$this->assertArrayHasKey( $full_key, WPSEO_Meta::$fields_index );
		$this->assertSame( 'primary_term', WPSEO_Meta::$fields_index[ $full_key ]['subset'] );
	}

	/**
	 * Tests that register_post_meta skips primary-term meta for an excluded
	 * taxonomy.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_skips_primary_term_meta_for_excluded_taxonomy() {
		$taxonomy               = new stdClass();
		$taxonomy->name         = 'category';
		$taxonomy->hierarchical = true;

		$this->taxonomy_helper->expects( 'is_excluded' )
			->once()
			->with( 'category' )
			->andReturn( true );

		// Only the 2 fixture fields; no primary term field.
		Monkey\Functions\expect( 'register_post_meta' )->twice();

		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [ $taxonomy ] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );

		$this->instance->register_post_meta();

		$full_key = WPSEO_Meta::$meta_prefix . 'primary_category';
		$this->assertArrayNotHasKey( $full_key, WPSEO_Meta::$fields_index );
	}

	/**
	 * Tests that register_post_meta skips primary-term meta for a
	 * non-hierarchical taxonomy.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_skips_primary_term_meta_for_non_hierarchical_taxonomy() {
		$taxonomy               = new stdClass();
		$taxonomy->name         = 'post_tag';
		$taxonomy->hierarchical = false;

		// taxonomy_helper->is_excluded should not be called because the taxonomy
		// is filtered out by the hierarchical check first.
		$this->taxonomy_helper->expects( 'is_excluded' )->never();

		Monkey\Functions\expect( 'register_post_meta' )->twice();

		$this->stub_get_post_types( [ 'post' ] );
		$this->stub_object_taxonomies( 'post', [ $taxonomy ] );
		Monkey\Filters\expectAdded( 'rest_prepare_post' );
		Monkey\Filters\expectApplied( 'wpseo_disable_metabox_in_block_editor' )->andReturn( false );

		$this->instance->register_post_meta();
	}

	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	/**
	 * Stubs get_post_types to return the given list of post type slugs.
	 *
	 * @param string[] $post_types Post type slugs to return.
	 *
	 * @return void
	 */
	private function stub_get_post_types( array $post_types ) {
		Monkey\Functions\expect( 'get_post_types' )
			->once()
			->with( [ 'show_in_rest' => true ], 'names' )
			->andReturn( $post_types );
	}

	/**
	 * Stubs get_object_taxonomies for a single post type to return the given
	 * taxonomy objects.
	 *
	 * @param string     $post_type  Post type slug.
	 * @param stdClass[] $taxonomies Taxonomy objects to return.
	 *
	 * @return void
	 */
	private function stub_object_taxonomies( $post_type, array $taxonomies ) {
		Monkey\Functions\expect( 'get_object_taxonomies' )
			->once()
			->with( $post_type, 'objects' )
			->andReturn( $taxonomies );
	}

	/**
	 * Stubs the WP register_post_meta function to accept any number of calls.
	 *
	 * @return void
	 */
	private function stub_wp_register_post_meta() {
		Monkey\Functions\expect( 'register_post_meta' )->zeroOrMoreTimes();
	}
}
