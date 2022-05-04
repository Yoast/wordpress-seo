<?php

namespace Yoast\WP\SEO\OAuth;

use Exception;
use League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Repositories\AccessTokenRepositoryInterface;
use Yoast\WP\Lib\Model;


class AccessTokenRepository implements AccessTokenRepositoryInterface {

	/**
	 * @throws Exception When random_bytes did not succeed.
	 */
	public function getNewToken( ClientEntityInterface $clientEntity, array $scopes, $userIdentifier = null ) {
		$access_token = new AccessTokenEntity();
		$access_token->setClient($clientEntity);
		foreach ($scopes as $scope) {
			$access_token->addScope( $scope );
		}
		$access_token->setUserIdentifier($userIdentifier);
		return $access_token;
	}

	public function persistNewAccessToken( AccessTokenEntityInterface $accessTokenEntity ) {
		global $wpdb;
		$access_token_table = Model::get_table_name( 'AccessTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $access_token_table (identifier, expiry_date_time, user_identifier, scopes, client_identifier)
				VALUES (%s, %s, %s, %s, %s);",
				[
					$accessTokenEntity->getIdentifier(),
					$accessTokenEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
					$accessTokenEntity->getUserIdentifier(),
					implode( ',', $accessTokenEntity->getScopes() ),
					is_null( $accessTokenEntity->getClient() ) ? '' : $accessTokenEntity->getClient()->getIdentifier(),
				]
			)
		);
	}

	public function revokeAccessToken( $tokenId ) {
		global $wpdb;
		$access_token_table = Model::get_table_name( 'AccessTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $access_token_table
					WHERE `identifier` = %s;",
				[
					$tokenId,
				]
			)
		);
	}

	public function isAccessTokenRevoked( $tokenId ) {
		global $wpdb;
		$access_token_table = Model::get_table_name( 'AccessTokens' );
		$access_token       = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT `identifier`, `expiry_date_time`, `user_identifier`, `scopes`, `client_identifier`
				FROM $access_token_table
				WHERE `identifier` = %s
				AND `expiry_date_time` > %s;",
				[
					$tokenId,
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);
		return empty( $access_token );
	}
}
