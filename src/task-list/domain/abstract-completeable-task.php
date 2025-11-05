<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain;

/**
 * Abstract class for a completeable task.
 */
abstract class Abstract_Completeable_Task extends Abstract_Task implements Completeable_Task_Interface {

	/**
	 * Returns an array representation of the completeable task config data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function config_to_array(): array {
		$config                    = parent::config_to_array();
		$config['is_completeable'] = true;

		return $config;
	}
}
