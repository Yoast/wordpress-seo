<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Tasks;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Domain\Abstract_Task;

/**
 * Represents the task for the enabling the llms.txt file.
 */
class Enable_Llms_Txt extends Abstract_Task {

	/**
	 * Holds the id.
	 *
	 * @var string
	 */
	protected $id = 'enable-llms-txt';

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
	 * Returns whether this task is open.
	 *
	 * @return bool Whether this task is open.
	 */
	public function get_is_open() {
		return ! $this->options_helper->get( 'enable_llms_txt', false );
	}
}
