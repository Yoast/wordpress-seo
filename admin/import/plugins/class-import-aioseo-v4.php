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

		// Replace the '#custom_field' variable(s). The current data are a number of rows in tmp_meta_table with a 'meta_value' column.
		// Some example of values in the meta_value column:
		$meta_value1 = '#custom_field-veldje #post_title#custom_field-gras'; // note that a meta value can hold more than one custom field.
		$meta_value2 = '#post_title#custom_field-groen'; // note there isn't necessarily a space between variables.
		$meta_value3 = '#separator_sa'; // note that some meta values won't have a custom field.

		// The AiOSEO custom fields take the form of `#custom_field-myfield`.
		// These should be mapped to %%cf_myfield%%.
	}
}
