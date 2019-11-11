<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

use Yoast\WP\Free\Config\Migration_Status;

/**
 * Abstract class for creating conditionals based on migrations.
 */
abstract class Migration_Conditional implements Conditional {

	/**
	 * @var Migration_Status
	 */
	protected $migration_status;

	/**
	 * Feature_Flag_Conditional constructor.
	 *
	 * @param Migration_Status $migration_status The migration status object.
	 */
	public function __construct( Migration_Status $migration_status ) {
		$this->migration_status = $migration_status;
	}

	/**
	 * @inheritdoc
	 */
	public function is_met() {
		return $this->migration_status->is_version( $this->get_migration_name(), $this->get_migration_version() );
	}

	/**
	 * Returns the name of the migration.
	 *
	 * @return string the name of the migration.
	 */
	protected abstract function get_migration_name();

	/**
	 * Returns the version of the migration.
	 *
	 * @return string the version of the migration.
	 */
	protected function get_migration_version() {
		return WPSEO_VERSION;
	}
}
