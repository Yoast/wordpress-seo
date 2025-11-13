<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Task;

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
	 * Holds the priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 15;

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
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return $this->ftc_notice_helper->is_first_time_configuration_finished( true );
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \self_admin_url( 'admin.php?page=wpseo_dashboard#/first-time-configuration' );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return string|null
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Go to the First-time configuration', 'wordpress-seo' ),
			'link',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return string|null
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			\__( 'Complete the First-time configuration', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast */
			\sprintf( \__( 'Completing the %1$s first time configuration sets your SEO foundation, improving site visibility.', 'wordpress-seo' ), 'Yoast' ),
			/* translators: %1$s expands to Yoast SEO */
			\sprintf( \__( 'Follow the first-time configuration steps to set up configure %1$s with optimal settings.', 'wordpress-seo' ), 'Yoast SEO' ),
		);
	}
}
