<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Home_Page_Presentation extends Indexable_Presentation {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Indexable_Home_Page_Presentation constructor.
	 *
	 * @param Options_Helper      $options_helper      The options helper.
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->options_helper      = $options_helper;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-home-wpseo' );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		if ( $this->current_page_helper->is_home_static_page() ) {
			return \get_post( $this->model->object_id );
		}
		return [];
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_image() {
		$twitter_image = parent::generate_twitter_image();

		if ( $twitter_image ) {
			return $twitter_image;
		}

		// When OpenGraph image is set and the OpenGraph feature is enabled.
		if ( $this->model->og_image && $this->options_helper->get( 'opengraph' ) === true ) {
			return $this->model->og_image;
		}

		if ( $this->options_helper->get( 'opengraph' ) === true ) {
			return (string) $this->options_helper->get( 'og_default_image', '' );
		}

		return '';
	}
}
