<?php

namespace Yoast\WP\SEO\Config;

use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;
use YoastSEO_Vendor\GuzzleHttp\Client;

/**
 * Class Wincher_Client
 */
class Wincher_Client extends OAuth_Client {

	/**
	 * The option's key.
	 */
	const TOKEN_OPTION = 'wincher_tokens';

	/**
	 * Name of the temporary PKCE cookie.
	 */
	const PKCE_COOKIE_NAME = 'yoast_wincher_pkce';

	/**
	 * @var WP_Remote_Handler
	 */
	protected $wp_remote_handler;

	/**
	 * Wincher_Client constructor.
	 *
	 * @param Options_Helper    $options_helper    The Options_Helper instance.
	 * @param WP_Remote_Handler $wp_remote_handler The request handler.
	 *
	 * @throws Empty_Property_Exception
	 */
	public function __construct(
		Options_Helper $options_helper,
		WP_Remote_Handler $wp_remote_handler
	) {

		$provider = new Wincher_PKCE_Provider(
			[
				'clientId'                => 'yoast',
				'redirectUri'             => 'https://auth.wincher.com/yoast/setup',
				'urlAuthorize'            => 'https://auth.wincher.com/connect/authorize',
				'urlAccessToken'          => 'https://auth.wincher.com/connect/token',
				'urlResourceOwnerDetails' => 'https://api.wincher.com/beta/user',
				'scopes'                  => [ 'api', 'offline_access' ],
				'scopeSeparator'          => ' ',
				'pkceMethod'              => 'S256',
			],
			[
				'httpClient' => new Client( [ 'handler' => $wp_remote_handler ] ),
			]
		);

		parent::__construct(
			self::TOKEN_OPTION,
			$provider,
			$options_helper
		);
	}

	/**
	 * Return the authorization URL.
	 *
	 * @return string The authentication URL.
	 */
	public function get_authorization_url() {
		$parsed_site_url = \wp_parse_url( \get_site_url() );

		$url = $this->provider->getAuthorizationUrl(
			[
				'state' => \WPSEO_Utils::format_json_encode( [ 'domain' => $parsed_site_url['host'] ] ),
			]
		);

		$pkceCode = $this->provider->getPkceCode();

		// Store a session cookie with the PKCE code that we need in order to
		// exchange the returned code for a token after authorization.
		setcookie( self::PKCE_COOKIE_NAME, $pkceCode, 0, '/', '', ! ! $_SERVER['HTTPS'], true );

		return $url;
	}

	/**
	 * @inheritDoc
	 */
	public function request_tokens( $code ) {
		if ( $pkceCode = $_COOKIE[ self::PKCE_COOKIE_NAME ] ) {
			$this->provider->setPkceCode( $pkceCode );
		}
		return parent::request_tokens( $code );
	}

	/**
	 * @inheritDoc
	 * @codeCoverageIgnore
	 */
	protected function do_request( $method, $url, array $options ) {
		$options['headers'] = [ 'Content-Type' => 'application/json' ];

		$options = array_merge_recursive(
			$options,
			[
				'headers' => $this->provider->getHeaders( $this->get_tokens()->access_token ),
			]
		);

		return parent::do_request( $method, $url, $options );
	}
}
