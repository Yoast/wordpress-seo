<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\Access_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\ClientEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use Yoast\WP\Lib\Model;

/**
 * Class Access_Token_Repository.
 */
class Access_Token_Repository implements AccessTokenRepositoryInterface {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Access_Token' );
	}

	/**
	 * Generate a new Access_Token.
	 *
	 * @param ClientEntityInterface $clientEntity The client entity for which to generate the access token.
	 * @param array                 $scopes The scopes to register for the access token.
	 * @param string|null           $userIdentifier The identifier of the user to register in the access token (optional).
	 *
	 * @return Access_Token An access token.
	 */
	public function getNewToken( ClientEntityInterface $clientEntity, array $scopes, $userIdentifier = null ) {
		$access_token = new Access_Token();
		$access_token->setClient( $clientEntity );
		foreach ( $scopes as $scope ) {
			$access_token->addScope( $scope );
		}
		$access_token->setUserIdentifier( $userIdentifier );
		return $access_token;
	}

	/**
	 * Store an AccessTokenEntityInterface in the database.
	 *
	 * @param AccessTokenEntityInterface $accessTokenEntity The access token to store.
	 *
	 * @return void
	 * @throws \Exception When storing the access token fails.
	 */
	public function persistNewAccessToken( AccessTokenEntityInterface $accessTokenEntity ) {
		$this->query()->create(
			[
				'identifier'        => $accessTokenEntity->getIdentifier(),
				'expiry_date_time'  => $accessTokenEntity->getExpiryDateTime()->format( 'Y-m-d H:i:s' ),
				'user_identifier'   => $accessTokenEntity->getUserIdentifier(),
				'scopes'            => implode( ',', $accessTokenEntity->getScopes() ),
				'client_identifier' => is_null( $accessTokenEntity->getClient() ) ? '' : $accessTokenEntity->getClient()->getIdentifier(),
			]
		)->save();
	}

	/**
	 * Remove an access token from the database.
	 *
	 * @param string $tokenId The identifier of the access token to remove from the database.
	 *
	 * @return void
	 */
	public function revokeAccessToken( $tokenId ) {
		$this->query()->where( 'identifier', $tokenId )->delete_many();
	}

	/**
	 * Check if an access token is revoked.
	 *
	 * @param string $tokenId The identifier of the access token to check.
	 *
	 * @return bool true when the access token is not found in the database, false otherwise.
	 */
	public function isAccessTokenRevoked( $tokenId ) {
		return $this->query()->where( 'identifier', $tokenId )->where_gt( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->count() === 0;
	}

	/**
	 * Remove all expired access tokens.
	 *
	 * @return void
	 */
	public function remove_expired() {
		$this->query()->where_lte( 'expiry_date_time', ( new \DateTimeImmutable( 'now' ) )->format( 'Y-m-d H:i:s' ) )->delete_many();
	}

	/**
	 * Remove all access tokens.
	 *
	 * @return void
	 */
	public function remove_all() {
		$this->query()->delete_many();
	}
}
