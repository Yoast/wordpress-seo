<?php
/**
 * Presentation object for indexables.
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Meta_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Post_Type_Presentation extends Indexable_Presentation {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * @var Meta_Helper
	 */
	private $meta_helper;
	/**
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Options_Helper      $options_helper The options helper.
	 * @param Meta_Helper         $meta_helper
	 * @param Current_Page_Helper $current_page_helper
	 */
	public function __construct(
		Options_Helper $options_helper,
		Meta_Helper $meta_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->options_helper = $options_helper;
		$this->meta_helper    = $meta_helper;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options_helper->get( 'title-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_type() {
		return 'article';
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		$title = $this->meta_helper->get_value( 'twitter-title', $this->current_page_helper->get_simple_page_id() );
		if ( ! is_string( $title ) ) {
			return '';
		}

		return $this->title;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_post( $this->model->object_id );
	}
}
