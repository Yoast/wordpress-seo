<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- We want to follow the directory structure.
namespace Yoast\WP\SEO\Indexables\Domain\Actions;

/**
 * Migration action interface.
 */
interface Migration_Interface {

	/**
	 * The migration interface.
	 *
	 * @param string $old_url The current/old site url.
	 * @param string $new_url The url we are migrating to.
	 *
	 * @return int The amount of items that were migrated.
	 */
	public function migrate( string $old_url, string $new_url ): int;

	/**
	 * Returns the maximum amount of items to migrate in one batch.
	 *
	 * @return int The limit.
	 */
	public function get_limit(): int;

	/**
	 * The table name of the object to migrate.
	 *
	 * @return string
	 */
	public function get_table(): string;

	/**
	 * The name to display in the CLI.
	 *
	 * @return string
	 */
	public function get_name(): string;
}
