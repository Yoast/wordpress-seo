<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

class Indexables_Base_Migration_Conditional extends Migration_Conditional {

	/**
	 * Returns the name of the migration.
	 *
	 * @return string the name of the migration.
	 */
	protected function get_migration_name() {
		return 'free';
	}

	/**
	 * Returns the version of the migration.
	 *
	 * @return string the version of the migration.
	 */
	protected function get_migration_version() {
		return '11.7';
	}
}
