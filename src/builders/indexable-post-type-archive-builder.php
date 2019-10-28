<?php
/**
 * Post type archive builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Models\Indexable;

/**
 * Formats the post type archive meta to indexable format.
 */
class Indexable_Post_Type_Archive_Builder {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Post_Type_Archive_Builder constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
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
		$indexable->title             = $this->options_helper->get( 'title-ptarchive-' . $post_type );
		$indexable->description       = $this->options_helper->get( 'metadesc-ptarchive-' . $post_type );
		$indexable->breadcrumb_title  = $this->options_helper->get( 'bctitle-ptarchive-' . $post_type );
		$indexable->permalink         = \get_post_type_archive_link( $post_type );
		$indexable->is_robots_noindex = $this->options_helper->get( 'noindex-ptarchive-' . $post_type );

		return $indexable;
	}
}
