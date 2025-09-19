<?php

namespace Yoast\WP\SEO\Config\Migrations;

use Yoast\WP\Lib\Migrations\Migration;
use Yoast\WP\Lib\Model;

/**
 * ImproveIndexCardinalityOnSEOLinks class.
 */
class ImproveIndexCardinalityOnSEOLinks extends Migration {

	const FIRST_INDEX_NAME  = 'link_direction';
	const SECOND_INDEX_NAME = 'indexable_link_direction';

	const UPDATED_FIRST_INDEX_NAME  = 'link_direction_type_and_post_id';
	const UPDATED_SECOND_INDEX_NAME = 'indexable_link_direction_type_and_indexable_id';

	/**
	 * The plugin this migration belongs to.
	 *
	 * @var string
	 */
	public static $plugin = 'free';

	/**
	 * The column names of the first index we're updating.
	 *
	 * @var string[] $first_index_original_columns The index columns.
	 */
	protected $first_index_original_columns = [
		'post_id',
		'type',
	];

	/**
	 * The updated column names and order for the first index.
	 *
	 * @var string[] $first_index_updated_columns The updated index columns.
	 */
	protected $first_index_updated_columns = [
		'type',
		'post_id',
	];

	/**
	 * The column names of the second index we're updating.
	 *
	 * @var string[] $second_index_original_columns The index columns.
	 */
	protected $second_index_original_columns = [
		'indexable_id',
		'type',
	];

	/**
	 * The updated column names and order for the second index.
	 *
	 * @var string[] $second_index_updated_columns The updated index columns.
	 */
	protected $second_index_updated_columns = [
		'type',
		'indexable_id',
	];

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up() {
		$adapter = $this->get_adapter();

		if ( $adapter->has_index( $this->get_table_name(), $this->first_index_original_columns, [ 'name' => self::FIRST_INDEX_NAME ] ) ) {
			$this->remove_index(
				$this->get_table_name(),
				$this->first_index_original_columns,
				[
					'name' => self::FIRST_INDEX_NAME,
				]
			);

			// Column order is important when creating indexes. RDBMSes rely on low cardinality to determine which index to use.
			// Columns that have the smallest number of discrete values should be placed first.
			$this->add_index(
				$this->get_table_name(),
				$this->first_index_updated_columns,
				[
					'name' => self::UPDATED_FIRST_INDEX_NAME,
				]
			);
		}

		if ( $adapter->has_index( $this->get_table_name(), $this->second_index_original_columns, [ 'name' => self::SECOND_INDEX_NAME ] ) ) {
			$this->remove_index(
				$this->get_table_name(),
				$this->second_index_original_columns,
				[
					'name' => self::SECOND_INDEX_NAME,
				]
			);

			$this->add_index(
				$this->get_table_name(),
				$this->second_index_updated_columns,
				[
					'name' => self::UPDATED_SECOND_INDEX_NAME,
				]
			);
		}
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down() {
		$adapter = $this->get_adapter();

		if ( $adapter->has_index( $this->get_table_name(), $this->first_index_updated_columns, [ 'name' => self::UPDATED_FIRST_INDEX_NAME ] ) ) {
			$this->remove_index(
				$this->get_table_name(),
				$this->first_index_updated_columns,
				[
					'name' => self::UPDATED_FIRST_INDEX_NAME,
				]
			);
		}

		if ( ! $adapter->has_index( $this->get_table_name(), [], [ 'name' => self::FIRST_INDEX_NAME ] ) ) {
			$this->add_index(
				$this->get_table_name(),
				$this->first_index_original_columns,
				[
					'name' => self::FIRST_INDEX_NAME,
				]
			);
		}

		if ( $adapter->has_index( $this->get_table_name(), $this->second_index_updated_columns, [ 'name' => self::UPDATED_SECOND_INDEX_NAME ] ) ) {
			$this->remove_index(
				$this->get_table_name(),
				$this->second_index_updated_columns,
				[
					'name' => self::UPDATED_SECOND_INDEX_NAME,
				]
			);
		}

		if ( ! $adapter->has_index( $this->get_table_name(), $this->second_index_original_columns, [ 'name' => self::SECOND_INDEX_NAME ] ) ) {
			$this->add_index(
				$this->get_table_name(),
				$this->second_index_original_columns,
				[
					'name' => self::SECOND_INDEX_NAME,
				]
			);
		}
	}

	/**
	 * Retrieves the table name to use for storing SEO links.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Model::get_table_name( 'SEO_Links' );
	}
}
