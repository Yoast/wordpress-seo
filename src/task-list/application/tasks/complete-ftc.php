<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Task_List\Domain\Abstract_Task;

/**
 * Represents the task for the completing the FTC.
 */
class Complete_FTC extends Abstract_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'complete-ftc';

	/**
	 * Holds the first time configuration notice helper.
	 *
	 * @var First_Time_Configuration_Notice_Helper
	 */
	private $ftc_notice_helper;

	/**
	 * Constructs the task.
	 *
	 * @param First_Time_Configuration_Notice_Helper $ftc_notice_helper The first time configuration notice helper.
	 */
	public function __construct( First_Time_Configuration_Notice_Helper $ftc_notice_helper ) {
		$this->ftc_notice_helper = $ftc_notice_helper;
	}

	/**
	 * Returns whether this task is open.
	 *
	 * @return bool Whether this task is open.
	 */
	public function get_is_open() {
		return ! $this->ftc_notice_helper->is_first_time_configuration_finished( true );
	}
}
