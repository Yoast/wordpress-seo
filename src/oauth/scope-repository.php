<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Repositories\ScopeRepositoryInterface;

class ScopeRepository implements ScopeRepositoryInterface {

	private static $scopes = [ "test-scope" ];

	public function getScopeEntityByIdentifier( $identifier ) {
		foreach (ScopeRepository::$scopes as $scope) {
			if ( $identifier === $scope ) {
				return new ScopeEntity( $scope );
			}
		}
		return null;
	}

	public function finalizeScopes( array $scopes, $grantType, ClientEntityInterface $clientEntity, $userIdentifier = null ) {
		$returned_scopes = array();
		foreach ($scopes as $scope) {
			if (in_array( $scope->getIdentifier(), ScopeRepository::$scopes ) ) {
				$returned_scopes[] = $scope;
			}
		}
		return $returned_scopes;
	}
}
