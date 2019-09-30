<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Options_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Post_Type_Archive_Presentation extends Indexable_Presentation {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		$post_type = $this->current_page_helper->get_queried_post_type();

		if ( $this->options_helper->get( 'noindex-ptarchive-' . $post_type, false ) ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}
}
