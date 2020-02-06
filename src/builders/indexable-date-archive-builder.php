<?php
/**
 * Date Archive Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Formats the date archive meta to indexable format.
 */
class Indexable_Date_Archive_Builder {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Date_Archive_Builder constructor.
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
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type       = 'date-archive';
		$indexable->title             = $this->options_helper->get( 'title-archive-wpseo' );
		$indexable->breadcrumb_title  = $this->options_helper->get( 'breadcrumbs-archiveprefix' );
		$indexable->description       = $this->options_helper->get( 'metadesc-archive-wpseo' );
		$indexable->is_robots_noindex = $this->options_helper->get( 'noindex-archive-wpseo' );
		$indexable->is_public         = ( (int) $indexable->is_robots_noindex !== 1 );

		return $indexable;
	}
}
