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
		'#custom_field'      => '',
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
			$wpdb->query(
				$wpdb->prepare(
					'UPDATE tmp_meta_table SET meta_value = REPLACE( meta_value, %s, %s )',
					$aioseo_variable,
					$yoast_variable
				)
			);
		}
	}
}
