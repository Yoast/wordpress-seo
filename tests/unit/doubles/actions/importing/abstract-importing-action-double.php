<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use wpdb;
use Yoast\WP\SEO\Actions\Importing\Abstract_Importing_Action;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class Abstract_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Importing_Action_Double extends Abstract_Importing_Action {

	/**
	 * Represents the indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * The indexable_to_postmeta helper.
	 *
	 * @var Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * Gets the completed id (to be used as a key for the importing_completed option).
	 *
	 * @return string The completed id.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		wpdb $wpdb,
		Indexable_To_Postmeta_Helper $indexable_to_postmeta,
		Options_Helper $options,
		Wpdb_Helper $wpdb_helper ) {
		return parent::__construct(
			$indexable_repository,
			$wpdb,
			$indexable_to_postmeta,
			$options,
			$wpdb_helper
		);
	}

	/**
	 * Gets the completed id (to be used as a key for the importing_completed option).
	 *
	 * @return string The completed id.
	 */
	public function get_completed_id() {
		return parent::get_completed_id();
	}

	/**
	 * Returns the stored state of completedness.
	 *
	 * @return int The stored state of completedness.
	 */
	public function get_completed() {
		return parent::get_completed();
	}

	/**
	 * Stores the current state of completedness.
	 *
	 * @param bool $completed Whether the importer is completed.
	 *
	 * @return void.
	 */
	public function set_completed( $completed ) {
		parent::set_completed( $completed );
	}
}
