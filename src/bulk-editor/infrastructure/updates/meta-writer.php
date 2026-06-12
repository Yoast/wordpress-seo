<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use WPSEO_Meta;
use WPSEO_Utils;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Meta_Writer_Interface;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;
use Yoast\WP\SEO\Helpers\Meta_Helper;

/**
 * Persists a title, description and focus keyphrase to Yoast post meta.
 *
 * Writing through the meta helper triggers the post meta watcher, so the
 * indexable of the post is rebuilt through the normal flow.
 */
class Meta_Writer implements Meta_Writer_Interface {

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
	 * Writes the title for a post.
	 *
	 * @param Update_Type $type    The appearance the title belongs to.
	 * @param int         $post_id The ID of the post.
	 * @param string      $title   The title to write.
	 *
	 * @return void
	 */
	public function write_title( Update_Type $type, int $post_id, string $title ): void {
		$key = $type->is_social() ? 'opengraph-title' : 'title';
		$this->write( $key, $post_id, $title );
	}

	/**
	 * Writes the description for a post.
	 *
	 * @param Update_Type $type        The appearance the description belongs to.
	 * @param int         $post_id     The ID of the post.
	 * @param string      $description The description to write.
	 *
	 * @return void
	 */
	public function write_description( Update_Type $type, int $post_id, string $description ): void {
		$key = $type->is_social() ? 'opengraph-description' : 'metadesc';
		$this->write( $key, $post_id, $description );
	}

	/**
	 * Writes the focus keyphrase for a post. The focus keyphrase is channel-agnostic,
	 * so it does not depend on the update type.
	 *
	 * @param int    $post_id         The ID of the post.
	 * @param string $focus_keyphrase The focus keyphrase to write.
	 *
	 * @return void
	 */
	public function write_focus_keyphrase( int $post_id, string $focus_keyphrase ): void {
		$this->write( 'focuskw', $post_id, $focus_keyphrase );
	}

	/**
	 * Sanitizes and persists a value under the given meta key.
	 *
	 * @param string $key     The meta key (without prefix) to store the value under.
	 * @param int    $post_id The ID of the post.
	 * @param string $value   The value to write.
	 *
	 * @return void
	 */
	private function write( string $key, int $post_id, string $value ): void {
		$this->meta_helper->set_value( $key, $this->sanitize( $key, $value ), $post_id );
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
