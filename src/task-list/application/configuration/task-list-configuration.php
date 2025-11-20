<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Task_List\Application\Configuration;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository;

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
	 * The endpoints repository.
	 *
	 * @var Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper       $options_helper       The options helper.
	 * @param Endpoints_Repository $endpoints_repository The endpoints repository.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Endpoints_Repository $endpoints_repository
	) {
		$this->options_helper       = $options_helper;
		$this->endpoints_repository = $endpoints_repository;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string, array<string>|array<string, string|array<string, array<string, int>>>>
	 */
	public function get_configuration(): array {
		$configuration = [
			'enabled'   => $this->options_helper->get( 'enable_task_list', true ),
			'endpoints' => $this->endpoints_repository->get_all_endpoints()->to_array(),
		];

		return $configuration;
	}
}
