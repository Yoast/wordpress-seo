<?php

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Date Archive Builder for the indexables.
 *
 * Formats the date archive meta to indexable format.
 */
class Indexable_Date_Archive_Builder {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexable_Date_Archive_Builder constructor.
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
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type       = 'date-archive';
		$indexable->title             = $this->options->get( 'title-archive-wpseo' );
		$indexable->description       = $this->options->get( 'metadesc-archive-wpseo' );
		$indexable->is_robots_noindex = $this->options->get( 'noindex-archive-wpseo' );
		$indexable->is_public         = ( (int) $indexable->is_robots_noindex !== 1 );
		$indexable->blog_id           = \get_current_blog_id();

		return $indexable;
	}
}
