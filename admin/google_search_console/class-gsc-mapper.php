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
		'settings'        => 'settings', // This one is basicly not a platform, but a tab.
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
	 * If there is no platform, just get the first key out of the array and redirect to it.
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return mixed
	 */
	public static function get_current_platform( $platform ) {
		$current_platform = filter_input( INPUT_GET, $platform );
		if ( ! empty( $current_platform ) ) {
			return $current_platform;
		}

		wp_redirect( add_query_arg( $platform, key( self::$platforms ) ) );
		exit;
	}

	/**
	 * Mapping the platform
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return mixed
	 */
	public static function platform_to_api( $platform ) {
		if ( ! empty( $platform ) && array_key_exists( $platform, self::$platforms ) ) {
			return self::$platforms[ $platform ];
		}
	}

	/**
	 * Mapping the given platform by value and return its key
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return string
	 */
	public static function platform_from_api( $platform ) {
		if ( ! empty( $platform ) ) {
			$platform = array_search( $platform, self::$platforms, true );
			if ( $platform !== false ) {
				return $platform;
			}
		}

		return $platform;
	}

	/**
	 * Mapping the given category by searching for its key.
	 *
	 * @param string $category Issue type.
	 *
	 * @return mixed
	 */
	public static function category_to_api( $category ) {
		if ( ! empty( $category ) && array_key_exists( $category, self::$categories ) ) {
			return self::$categories[ $category ];
		}

		return $category;
	}

	/**
	 * Mapping the given category by value and return its key
	 *
	 * @param string $category Issue type.
	 *
	 * @return string
	 */
	public static function category_from_api( $category ) {
		if ( ! empty( $category ) ) {
			$category = array_search( $category, self::$categories, true );
			if ( $category !== false ) {
				return $category;
			}
		}

		return $category;
	}
}
