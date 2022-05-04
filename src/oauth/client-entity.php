<?php

namespace Yoast\WP\SEO\OAuth;

use Exception;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\Traits\ClientTrait;
use League\OAuth2\Server\Entities\Traits\EntityTrait;

class ClientEntity implements ClientEntityInterface {

	use EntityTrait;
	use ClientTrait;

	private $secret;

	/**
	 * Construct a ClientEntity.
	 *
	 * @param string $identifier The identifier of the client entity.
	 * @param string $name The name of the client entity.
	 * @param string|string[] $redirect_uri The redirect URI('s) this client entity can redirect to.
	 * @param bool $is_confidential Whether this client entity is confidential.
	 * @param string|null $secret The client secret.
	 *
	 * @throws Exception
	 */
	public function __construct( $identifier, $name, $redirect_uri, $is_confidential = false, $secret = null ) {
		if ( $is_confidential && is_null( $secret ) ) {
			throw new Exception( "A confidential client must always have a secret" );
		}
		$this->identifier = $identifier;
		$this->name = $name;
		$this->redirectUri = $redirect_uri;
		$this->isConfidential = $is_confidential;
		$this->secret = $secret;
	}

	/**
	 * Validate a Client secret.
	 *
	 * @param string $secret The client secret to validate.
	 *
	 * @return bool
	 */
	public function validate_client_secret( $secret ) {
		return $secret === $this->secret;
	}

}
