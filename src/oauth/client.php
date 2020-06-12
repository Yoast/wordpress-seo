<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Oauth
 */

namespace Yoast\WP\SEO\Oauth;

use WPSEO_Options;
use WPSEO_Utils;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessToken;
use YoastSEO_Vendor\League\OAuth2\Client\Token\AccessTokenInterface;

/**
 * Represents the oAuth client.
 */
class Client {

	/**
	 * Contains the configuration.
	 *
	 * @var array
	 */
	private $config;

	/**
	 * Contains the set access tokens.
	 *
	 * @var AccessTokenInterface[]
	 */
	private $access_tokens;

	/**
	 * Instance of this class.
	 *
	 * @var static
	 */
	private static $instance;

	/**
	 * Client constructor.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		$oauth = $this->get_option();

		$this->config        = $oauth['config'];
		$this->access_tokens = $this->format_access_tokens( $oauth['access_tokens'] );
	}

	/**
	 * Retrieves the instance of this class.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Client Instance of this class.
	 */
	public static function get_instance() {
		if ( static::$instance === null ) {
			static::$instance = new static();
		}

		return static::$instance;
	}

	/**
	 * Saves the configuration.
	 *
	 * @param array $config The configuration to use.
	 *
	 * @return void
	 */
	public function save_configuration( array $config ) {
		$allowed_config_keys = [ 'clientId', 'secret' ];
		foreach ( $allowed_config_keys as $allowed_config_key ) {
			if ( ! \array_key_exists( $allowed_config_key, $config ) ) {
				continue;
			}

			$this->config[ $allowed_config_key ] = $config[ $allowed_config_key ];
		}
		$this->update_option();
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
	 * Clears the current configuration.
	 *
	 * @return void
	 */
	public function clear_configuration() {
		$this->config = $this->get_default_option()['config'];

		$this->update_option();
	}

	/**
	 * Saves the access token for the given user.
	 *
	 * @param int                  $user_id      User ID to receive token for.
	 * @param AccessTokenInterface $access_token The access token to save.
	 *
	 * @return void
	 */
	public function save_access_token( $user_id, $access_token ) {
		$this->access_tokens[ $user_id ] = $access_token;
		$this->update_option();
	}

	/**
	 * Retrieves an access token.
	 *
	 * @param null|int $user_id User ID to receive token for.
	 *
	 * @return bool|AccessTokenInterface False if not found. Token when found.
	 */
	public function get_access_token( $user_id = null ) {
		if ( $user_id === null ) {
			return \reset( $this->access_tokens );
		}

		if ( ! isset( $this->access_tokens[ $user_id ] ) ) {
			return false;
		}

		return $this->access_tokens[ $user_id ];
	}

	/**
	 * Removes an access token from the list of access token.
	 *
	 * @param int $user_id The user ID to remove the access token for.
	 *
	 * @return void
	 */
	public function remove_access_token( $user_id ) {
		if ( ! isset( $this->access_tokens[ $user_id ] ) ) {
			return;
		}

		unset( $this->access_tokens[ $user_id ] );

		$this->update_option();
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
				'redirectUri'             => ( WPSEO_Utils::is_plugin_network_active() ) ? \home_url( 'yoast/oauth/callback' ) : \network_home_url( 'yoast/oauth/callback' ),
				'urlAuthorize'            => 'https://yoast.com/login/oauth/authorize',
				'urlAccessToken'          => 'https://yoast.com/login/oauth/token',
				'urlResourceOwnerDetails' => 'https://my.yoast.com/api/sites/current',
			]
		);
	}

	/**
	 * Formats the access tokens.
	 *
	 * @param array $access_tokens The access tokens to format.
	 *
	 * @return AccessTokenInterface[] The formatted access tokens.
	 */
	protected function format_access_tokens( $access_tokens ) {
		if ( ! \is_array( $access_tokens ) || $access_tokens === [] ) {
			return [];
		}

		$formatted_access_tokens = [];
		foreach ( $access_tokens as $user_id => $access_token ) {
			$formatted_access_tokens[ $user_id ] = new AccessToken( $access_token );
		}

		return $formatted_access_tokens;
	}

	/**
	 * Retrieves the myyoast oauth value from the options.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	protected function get_option() {
		$option_value = WPSEO_Options::get( 'myyoast_oauth', false );

		if ( $option_value ) {
			return \wp_parse_args(
				\json_decode( $option_value, true ),
				$this->get_default_option()
			);
		}

		return $this->get_default_option();
	}

	/**
	 * Exports the settings to the options.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function update_option() {
		WPSEO_Options::set(
			'myyoast_oauth',
			WPSEO_Utils::format_json_encode(
				[
					'config'        => $this->config,
					'access_tokens' => $this->access_tokens,
				]
			)
		);
	}

	/**
	 * Retrieves the default option value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The default option value.
	 */
	protected function get_default_option() {
		return [
			'config'        => [
				'clientId' => null,
				'secret'   => null,
			],
			'access_tokens' => [],
		];
	}
}
