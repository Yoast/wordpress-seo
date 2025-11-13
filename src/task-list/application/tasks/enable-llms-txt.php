<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Completeable_Task;

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
	protected $priority = 'medium';

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

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return string|null
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Enable llms.txt', 'wordpress-seo' ),
			'default',
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
			\__( 'Create an llms.txt file', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast */
			\sprintf( \__( 'Enabling the llms.txt file will help AI tools to understand your site better.', 'wordpress-seo' ), 'Yoast' ),
			/* translators: %1$s expands to Yoast SEO */
			\sprintf( \__( 'Enable llms.txt generation in the plugin\'s settings. Yoast will automatically create an llms.txt file for you and keep it updated.', 'wordpress-seo' ), 'Yoast SEO' ),
		);
	}
}
