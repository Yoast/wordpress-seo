<?php

namespace Yoast\WP\SEO\Actions\Importing;

use Exception;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Indexation_Action_Interface;
use Yoast\WP\SEO\Actions\Indexing\Limited_Indexing_Action_Interface;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Importing action interface.
 */
abstract class Abstract_Importing_Action implements Importing_Action_Interface {

	/**
	 * The plugin the class deals with.
	 *
	 * @var string
	 */
	const PLUGIN = null;

	/**
	 * The type the class deals with.
	 *
	 * @var string
	 */
	const TYPE = null;

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
	 * Abstract_Importing_Action constructor.
	 *
	 * @param Indexable_Repository         $indexable_repository  The indexables repository.
	 * @param wpdb                         $wpdb                  The WordPress database instance.
	 * @param Indexable_To_Postmeta_Helper $indexable_to_postmeta The indexable_to_postmeta helper.
	 * @param Options_Helper               $options               The options helper.
	 * @param Wpdb_Helper                  $wpdb_helper           The wpdb_helper helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		wpdb $wpdb,
		Indexable_To_Postmeta_Helper $indexable_to_postmeta,
		Options_Helper $options,
		Wpdb_Helper $wpdb_helper ) {
		$this->indexable_repository  = $indexable_repository;
		$this->wpdb                  = $wpdb;
		$this->indexable_to_postmeta = $indexable_to_postmeta;
		$this->options               = $options;
		$this->wpdb_helper           = $wpdb_helper;
	}

	/**
	 * The name of the plugin we import from.
	 *
	 * @return string The plugin we import from.
	 *
	 * @throws Exception If the PLUGIN constant is not set in the child class.
	 */
	public function get_plugin() {
		$class  = get_class( $this );
		$plugin = $class::PLUGIN;

		if ( $plugin === null ) {
			throw new Exception( 'Importing action without explicit plugin' );
		}

		return $plugin;
	}

	/**
	 * The data type we import from the plugin.
	 *
	 * @return string The data type we import from the plugin.
	 *
	 * @throws Exception If the TYPE constant is not set in the child class.
	 */
	public function get_type() {
		$class = get_class( $this );
		$type  = $class::TYPE;

		if ( $type === null ) {
			throw new Exception( 'Importing action without explicit type' );
		}

		return $type;
	}

	/**
	 * Gets the cursor id (to be used as a key for the import_cursors option).
	 *
	 * @return string The cursor id.
	 */
	protected function get_cursor_id() {
		$class = get_class( $this );
		return $class::PLUGIN . '_' . $class::TYPE;
	}

	/**
	 * Gets the completed id (to be used as a key for the importing_completed option).
	 *
	 * @return string The completed id.
	 */
	public function get_completed_id() {
		return $this->get_cursor_id();
	}

	/**
	 * Returns the stored state of completedness.
	 *
	 * @return int The stored state of completedness.
	 */
	public function get_completed() {
		$completed_id          = $this->get_completed_id();
		$importers_completions = $this->options->get( 'importing_completed', [] );

		return ( isset( $importers_completions[ $completed_id ] ) ) ? $importers_completions[ $completed_id ] : false;
	}

	/**
	 * Stores the current state of completedness.
	 *
	 * @param bool $completed Whether the importer is completed.
	 *
	 * @return void.
	 */
	public function set_completed( $completed ) {
		$completed_id                  = $this->get_completed_id();
		$current_importers_completions = $this->options->get( 'importing_completed', [] );

		$current_importers_completions[ $completed_id ] = $completed;
		$this->options->set( 'importing_completed', $current_importers_completions );
	}

	/**
	 * Returns whether the importing action is enabled.
	 *
	 * @return bool True by default unless a child class overrides it.
	 */
	public function is_enabled() {
		return true;
	}

	/**
	 * Creates a query for gathering to-be-imported data from the database.
	 *
	 * @return string The query to use for importing or counting the number of items to import.
	 */
	abstract public function query();
}
