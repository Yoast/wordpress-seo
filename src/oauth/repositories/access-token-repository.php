<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Exception;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Access_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\ClientEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use Yoast\WP\Lib\Model;


class AccessTokenRepository implements AccessTokenRepositoryInterface {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Access_Token' );
	}

	/**
	 * @throws Exception When random_bytes did not succeed.
	 */
	public function getNewToken( ClientEntityInterface $clientEntity, array $scopes, $userIdentifier = null ) {
		$access_token = new Access_Token();
		$access_token->setClient($clientEntity);
		foreach ($scopes as $scope) {
			$access_token->addScope( $scope );
		}
		$access_token->setUserIdentifier($userIdentifier);
		return $access_token;
	}

	public function persistNewAccessToken( AccessTokenEntityInterface $accessTokenEntity ) {
		$this->query()->create(
			[
				"identifier" => $accessTokenEntity->getIdentifier(),
				"expiry_date_time" => $accessTokenEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
				"user_identifier" => $accessTokenEntity->getUserIdentifier(),
				"scopes" => implode( ',', $accessTokenEntity->getScopes() ),
				"client_identifier" => is_null( $accessTokenEntity->getClient() ) ? '' : $accessTokenEntity->getClient()->getIdentifier(),
			]
		)->save();
	}

	public function revokeAccessToken( $tokenId ) {
		$this->query()->where('identifier', $tokenId)->delete_many();
	}

	public function isAccessTokenRevoked( $tokenId ) {
		return $this->query()->where("identifier", $tokenId)->where_gt("expiry_date_time", (new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"))->count() === 0;
	}
}
