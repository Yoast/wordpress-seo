<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\SEO\Models\Scope;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\ClientEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\ScopeRepositoryInterface;

class ScopeRepository implements ScopeRepositoryInterface {

	private static $scopes = [ "test-scope" ];

	public function getScopeEntityByIdentifier( $identifier ) {
		foreach (ScopeRepository::$scopes as $scope) {
			if ( $identifier === $scope ) {
				return new Scope( $scope );
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
