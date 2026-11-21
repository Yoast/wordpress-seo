<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the 'Task List' feature is enabled.
 */
class Task_List_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Task_List_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns whether the 'Task List' feature is enabled.
	 *
	 * @return bool `true` when the 'Task List' feature is enabled.
	 */
	public function is_met() {
		return $this->options->get( 'enable_task_list' );
	}
}
