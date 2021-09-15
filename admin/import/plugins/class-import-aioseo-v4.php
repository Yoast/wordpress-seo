<?php
/**
 * File with the class to handle data from All in One SEO Pack, versions 4 and up.
 *
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class with functionality to import & clean All in One SEO Pack post metadata, versions 4 and up.
 */
class WPSEO_Import_AIOSEO_V4 extends WPSEO_Plugin_Importer {

	/**
	 * The plugin name.
	 *
	 * @var string
	 */
	protected $plugin_name = 'All In One SEO Pack';

	/**
	 * Meta key, used in SQL LIKE clause for delete query.
	 *
	 * @var string
	 */
	protected $meta_key = '_aioseo_%';

	/**
	 * Array of meta keys to detect and import.
	 *
	 * @var array
	 */
	protected $clone_keys = [
		[
			'old_key' => '_aioseo_title',
			'new_key' => 'title',
		],
		[
			'old_key' => '_aioseo_description',
			'new_key' => 'metadesc',
		],
		[
			'old_key' => '_aioseo_og_title',
			'new_key' => 'opengraph-title',
		],
		[
			'old_key' => '_aioseo_og_description',
			'new_key' => 'opengraph-description',
		],
		[
			'old_key' => '_aioseo_twitter_title',
			'new_key' => 'twitter-title',
		],
		[
			'old_key' => '_aioseo_twitter_description',
			'new_key' => 'twitter-description',
		],
	];

	/**
	 * Mapping between the AiOSEO replace vars and the Yoast replace vars.
	 *
	 * @var array
	 *
	 * @see https://yoast.com/help/list-available-snippet-variables-yoast-seo/
	 */
	protected $replace_vars = [
		// They key is the AiOSEO replace var, the value is the Yoast replace var (see class-wpseo-replace-vars).
		'#post_title'        => '%%title%%',
		'#separator_sa'      => '%%sep%%',
		'#site_title'        => '%%sitename%%',
		'#author_first_name' => '',
		'#author_last_name'  => '',
		'#author_name'       => '%%name%%', // Currently broken in Yoast, see https://yoast.atlassian.net/browse/IM-1334.
		'#categories'        => '%%category%%', // Currently broken in Yoast, see https://yoast.atlassian.net/browse/IM-1334.
		'#current_date'      => '',
		'#current_day'       => '',
		'#current_month'     => '',
		'#current_year'      => '',
		'#permalink'         => '',
		'#post_date'         => '%%date%%',
		'#post_day'          => '',
		'#post_month'        => '',
		'#post_year'         => '',
		'#post_excerpt'      => '%%excerpt%%',
		'#post_excerpt_only' => '%%excerpt_only%%',
		'#tagline'           => '%%sitedesc%%',
		'#taxonomy_title'    => '%%primary_category%%',
		'#tax_name'          => '',
	];

	/**
	 * Replaces the AiOSEO variables in our temporary table with Yoast variables (replace vars).
	 *
	 * @param array $replace_values Key value pair of values to replace with other values. This is only used in the base class but not here.
	 *                              That is because this class doesn't have any `convert` keys in `$clone_keys`.
	 *
	 * @return void
	 */
	protected function meta_key_clone_replace( $replace_values ) {
		global $wpdb;

		// At this point we're already looping through all the $clone_keys (this happens in meta_keys_clone() in the abstract class).
		// Now, we'll also loop through the replace_vars array, which holds the mappings between the AiOSEO variables and the Yoast variables.
		// We'll replace all the AiOSEO variables in the temporary table with their Yoast equivalents.
		foreach ( $this->replace_vars as $aioseo_variable => $yoast_variable ) {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: We need this query and this is done at many other places as well, for example class-import-rankmath.
			$wpdb->query(
				$wpdb->prepare(
					'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
					$aioseo_variable,
					$yoast_variable
				)
			);
		}

		// The AiOSEO custom fields take the form of `#custom_field-myfield`.
		// These should be mapped to %%cf_myfield%%.
		$meta_values_with_custom_fields = $this->get_meta_values_with_custom_fields( $wpdb );
		$unique_custom_fields           = $this->get_unique_custom_fields( $meta_values_with_custom_fields );
		$this->replace_custom_field_replace_vars( $unique_custom_fields, $wpdb );
	}

	/**
	 * Filters out all unique custom fields used in an AiOSEO replace var.
	 *
	 * @param string[] $meta_values_with_custom_fields An array of all the meta values that
	 *                                                 contain one or more AIOSEO custom field replace vars
	 *                                                 (in the form `#custom_field-xyz`).
	 *
	 * @return string[] An array of all the unique custom fields used in the replace vars.
	 *                  E.g. `xyz` in the above example.
	 */
	protected function get_unique_custom_fields( $meta_values_with_custom_fields ) {
		$unique_custom_fields = [];

		foreach ( $meta_values_with_custom_fields as $meta_value_with_custom_fields ) {
			// Find all custom field replace vars.
			\preg_match_all(
				'/#custom_field-(\w+)/',
				$meta_value_with_custom_fields,
				$matches
			);

			$custom_fields = $matches[1];

			foreach ( $custom_fields as $custom_field ) {
				$unique_custom_fields[ \trim( $custom_field ) ] = 1;
			}
		}

		return \array_keys( $unique_custom_fields );
	}

	/**
	 * Replaces every AIOSEO custom field replace var with the Yoast version.
	 *
	 * E.g. `#custom_field-xyz` becomes `%%cf_xyz%%`.
	 *
	 * @param string[] $unique_custom_fields An array of unique custom fields to replace the replace vars of.
	 * @param wpdb     $wpdb                 The WordPress database object.
	 */
	protected function replace_custom_field_replace_vars( $unique_custom_fields, $wpdb ) {
		foreach ( $unique_custom_fields as $unique_custom_field ) {
			$aioseo_variable = "#custom_field-{$unique_custom_field}";
			$yoast_variable  = "%%cf_{$unique_custom_field}%%";

			// %%cf_some_custom_field %%sep%% %%sitename%%&nbsp;&nbsp;%%%%cf_some_custom_field%%
			// %%cf_some_custom_field%% %%sep%% %%sitename%%&nbsp;&nbsp;%%cf_some_custom_field%%

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->query(
				$wpdb->prepare(
					'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
					$aioseo_variable,
					$yoast_variable
				)
			);
		}
	}

	// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

	/**
	 * Retrieve all the meta values from the temporary meta table that contain
	 * at least one AiOSEO custom field replace var.
	 *
	 * @param wpdb $wpdb The WordPress database object.
	 *
	 * @return string[] All meta values that contain at least one AioSEO custom field replace var.
	 */
	protected function get_meta_values_with_custom_fields( wpdb $wpdb ) {
		return $wpdb->get_col(
			$wpdb->prepare(
				'SELECT meta_value FROM tmp_meta_table WHERE meta_value LIKE %s',
				'%#custom_field-%'
			)
		);
	}

	// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
}
