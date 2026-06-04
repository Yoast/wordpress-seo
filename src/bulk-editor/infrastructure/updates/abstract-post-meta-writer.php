<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use WPSEO_Meta;
use WPSEO_Utils;
use Yoast\WP\SEO\Helpers\Meta_Helper;

/**
 * Persists a title and description to Yoast post meta.
 *
 * Writing through the meta helper triggers the post meta watcher, so the
 * indexable of the post is rebuilt through the normal flow.
 */
abstract class Abstract_Post_Meta_Writer {

	/**
	 * The meta helper.
	 *
	 * @var Meta_Helper
	 */
	private $meta_helper;

	/**
	 * The constructor.
	 *
	 * @param Meta_Helper $meta_helper The meta helper.
	 */
	public function __construct( Meta_Helper $meta_helper ) {
		$this->meta_helper = $meta_helper;
	}

	/**
	 * Gets the meta key (without prefix) the title is stored under.
	 *
	 * @return string The meta key the title is stored under.
	 */
	abstract protected function get_title_meta_key(): string;

	/**
	 * Gets the meta key (without prefix) the description is stored under.
	 *
	 * @return string The meta key the description is stored under.
	 */
	abstract protected function get_description_meta_key(): string;

	/**
	 * Writes the title for a post.
	 *
	 * @param int    $post_id The ID of the post.
	 * @param string $title   The title to write.
	 *
	 * @return void
	 */
	public function write_title( int $post_id, string $title ): void {
		$key = $this->get_title_meta_key();
		$this->meta_helper->set_value( $key, $this->sanitize( $key, $title ), $post_id );
	}

	/**
	 * Writes the description for a post.
	 *
	 * @param int    $post_id     The ID of the post.
	 * @param string $description The description to write.
	 *
	 * @return void
	 */
	public function write_description( int $post_id, string $description ): void {
		$key = $this->get_description_meta_key();
		$this->meta_helper->set_value( $key, $this->sanitize( $key, $description ), $post_id );
	}

	/**
	 * Sanitizes a value the same way the post editor sanitizes meta values.
	 *
	 * Registered fields are routed through the canonical meta sanitizer so the
	 * field-specific handling and the `wpseo_sanitize_post_meta_*` filter run, matching
	 * a normal post save. Fields that are not registered (for example the Open Graph
	 * fields when social appearance is disabled) have no canonical sanitize callback, so
	 * they fall back to plain text sanitization.
	 *
	 * @param string $key   The meta key (without prefix) the value is stored under.
	 * @param string $value The value to sanitize.
	 *
	 * @return string The sanitized value.
	 */
	private function sanitize( string $key, string $value ): string {
		$meta_key = WPSEO_Meta::$meta_prefix . $key;

		if ( isset( WPSEO_Meta::$fields_index[ $meta_key ] ) ) {
			return WPSEO_Meta::sanitize_post_meta( $value, $meta_key );
		}

		return WPSEO_Utils::sanitize_text_field( \trim( $value ) );
	}
}
