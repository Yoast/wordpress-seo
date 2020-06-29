<?php
/**
 * Action for preparing the indexable indexation routine.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Action for preparing the indexable indexation routine.
 */
class Indexable_Prepare_Indexation_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Action for preparing the indexable indexation routine.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Prepare the indexable indexation routine.
	 */
	public function prepare() {
		$this->options->set( 'indexation_started', \time() );
	}
}


