<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Mapper
 */
class WPSEO_GSC_Mapper {

	/**
	 * The platforms which can be mapped.
	 *
	 * @var array
	 */
	private static $platforms = array(
		'web'             => 'web',
		'mobile'          => 'mobile',
		'smartphone_only' => 'smartphoneOnly',
	);

	/**
	 * The categories which can be mapped
	 *
	 * @var array
	 */
	private static $categories = array(
		'access_denied'    => 'authPermissions',
		'faulty_redirects' => 'manyToOneRedirect',
		'not_followed'     => 'notFollowed',
		'not_found'        => 'notFound',
		'other'            => 'other',
		'roboted'          => 'roboted',
		'server_error'     => 'serverError',
		'soft_404'         => 'soft404',
	);

	/**
	 * Mapping the platform
	 *
	 * @param string $platform
	 *
	 * @return mixed
	 */
	public static function platform( $platform ) {
		if ( ! empty( $platform ) && array_key_exists( $platform, self::$platforms ) ) {
			return self::$platforms[ $platform ];
		}
	}

	/**
	 * Mapping the given category.
	 *
	 * @param string $category
	 * @param bool   $flip
	 *
	 * @return mixed
	 */
	public static function category( $category, $flip = false ) {
		if ( ! empty( $category ) && $flip && $category = array_search( $category, self::$categories ) ) {
			return $category;
		}

		if ( ! empty( $category ) && ! $flip && array_key_exists( $category, self::$categories ) ) {
			return self::$categories[ $category ];
		}

		return $category;
	}

}
