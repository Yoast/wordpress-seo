<?php

namespace Yoast\WP\SEO\Config;

use InvalidArgumentException;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use YoastSEO_Vendor\League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessTokenInterface;
use UnexpectedValueException;
use YoastSEO_Vendor\League\OAuth2\Client\Tool\BearerAuthorizationTrait;

/**
 * Class Wincher_PKCE_Provider
 */
class Wincher_PKCE_Provider extends GenericProvider {
	use BearerAuthorizationTrait;

	/**
	 * @var string
	 */
	private $pkceMethod = null;

	/**
	 * @var string
	 */
	protected $pkceCode;

	/**
	 * Returns the current value of the pkceCode parameter.
	 *
	 * This can be accessed by the redirect handler during authorization.
	 *
	 * @return string
	 */
	public function getPkceCode() {
		return $this->pkceCode;
	}

	/**
	 * Returns a new random string to use as PKCE code_verifier and
	 * hashed as code_challenge parameters in an authorization flow.
	 * Must be between 43 and 128 characters long.
	 *
	 * @param  int $length Length of the random string to be generated.
	 *
	 * @return string
	 */
	protected function getRandomPkceCode( $length = 64 ) {
		return substr(
			strtr(
				base64_encode( random_bytes( $length ) ),
				'+/',
				'-_'
			),
			0,
			$length
		);
	}

	/**
	 * @return string|null
	 */
	protected function getPkceMethod() {
		return $this->pkceMethod;
	}

	/**
	 * Returns authorization parameters based on provided options.
	 *
	 * @param  array $options
	 *
	 * @return array Authorization parameters
	 */
	protected function getAuthorizationParameters( array $options ) {
		if ( empty( $options['state'] ) ) {
			$options['state'] = $this->getRandomState();
		}

		if ( empty( $options['scope'] ) ) {
			$options['scope'] = $this->getDefaultScopes();
		}

		$options += [
			'response_type'   => 'code',
			'approval_prompt' => 'auto',
		];

		if ( is_array( $options['scope'] ) ) {
			$separator        = $this->getScopeSeparator();
			$options['scope'] = implode( $separator, $options['scope'] );
		}

		// Store the state as it may need to be accessed later on.
		$this->state = $options['state'];

		$pkceMethod = $this->getPkceMethod();
		if ( ! empty( $pkceMethod ) ) {
			$this->pkceCode = $this->getRandomPkceCode();
			if ( $pkceMethod === 'S256' ) {
				$options['code_challenge'] = trim(
					strtr(
						base64_encode( hash( 'sha256', $this->pkceCode, true ) ),
						'+/',
						'-_'
					),
					'='
				);
			} elseif ( $pkceMethod === 'plain' ) {
				$options['code_challenge'] = $this->pkceCode;
			} else {
				throw new InvalidArgumentException( 'Unknown PKCE method "' . $pkceMethod . '".' );
			}
			$options['code_challenge_method'] = $pkceMethod;
		}

		// Business code layer might set a different redirect_uri parameter
		// depending on the context, leave it as-is
		if ( ! isset( $options['redirect_uri'] ) ) {
			$options['redirect_uri'] = $this->redirectUri;
		}

		$options['client_id'] = $this->clientId;

		return $options;
	}

	/**
	 * Requests an access token using a specified grant and option set.
	 *
	 * @param  mixed $grant
	 * @param  array $options
	 * @throws IdentityProviderException
	 *
	 * @return AccessTokenInterface
	 */
	public function getAccessToken( $grant, array $options = [] ) {
		$grant = $this->verifyGrant( $grant );

		$params = [
			'client_id'     => $this->clientId,
			'client_secret' => $this->clientSecret,
			'redirect_uri'  => $this->redirectUri,
		];

		if ( ! empty( $this->pkceCode ) ) {
			$params['code_verifier'] = $this->pkceCode;
		}

		$params   = $grant->prepareRequestParameters( $params, $options );
		$request  = $this->getAccessTokenRequest( $params );
		$response = $this->getParsedResponse( $request );
		if ( false === is_array( $response ) ) {
			throw new UnexpectedValueException(
				'Invalid response received from Authorization Server. Expected JSON.'
			);
		}
		$prepared = $this->prepareAccessTokenResponse( $response );
		$token    = $this->createAccessToken( $prepared, $grant );

		return $token;
	}

	/**
	 * Returns all options that can be configured.
	 *
	 * @return array
	 */
	protected function getConfigurableOptions() {
		return array_merge(
			$this->getRequiredOptions(),
			[
				'accessTokenMethod',
				'accessTokenResourceOwnerId',
				'scopeSeparator',
				'responseError',
				'responseCode',
				'responseResourceOwnerId',
				'scopes',
				'pkceMethod',
			]
		);
	}

	/**
	 * @inheritDoc
	 */
	public function getParsedResponse( \YoastSEO_Vendor\Psr\Http\Message\RequestInterface $request ) {
		try {
			$response = $this->getResponse( $request );
		} catch ( \YoastSEO_Vendor\GuzzleHttp\Exception\BadResponseException $e ) {
			$response = $e->getResponse();
		}

		$parsed = $this->parseResponse( $response );

		$this->checkResponse( $response, $parsed );

		if ( ! \is_array( $parsed ) && $parsed === "" ) {
			$parsed = [ 'data' => [] ];
		}

		// Add the response code as this is omitted from Winchers API.
		if ( ! array_key_exists( 'status', $parsed ) ) {
			$parsed['status'] = $response->getStatusCode();
		}

		return $parsed;
	}
}
