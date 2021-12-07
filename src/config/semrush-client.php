<?php

namespace Yoast\WP\SEO\Config;

use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;
use YoastSEO_Vendor\GuzzleHttp\Client;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;

/**
 * Class SEMrush_Client
 */
class SEMrush_Client extends OAuth_Client {

	/**
	 * The option's key.
	 */
	const TOKEN_OPTION = 'semrush_tokens';

	/**
	 * SEMrush_Client constructor.
	 *
	 * @param Options_Helper    $options_helper    The Options_Helper instance.
	 * @param WP_Remote_Handler $wp_remote_handler The request handler.
	 *
	 * @throws Empty_Property_Exception Throws when one of the required properties is empty.
	 */
	public function __construct(
		Options_Helper $options_helper,
		WP_Remote_Handler $wp_remote_handler
	) {
		$provider = new GenericProvider(
			[
				'clientId'                => 'yoast',
				'clientSecret'            => 'YdqNsWwnP4vE54WO1ugThKEjGMxMAHJt',
				'redirectUri'             => 'https://oauth.semrush.com/oauth2/yoast/success',
				'urlAuthorize'            => 'https://oauth.semrush.com/oauth2/authorize',
				'urlAccessToken'          => 'https://oauth.semrush.com/oauth2/access_token',
				'urlResourceOwnerDetails' => 'https://oauth.semrush.com/oauth2/resource',
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
}
