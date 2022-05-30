<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\SEO\OAuth\Values\Scope;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\ClientEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\ScopeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\ScopeRepositoryInterface;

/**
 * Class Scope_Repository.
 */
class Scope_Repository implements ScopeRepositoryInterface {

	/**
	 * Scopes available for an authorization request.
	 *
	 * For now only holds a test scope.
	 *
	 * @var string[]
	 */
	private static $scopes = [ 'test-scope' ];

	/**
	 * Get a Scope object by identifier.
	 *
	 * @param string $identifier The scope identifier.
	 *
	 * @return Scope|null A Scope object when the scope identifier was found, null otherwise.
	 */
	public function getScopeEntityByIdentifier( $identifier ) {
		foreach ( self::$scopes as $scope ) {
			if ( $identifier === $scope ) {
				return new Scope( $scope );
			}
		}
		return null;
	}

	/**
	 * Check whether all scopes in $scopes are actually registered scopes.
	 *
	 * @param ScopeEntityInterface[] $scopes The scopes requested by an authorization request.
	 * @param string                 $grantType The grant type of the authorization request.
	 * @param ClientEntityInterface  $clientEntity The client of the authorization request.
	 * @param null|string            $userIdentifier The identifier of the User (possibly null).
	 *
	 * @return Scope[] A sanitized list of scopes that are available for the specific request parameters.
	 */
	public function finalizeScopes( array $scopes, $grantType, ClientEntityInterface $clientEntity, $userIdentifier = null ) {
		$returned_scopes = [];
		foreach ( $scopes as $scope ) {
			if ( in_array( $scope->getIdentifier(), self::$scopes, true ) ) {
				$returned_scopes[] = new Scope( $scope->getIdentifier() );
			}
		}
		return $returned_scopes;
	}
}
