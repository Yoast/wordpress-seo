<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Domain\Abstract_Completeable_Task;

/**
 * Represents the task for the enabling the llms.txt file.
 */
class Enable_Llms_Txt extends Abstract_Completeable_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'enable-llms-txt';

	/**
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'normal';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 1;

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the task.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return $this->options_helper->get( 'enable_llms_txt', false );
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return null;
	}

	/**
	 * Completes a task.
	 *
	 * @return void
	 */
	public function complete_task(): void {
		$this->options_helper->set( 'enable_llms_txt', true );
	}
}
