<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * Represents data about the migrations and indexables.
 */
class WPSEO_Tracking_Migrations_Indexables implements WPSEO_Collection {

	/**
	 * The names for the migrations.
	 * 
	 * @var array The names of our migrations.
	 */
	private $migration_names = [
		'free',
		'premium'
	];

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {
		return [
			'migrations'     => $this->get_migrations_info(),
			'indexables'     => $this->get_indexables_info(),
		];
	}

	/**
	 * Returns information about the sites' migrations status.
	 *
	 * @return Array Array with the value.
	 */
	protected function get_migrations_info() {

		$migration_status = [];

		foreach ( $this->migration_names as $name ) {
			$migration_status[ $name ] = \get_option( 'yoast_migrations_' . $name );
		}
		return $migration_status;
	}

	/**
	 * Returns information about the sites' indexables.
	 *
	 * @return Array Array with the value.
	 */
	protected function get_indexables_info() {

		return [];
	}
}
