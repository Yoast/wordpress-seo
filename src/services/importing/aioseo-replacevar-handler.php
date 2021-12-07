<?php

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Handles AISOEO replacevars.
 */
class Aioseo_Replacevar_Handler {

	/**
	 * Mapping between the AiOSEO replace vars and the Yoast replace vars.
	 *
	 * @var array
	 *
	 * @see https://yoast.com/help/list-available-snippet-variables-yoast-seo/
	 */
	protected $replace_vars_map = [
		// They key is the AiOSEO replace var, the value is the Yoast replace var (see class-wpseo-replace-vars).
		'#archive_title'     => '%%archive_title%%', // Check.
		'#archive_date'      => '%%date%%', // Check.
		'#author_bio'        => '%%user_description%%', // Check.
		'#author_first_name' => '%%author_first_name%%',
		'#author_last_name'  => '%%author_last_name%%',
		'#author_name'       => '%%name%%',
		'#categories'        => '%%category%%',
		'#current_date'      => '%%currentdate%%',
		'#current_day'       => '%%currentday%%',
		'#current_month'     => '%%currentmonth%%',
		'#current_year'      => '%%currentyear%%',
		'#page_number'       => '%%pagenumber%%',
		'#permalink'         => '%%permalink%%',
		'#post_content'      => '%%post_content%%',
		'#post_date'         => '%%date%%',
		'#post_day'          => '%%post_day%%',
		'#post_month'        => '%%post_month%%',
		'#post_title'        => '%%title%%',
		'#post_year'         => '%%post_year%%',
		'#post_excerpt_only' => '%%excerpt_only%%',
		'#post_excerpt'      => '%%excerpt%%',
		'#search_term '      => '%%searchphrase%%', // Check.
		'#separator_sa'      => '%%sep%%',
		'#site_title'        => '%%sitename%%',
		'#tagline'           => '%%sitedesc%%',
		'#taxonomy_title'    => '%%category_title%%',
	];

	/**
	 * Transforms AIOSEO replacevars into Yoast replacevars.
	 *
	 * @param string $aioseo_replacevar The AIOSEO replacevar.
	 *
	 * @return string The Yoast replacevar.
	 */
	public function transform( $aioseo_replacevar ) {
		$yoast_replacevar = \str_replace( \array_keys( $this->replace_vars_map ), \array_values( $this->replace_vars_map ), $aioseo_replacevar );

		return $yoast_replacevar;
	}
}
