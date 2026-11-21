<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates;

use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Field_Renderer_Interface;
use Yoast\WP\SEO\Helpers\Meta_Helper;

/**
 * Renders a stored meta field to its display value, resolving replacement variables the same way
 * the post editor does, so the bulk editor can re-score a field on the value users actually see.
 */
class Field_Renderer implements Field_Renderer_Interface {

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
	 * Renders the current value of a meta field for a post, with replacement variables resolved.
	 *
	 * @param int    $post_id  The ID of the post.
	 * @param string $meta_key The meta key (without prefix) to render.
	 *
	 * @return string The rendered value.
	 */
	public function render( int $post_id, string $meta_key ): string {
		$value = (string) $this->meta_helper->get_value( $meta_key, $post_id );

		return (string) \wpseo_replace_vars( $value, \get_post( $post_id ) );
	}
}
