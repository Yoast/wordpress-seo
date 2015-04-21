<?php

class WPSEO_GWT_Mapper {

	private static $platforms = array(
		'web'             => 'web',
		'mobile'          => 'mobile',
		'smartphone_only' => 'smartphoneOnly',
	);

	private static $categories = array(
		'auth_permissions'     => 'authPermissions',
		'many_to_one_redirect' => 'manyToOneRedirect',
		'not_followed'         => 'notFollowed',
		'not_found'            => 'notFound',
		'other'                => 'other',
		'roboted'              => 'roboted',
		'server_error'         => 'serverError',
		'soft_404'             => 'soft404',
	);

	/**
	 * @param string $platform
	 *
	 * @return mixed
	 */
	public static function platform( $platform ) {
		if ( array_key_exists( $platform, self::$platforms ) ) {
			return self::$platforms[ $platform ];
		}
	}

	/**
	 * @param string $category
	 *
	 * @return mixed
	 */
	public static function category( $category ) {
		if ( array_key_exists( $category, self::$categories ) ) {
			return self::$categories[ $category ];
		}
	}


}