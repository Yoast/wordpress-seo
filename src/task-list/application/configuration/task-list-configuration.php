<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Task_List\Application\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Responsible for the task list configuration.
 */
class Task_List_Configuration {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string, array<string>|array<string, string|array<string, array<string, int>>>>
	 */
	public function get_configuration(): array {
		$configuration = [
			'enabled' => $this->options_helper->get( 'enable_task_list', true ),
		];

		return $configuration;
	}
}
