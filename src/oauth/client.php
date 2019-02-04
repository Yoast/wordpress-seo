<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\Free\Oauth
 */

namespace Yoast\WP\Free\Oauth;

use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessToken;
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
	private $config = [
		'clientId' => null,
		'secret'   => null,
	];

	/**
	 * Contains the set access tokens.
	 *
	 * @var AccessTokenInterface[]
	 */
	private $access_tokens = [];

	/**
	 * Saves the configuration.
	 *
	 * @param array $config The configuration to use.
	 *
	 * @return void
	 */
	public function save_configuration( array $config ) {
		foreach ( array_keys( $this->config ) as $allowed_config_key ) {
			if ( ! array_key_exists( $allowed_config_key, $config ) ) {
				continue;
			}

			$this->config[ $allowed_config_key ] = $config[ $allowed_config_key ];
		}
	}

	/**
	 * Retrieves the value of the config.
	 *
	 * @return array The config.
	 */
	public function get_configuration() {
		return $this->config;
	}

	/**
	 * Checks if the configuration is set correctly.
	 *
	 * @return bool True when clientId and secret are set.
	 */
	public function has_configuration() {
		if ( $this->config['clientId'] === null ) {
			return false;
		}

		if ( $this->config['secret'] === null ) {
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
	public function save_access_token( $user_id, $access_token ) {
		$this->access_tokens[ $user_id ] = $access_token;
	}

	/**
	 * Retrieves an access token.
	 *
	 * @param null|int $user_id User id to receive token for.
	 *
	 * @return bool|AccessTokenInterface False if not found. Token when found.
	 */
	public function get_access_token( $user_id = null ) {
		if ( $user_id === null ) {
			return reset( $this->access_tokens );
		}

		if ( ! isset( $this->access_tokens[ $user_id ] ) ) {
			return false;
		}

		return $this->access_tokens[ $user_id ];
	}

	/**
	 * Returns an instance of the oAuth provider.
	 *
	 * @return GenericProvider The provider.
	 */
	public function get_provider() {
		return new GenericProvider(
			[
				'clientId'                => $this->config['clientId'],
				'clientSecret'            => $this->config['secret'],
				'redirectUri'             => ( \WPSEO_Utils::is_plugin_network_active() ) ? home_url( 'yoast/oauth/callback' ) : network_home_url( 'yoast/oauth/callback' ),
				'urlAuthorize'            => 'https://yoast.com/login/oauth/authorize',
				'urlAccessToken'          => 'https://yoast.com/login/oauth/token',
				'urlResourceOwnerDetails' => 'https://my.yoast.com/api/sites/current',
			]
		);
	}
}
