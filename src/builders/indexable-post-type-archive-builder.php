<?php
/**
 * Post type archive builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Formats the post type archive meta to indexable format.
 */
class Indexable_Post_Type_Archive_Builder {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexable_Post_Type_Archive_Builder constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options
	) {
		$this->options = $options;
	}

	/**
	 * Formats the data.
	 *
	 * @param string    $post_type The post type to build the indexable for.
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $post_type, Indexable $indexable ) {
		$indexable->object_type       = 'post-type-archive';
		$indexable->object_sub_type   = $post_type;
		$indexable->title             = $this->options->get( 'title-ptarchive-' . $post_type );
		$indexable->description       = $this->options->get( 'metadesc-ptarchive-' . $post_type );
		$indexable->breadcrumb_title  = $this->get_breadcrumb_title( $post_type );
		$indexable->permalink         = \get_post_type_archive_link( $post_type );
		$indexable->is_robots_noindex = $this->options->get( 'noindex-ptarchive-' . $post_type );
		$indexable->is_public         = ( (int) $indexable->is_robots_noindex !== 1 );
		$indexable->blog_id           = \get_current_blog_id();

		return $indexable;
	}

	/**
	 * Returns the fallback breadcrumb title for a given post.
	 *
	 * @param string $post_type The post type to get the fallback breadcrumb title for.
	 *
	 * @return string
	 */
	private function get_breadcrumb_title( $post_type ) {
		$options_breadcrumb_title = $this->options->get( 'bctitle-ptarchive-' . $post_type );

		if ( $options_breadcrumb_title !== '' ) {
			return $options_breadcrumb_title;
		}

		$post_type_obj = \get_post_type_object( $post_type );

		if ( ! \is_object( $post_type_obj ) ) {
			return '';
		}

		if ( isset( $post_type_obj->label ) && $post_type_obj->label !== '' ) {
			return $post_type_obj->label;
		}

		if ( isset( $post_type_obj->labels->menu_name ) && $post_type_obj->labels->menu_name !== '' ) {
			return $post_type_obj->labels->menu_name;
		}

		return $post_type_obj->name;
	}
}
