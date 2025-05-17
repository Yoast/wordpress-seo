<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Upgrade;

/**
 * Test Helper Class.
 */
final class Upgrade_Double extends WPSEO_Upgrade {

	/**
	 * Override the constructor to avoid calling that logic.
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * Cleans the option to make sure only relevant settings are there.
	 *
	 * @param string $option_name Option name save.
	 *
	 * @return void
	 */
	public function cleanup_option_data( $option_name ) {
		parent::cleanup_option_data( $option_name );
	}

	/**
	 * Test double. Retrieves the option value directly from the database.
	 *
	 * @param string $option_name Option to retrieve.
	 *
	 * @return array<int|bool|float|string|array[]> The content of the option if exists, otherwise an empty array.
	 */
	public function get_option_from_database( $option_name ) {
		return parent::get_option_from_database( $option_name );
	}

	/**
	 * Test double. Saves an option setting to where it should be stored.
	 *
	 * @param array<int|bool|float|string|array[]> $source_data    The option containing the value to be migrated.
	 * @param string                               $source_setting Name of the key in the "from" option.
	 * @param string|null                          $target_setting Name of the key in the "to" option.
	 *
	 * @return void
	 */
	public function save_option_setting( $source_data, $source_setting, $target_setting = null ) {
		parent::save_option_setting( $source_data, $source_setting, $target_setting );
	}

	/**
	 * Test double. Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 *
	 * @param string|null $previous_version The previous version.
	 *
	 * @return void
	 */
	public function finish_up( $previous_version = null ) {
		parent::finish_up( $previous_version );
	}

	/**
	 * Test double. Upgrades the plugin to version 3.6.
	 *
	 * @return void
	 */
	public function upgrade_36() {
		parent::upgrade_36();
	}

	/**
	 * Test double. Upgrades the plugin to version 4.9.
	 *
	 * @return void
	 */
	public function upgrade_49() {
		parent::upgrade_49();
	}

	/**
	 * Test double. Upgrades the plugin to version 5.0.
	 *
	 * @return void
	 */
	public function upgrade_50() {
		parent::upgrade_50();
	}

	/**
	 * Test double. Upgrades the plugin to version 7.4.
	 *
	 * @return void
	 */
	public function upgrade_74() {
		parent::upgrade_74();
	}

	/**
	 * Test double. Upgrades the plugin to version 9.0.
	 *
	 * @return void
	 */
	public function upgrade_90() {
		parent::upgrade_90();
	}

	/**
	 * Test double. Upgrades the plugin to version 14.1.
	 *
	 * @return void
	 */
	public function clean_up_private_taxonomies_for_141() {
		parent::clean_up_private_taxonomies_for_141();
	}

	/**
	 * Test double. Removes all the indexables for non-public post types.
	 *
	 * @return void
	 */
	public function remove_indexable_rows_for_non_public_post_types() {
		parent::remove_indexable_rows_for_non_public_post_types();
	}

	/**
	 * Test double. Removes all the indexables for non-public taxonomies.
	 *
	 * @return void
	 */
	public function remove_indexable_rows_for_non_public_taxonomies() {
		parent::remove_indexable_rows_for_non_public_taxonomies();
	}

	/**
	 * Test double. Removes all the indexables duplicates.
	 *
	 * @return void
	 */
	public function deduplicate_unindexed_indexable_rows() {
		parent::deduplicate_unindexed_indexable_rows();
	}

	/**
	 * Test double. Removes all the indexables referring to unindexed elements with no id.
	 *
	 * @return void
	 */
	public function clean_unindexed_indexable_rows_with_no_object_id() {
		parent::clean_unindexed_indexable_rows_with_no_object_id();
	}

	/**
	 * Test double. Removes all the user indexables when the author archive is disabled.
	 *
	 * @return void
	 */
	public function remove_indexable_rows_for_disabled_authors_archive() {
		parent::remove_indexable_rows_for_disabled_authors_archive();
	}

	/**
	 * Test double. Gets the indexable deduplication query for a specific object type.
	 *
	 * @param string     $object_type The object type to get the deduplication query for.
	 * @param array<int> $duplicates  The duplicates to deduplicate.
	 * @param object     $wpdb        The WordPress database object.
	 * @return string The deduplication query.
	 */
	public function get_indexable_deduplication_query_for_type( $object_type, $duplicates, $wpdb ) {
		return parent::get_indexable_deduplication_query_for_type( $object_type, $duplicates, $wpdb );
	}
}
