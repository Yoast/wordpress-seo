<?php

namespace Yoast\WP\SEO\Indexables\User_Interface\Command;

use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Indexables\Application\Actions\Migration\Indexable_Action;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class Migrate_Command implements Command_Interface {

	/**
	 * @var Indexable_Action
	 */
	private $indexable_action;

	public function __construct(Indexable_Action $indexable_action ) {
		$this->indexable_action = $indexable_action;
	}

	/**
	 * Gets the namespace.
	 *
	 * @return string
	 */
	public static function get_namespace() {
		return Main::WP_CLI_NAMESPACE;
	}

	/**
	 * Indexes all your content to ensure the best performance.
	 *
	 * @when after_wp_load
	 *
	 * @param array|null $args       The arguments.
	 * @param array|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function migrate( $args = null, $assoc_args = null ) {
		$this->indexable_action->migrate();
	}
}
