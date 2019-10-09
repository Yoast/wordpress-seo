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
class Indexable_Date_Archive_Presentation extends Indexable_Presentation {

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Indexable_Home_Page_Presentation constructor.
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

		if ( $this->options_helper->get( 'noindex-archive-wpseo', false ) ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		$twitter_title_option = 'title-archive-wpseo';
		$twitter_title        = $this->options_helper->get( $twitter_title_option );

		if ( empty( $twitter_title ) ) {
			$default_options = $this->options_helper->get_title_defaults();
			if ( ! empty( $default_options[ $twitter_title_option ] ) ) {
				$twitter_title = $default_options[ $twitter_title_option ];
			}
		}

		return $twitter_title;
	}
}
