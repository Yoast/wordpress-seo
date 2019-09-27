<?php
/**
 * Presentation object for indexables.
 */

namespace Yoast\WP\Free\Presentations;

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
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Options_Helper $options_helper
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
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
	public function generate_replace_vars_object() {
		return \get_post( $this->model->object_id );
	}
}
