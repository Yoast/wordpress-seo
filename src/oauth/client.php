<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\Free\Oauth
 */

namespace Yoast\WP\Free\Oauth;

use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

/**
 * Represents the oAuth client.
 */
final class Client {

	/**
	 * Contains the configuration.
	 *
	 * @var array
	 */
	private static $config = [
		'clientId' => null,
		'secret'   => null,
	];

	/**
	 * Contains the set access tokens.
	 *
	 * @var AccessTokenInterface[]
	 */
	private static $access_tokens = [];

	/**
	 * Saves the configuration.
	 *
	 * @param array $config The configuration to use.
	 *
	 * @return void
	 */
	public static function save_configuration( array $config ) {
		foreach ( array_keys( static::$config ) as $allowed_config_key ) {
			if ( ! array_key_exists( $allowed_config_key, $config ) ) {
				continue;
			}

			static::$config[ $allowed_config_key ] = $config[ $allowed_config_key ];
		}
	}

	/**
	 * Retrieves the value of the config.
	 *
	 * @return array The config.
	 */
	public static function get_configuration() {
		return static::$config;
	}

	/**
	 * Checks if the configuration is set correctly.
	 *
	 * @return bool True when clientId and secret are set.
	 */
	public static function has_configuration() {
		if ( static::$config['clientId'] === null ) {
			return false;
		}

		if ( static::$config['secret'] === null ) {
			return false;
		}

		return true;
	}

	/**
	 * Saves the access token for the given user.
	 *
	 * @param int                  $user_id      User id to receive token for.
	 * @param AccessTokenInterface $access_token The access token to save.
	 *
	 * @return void
	 */
	public static function save_access_token( $user_id, AccessTokenInterface $access_token ) {
		static::$access_tokens[ $user_id ] = $access_token;
	}

	/**
	 * Retrieves an access token.
	 *
	 * @param null|int $user_id User id to receive token for.
	 *
	 * @return bool|AccessTokenInterface False if not found. Token when found.
	 */
	public static function get_access_token( $user_id = null ) {
		if ( $user_id === null ) {
			return reset( static::$access_tokens );
		}

		if ( ! isset( static::$access_tokens[ $user_id ] ) ) {
			return false;
		}

		return static::$access_tokens[ $user_id ];
	}

	/**
	 * Returns an instance of the oAuth provider.
	 *
	 * @return GenericProvider The provider.
	 */
	public static function get_provider() {
		return new GenericProvider(
			[
				'clientId'                => static::$config['clientId'],
				'clientSecret'            => static::$config['secret'],
				'redirectUri'             => ( \WPSEO_Utils::is_plugin_network_active() ) ? home_url( 'yoast/oauth/callback' ) : network_home_url( 'yoast/oauth/callback' ),
				'urlAuthorize'            => 'https://yoast.com/login/oauth/authorize',
				'urlAccessToken'          => 'https://yoast.com/login/oauth/token',
				'urlResourceOwnerDetails' => 'https://my.yoast.com/api/sites/current',
			]
		);
	}
}
