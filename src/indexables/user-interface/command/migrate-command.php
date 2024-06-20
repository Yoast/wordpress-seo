<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- We want to follow the directory structure.
namespace Yoast\WP\SEO\Indexables\User_Interface\Command;

use WP_CLI;
use WP_CLI\Utils;
use Yoast\WP\SEO\Commands\Command_Interface;
use Yoast\WP\SEO\Indexables\Domain\Actions\Migration_Interface;
use Yoast\WP\SEO\Main;

/**
 * Command to generate indexables for all posts and terms.
 */
class Migrate_Command implements Command_Interface {

	/**
	 * The migration actions that are being run.
	 *
	 * @var array<Migration_Interface>
	 */
	private $migration_actions;

	/**
	 * The constructor.
	 *
	 * @param Migration_Interface ...$migration_actions All migration actions.
	 */
	public function __construct( Migration_Interface ...$migration_actions ) {
		$this->migration_actions = $migration_actions;
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
	 * ## OPTIONS
	 *
	 * [--old-url]
	 * : The old URL we want to migrate from.
	 *
	 * [--new-url]
	 * : The new URL we want to migrate to.
	 *
	 * @when after_wp_load
	 *
	 * @param array<string>|null $args       The arguments.
	 * @param array<string>|null $assoc_args The associative arguments.
	 *
	 * @return void
	 */
	public function migrate( $args = null, $assoc_args = null ) {
		if ( ! isset( $assoc_args['old-url'] ) || ! isset( $assoc_args['new-url'] ) ) {
			WP_CLI::error( \__( 'Please provide both the old and new URL.', 'wordpress-seo' ) );
		}

		$total_migrated = 0;

		foreach ( $this->migration_actions as $migration_action ) {
			$total = $migration_action->get_total_unmigrated();
			if ( $total > 0 ) {
				$limit    = $migration_action->get_limit();
				$progress = Utils\make_progress_bar( 'Migrating ' . $migration_action->get_name(), $total );
				do {
					$indexables = $migration_action->migrate( $assoc_args['old-url'], $assoc_args['new-url'] );
					$progress->tick( $indexables );
					$total_migrated += $indexables;
				} while ( $indexables >= $limit );
				$progress->finish();
			}
		}

		WP_CLI::success(
			\sprintf(
			/* translators: %1$d is the number of records that are removed. */
				\_n(
					'Migrated %1$d record.',
					'Migrated %1$d records.',
					$total_migrated,
					'wordpress-seo'
				),
				$total_migrated
			)
		);
	}
}
