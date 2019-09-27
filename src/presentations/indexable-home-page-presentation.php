<?php
/**
 * Presentation object for indexables.
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

	public function __construct(
		Options_Helper $options_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->options_helper      = $options_helper;
		$this->current_page_helper = $current_page_helper;
	}

	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-home-wpseo' );
	}

	public function generate_replace_vars_object() {
		if ( $this->current_page_helper->is_home_static_page() ) {
			return \get_post( $this->model->object_id );
		}
		return [];
	}
}
