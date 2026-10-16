<?php

namespace Yoast\WP\SEO\Tests\WP\Inc;

use WPSEO_Meta;
use WPSEO_Options;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration tests for allow_custom_field_edits() in inc/wpseo-non-ajax-functions.php.
 *
 * @coversNothing
 *
 * @group inc
 */
final class Non_Ajax_Functions_Test extends TestCase {

	/**
	 * The author user ID.
	 *
	 * @var int
	 */
	private $author_id;

	/**
	 * The post ID owned by the author.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * Sets up test fixtures.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		$this->post_id   = $this->factory->post->create( [ 'post_author' => $this->author_id ] );

		$this->set_disable_advanced_meta( true );
	}

	/**
	 * Restores the disableadvanced_meta option to its default after each test.
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->set_disable_advanced_meta( true );
		parent::tear_down();
	}

	// -------------------------------------------------------------------------
	// Advanced fields — restricted
	// -------------------------------------------------------------------------

	/**
	 * Tests that an author cannot get edit_post_meta for a noindex field when
	 * disableadvanced_meta is on (the default).
	 *
	 * This is the core regression: allow_custom_field_edits must not grant
	 * edit_post_meta for advanced/schema fields to users who lack
	 * wpseo_edit_advanced_metadata.
	 *
	 * @return void
	 */
	public function test_author_cannot_edit_advanced_field_when_advanced_meta_restricted() {
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests that an author cannot get edit_post_meta for a canonical URL field
	 * when disableadvanced_meta is on.
	 *
	 * @return void
	 */
	public function test_author_cannot_edit_canonical_field_when_advanced_meta_restricted() {
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'canonical',
		);

		$this->assertFalse( $result );
	}

	/**
	 * Tests that an author cannot get edit_post_meta for a schema field when
	 * disableadvanced_meta is on.
	 *
	 * @return void
	 */
	public function test_author_cannot_edit_schema_field_when_advanced_meta_restricted() {
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'schema_page_type',
		);

		$this->assertFalse( $result );
	}

	// -------------------------------------------------------------------------
	// General fields — always writable by authors who can edit the post
	// -------------------------------------------------------------------------

	/**
	 * Tests that an author can still get edit_post_meta for a general-subset field
	 * (title) even when disableadvanced_meta is on.
	 *
	 * @return void
	 */
	public function test_author_can_edit_general_field_when_advanced_meta_restricted() {
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'title',
		);

		$this->assertTrue( $result );
	}

	/**
	 * Tests that an author can still get edit_post_meta for a meta description field
	 * even when disableadvanced_meta is on.
	 *
	 * @return void
	 */
	public function test_author_can_edit_metadesc_field_when_advanced_meta_restricted() {
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'metadesc',
		);

		$this->assertTrue( $result );
	}

	// -------------------------------------------------------------------------
	// Advanced fields — unrestricted
	// -------------------------------------------------------------------------

	/**
	 * Tests that an author can get edit_post_meta for a noindex field when
	 * disableadvanced_meta is off.
	 *
	 * @return void
	 */
	public function test_author_can_edit_advanced_field_when_advanced_meta_not_restricted() {
		$this->set_disable_advanced_meta( false );
		\wp_set_current_user( $this->author_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
		);

		$this->assertTrue( $result );
	}

	// -------------------------------------------------------------------------
	// Editor — always has access to advanced fields
	// -------------------------------------------------------------------------

	/**
	 * Tests that an editor can get edit_post_meta for a noindex field even when
	 * disableadvanced_meta is on, because editors have wpseo_edit_advanced_metadata.
	 *
	 * @return void
	 */
	public function test_editor_can_edit_advanced_field_when_advanced_meta_restricted() {
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );

		$result = \current_user_can(
			'edit_post_meta',
			$this->post_id,
			WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
		);

		$this->assertTrue( $result );
	}

	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	/**
	 * Sets the disableadvanced_meta option and clears the WPSEO_Options cache.
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
