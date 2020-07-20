<?php
/**
 * Action for preparing the indexable indexation routine.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use Yoast\WP\SEO\Helpers\Date_Helper;
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
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	private $date;

	/**
	 * Action for preparing the indexable indexation routine.
	 *
	 * @param Options_Helper $options The options helper.
	 * @param Date_Helper    $date    The date helper.
	 */
	public function __construct(
		Options_Helper $options,
		Date_Helper $date
	) {
		$this->options = $options;
		$this->date    = $date;
	}

	/**
	 * Prepare the indexable indexation routine.
	 *
	 * @return void
	 */
	public function prepare() {
		$this->options->set( 'indexation_started', $this->date->current_time() );
	}
}
