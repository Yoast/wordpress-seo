<?php
/**
 * Homepage Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Helpers\Options_Helper;

/**
 * Formats the homepage meta to indexable format.
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
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type       = 'date-archive';
		$indexable->title             = $this->options_helper->get( 'title-archive-wpseo' );
		$indexable->breadcrumb_title  = $this->options_helper->get( 'breadcrumbs-archiveprefix' );
		$indexable->description       = $this->options_helper->get( 'metadesc-archive-wpseo' );
		$indexable->is_robots_noindex = $this->options_helper->get( 'noindex-archive-wpseo' );

		return $indexable;
	}
}
