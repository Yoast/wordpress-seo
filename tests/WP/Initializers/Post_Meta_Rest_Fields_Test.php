<?php

namespace Yoast\WP\SEO\Tests\WP\Initializers;

use WP_REST_Response;
use WPSEO_Meta;
use WPSEO_Options;
use Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for Post_Meta_Rest_Fields.
 *
 * These tests run against a real WordPress environment to verify that
 * register_post_meta() produces correctly-configured registrations,
 * that the auth_callback_for_advanced_meta() gate matches the UI gate in
 * WPSEO_Meta::get_tab_field_defs(), and that the REST-response filter
 * strips Yoast meta for users who cannot edit the post.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields
 *
 * @group initializers
 */
final class Post_Meta_Rest_Fields_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Post_Meta_Rest_Fields
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = \YoastSEO()->classes->get( Post_Meta_Rest_Fields::class );
	}

	/**
	 * Restores the disableadvanced_meta option to its default state (true) so
	 * it does not bleed into subsequent tests.
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->set_disable_advanced_meta( true );
		parent::tear_down();
	}

	// -------------------------------------------------------------------------
	// Registration
	// -------------------------------------------------------------------------

	/**
	 * Tests that register_post_meta registers a general-subset field for the post
	 * post type with show_in_rest enabled.
	 *
	 * The register_post_meta() is hooked to wp_loaded and runs during the WordPress
	 * test bootstrap, so keys are already registered by the time tests execute.
	 * We verify against the post-type-specific registration (object_subtype = 'post').
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_registers_general_key_with_show_in_rest() {
		$this->instance->register_post_meta();
		$key        = WPSEO_Meta::$meta_prefix . 'title';
		$registered = \get_registered_meta_keys( 'post', 'post' );

		$this->assertArrayHasKey( $key, $registered );
		$this->assertTrue( $registered[ $key ]['show_in_rest'] );
		$this->assertTrue( $registered[ $key ]['single'] );
	}

	/**
	 * Tests that register_post_meta registers an advanced-subset field (noindex)
	 * for the "post" post type with show_in_rest enabled.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_registers_noindex_key_with_show_in_rest() {
		$this->instance->register_post_meta();
		$key        = WPSEO_Meta::$meta_prefix . 'meta-robots-noindex';
		$registered = \get_registered_meta_keys( 'post', 'post' );

		$this->assertArrayHasKey( $key, $registered );
		$this->assertTrue( $registered[ $key ]['show_in_rest'] );
	}

	/**
	 * Tests that register_post_meta registers a schema-subset field for the "post"
	 * post type with show_in_rest enabled.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_registers_schema_key_with_show_in_rest() {
		$this->instance->register_post_meta();
		$key        = WPSEO_Meta::$meta_prefix . 'schema_page_type';
		$registered = \get_registered_meta_keys( 'post', 'post' );

		$this->assertArrayHasKey( $key, $registered );
		$this->assertTrue( $registered[ $key ]['show_in_rest'] );
	}

	/**
	 * Tests that register_post_meta populates WPSEO_Meta::$fields_index for all
	 * registered fields. Calling it a second time is safe — the fields_index
	 * update is idempotent.
	 *
	 * @covers ::register_post_meta
	 *
	 * @return void
	 */
	public function test_register_post_meta_populates_fields_index() {
		$this->instance->register_post_meta();

		$this->assertArrayHasKey(
			WPSEO_Meta::$meta_prefix . 'title',
			WPSEO_Meta::$fields_index,
		);
		$this->assertSame(
			'general',
			WPSEO_Meta::$fields_index[ WPSEO_Meta::$meta_prefix . 'title' ]['subset'],
		);

		$this->assertArrayHasKey(
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			WPSEO_Meta::$fields_index,
		);
		$this->assertSame(
			'advanced',
			WPSEO_Meta::$fields_index[ WPSEO_Meta::$meta_prefix . 'meta-robots-noindex' ]['subset'],
		);
	}

	// -------------------------------------------------------------------------
	// auth_callback_for_advanced_meta
	// -------------------------------------------------------------------------

	/**
	 * Tests that auth_callback_for_advanced_meta returns false for a user who
	 * lacks edit_post on the target post, regardless of the disableadvanced_meta
	 * setting.
	 *
	 * @covers ::auth_callback_for_advanced_meta
	 *
	 * @return void
	 */
	public function test_auth_callback_denies_user_without_edit_post_capability() {
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		$post_id       = $this->factory->post->create();
		\wp_set_current_user( $subscriber_id );

		$result = $this->instance->auth_callback_for_advanced_meta(
			true,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			$post_id,
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests that auth_callback_for_advanced_meta returns false for an author who
	 * has edit_post on their own post but lacks wpseo_edit_advanced_metadata when
	 * disableadvanced_meta is on.
	 *
	 * @covers ::auth_callback_for_advanced_meta
	 *
	 * @return void
	 */
	public function test_auth_callback_denies_author_when_advanced_meta_restricted() {
		$this->set_disable_advanced_meta( true );

		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$post_id   = $this->factory->post->create( [ 'post_author' => $author_id ] );
		\wp_set_current_user( $author_id );

		$result = $this->instance->auth_callback_for_advanced_meta(
			true,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			$post_id,
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests that auth_callback_for_advanced_meta returns true for an author when
	 * disableadvanced_meta is off — the option gate is the only barrier.
	 *
	 * @covers ::auth_callback_for_advanced_meta
	 *
	 * @return void
	 */
	public function test_auth_callback_allows_author_when_advanced_meta_not_restricted() {
		$this->set_disable_advanced_meta( false );

		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$post_id   = $this->factory->post->create( [ 'post_author' => $author_id ] );
		\wp_set_current_user( $author_id );

		$result = $this->instance->auth_callback_for_advanced_meta(
			true,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			$post_id,
		);

		$this->assertTrue( $result );
	}

	/**
	 * Tests that auth_callback_for_advanced_meta returns true for a user who has
	 * the wpseo_edit_advanced_metadata capability even when disableadvanced_meta
	 * is on.
	 *
	 * @covers ::auth_callback_for_advanced_meta
	 *
	 * @return void
	 */
	public function test_auth_callback_allows_user_with_advanced_metadata_cap() {
		$this->set_disable_advanced_meta( true );

		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$post_id   = $this->factory->post->create( [ 'post_author' => $author_id ] );

		$user = \get_user_by( 'id', $author_id );
		$user->add_cap( 'wpseo_edit_advanced_metadata' );
		\wp_set_current_user( $author_id );

		$result = $this->instance->auth_callback_for_advanced_meta(
			true,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			$post_id,
		);

		$user->remove_cap( 'wpseo_edit_advanced_metadata' );
		$this->assertTrue( $result );
	}

	/**
	 * Tests that auth_callback_for_advanced_meta returns true for a user who has
	 * the wpseo_manage_options capability (the superuser cap checked by
	 * Capability_Helper), even without wpseo_edit_advanced_metadata explicitly.
	 *
	 * @covers ::auth_callback_for_advanced_meta
	 *
	 * @return void
	 */
	public function test_auth_callback_allows_user_with_manage_options_cap() {
		$this->set_disable_advanced_meta( true );

		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		$post_id  = $this->factory->post->create( [ 'post_author' => $admin_id ] );
		\wp_set_current_user( $admin_id );

		$result = $this->instance->auth_callback_for_advanced_meta(
			true,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
			$post_id,
		);

		$this->assertTrue( $result );
	}

	// -------------------------------------------------------------------------
	// hide_meta_from_unauthorized_rest_response
	// -------------------------------------------------------------------------

	/**
	 * Tests that hide_meta_from_unauthorized_rest_response returns the response
	 * unchanged for a user who can edit the post.
	 *
	 * @covers ::hide_meta_from_unauthorized_rest_response
	 *
	 * @return void
	 */
	public function test_hide_meta_returns_response_unchanged_for_editor() {
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		$post_id   = $this->factory->post->create();
		\wp_set_current_user( $editor_id );

		$post          = \get_post( $post_id );
		$prefix        = WPSEO_Meta::$meta_prefix;
		$original_data = [
			'title' => 'My Post',
			'meta'  => [
				$prefix . 'title'            => 'SEO Title',
				$prefix . 'schema_page_type' => 'WebPage',
			],
		];
		$response      = new WP_REST_Response( $original_data );

		$result = $this->instance->hide_meta_from_unauthorized_rest_response( $response, $post );

		$this->assertSame( $original_data, $result->get_data() );
	}

	/**
	 * Tests that hide_meta_from_unauthorized_rest_response strips all Yoast meta
	 * fields from the response for a user who cannot edit the post, while leaving
	 * unrelated meta keys intact.
	 *
	 * @covers ::hide_meta_from_unauthorized_rest_response
	 *
	 * @return void
	 */
	public function test_hide_meta_strips_yoast_fields_for_subscriber() {
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		$post_id       = $this->factory->post->create();
		\wp_set_current_user( $subscriber_id );

		$post     = \get_post( $post_id );
		$prefix   = WPSEO_Meta::$meta_prefix;
		$response = new WP_REST_Response(
			[
				'title' => 'My Post',
				'meta'  => [
					$prefix . 'title'            => 'SEO Title',
					$prefix . 'schema_page_type' => 'WebPage',
					'unrelated_meta_key'         => 'keep_me',
				],
			],
		);

		$result = $this->instance->hide_meta_from_unauthorized_rest_response( $response, $post );
		$data   = $result->get_data();

		$this->assertArrayNotHasKey( $prefix . 'title', $data['meta'] );
		$this->assertArrayNotHasKey( $prefix . 'schema_page_type', $data['meta'] );
		$this->assertArrayHasKey( 'unrelated_meta_key', $data['meta'] );
	}

	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	/**
	 * Sets the disableadvanced_meta option and clears the WPSEO_Options cache so
	 * the new value is immediately visible to Options_Helper::get().
	 *
	 * @param bool $value The value to set.
	 *
	 * @return void
	 */
	private function set_disable_advanced_meta( bool $value ): void {
		$wpseo                         = \get_option( 'wpseo', [] );
		$wpseo['disableadvanced_meta'] = $value;
		\update_option( 'wpseo', $wpseo );
		WPSEO_Options::clear_cache();
	}
}
