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
		// TODO: Put access token expiration time somewhere
		$expiry_date  = new \DateTimeImmutable( 'now' );
		$expiry_date  = $expiry_date->add( \DateInterval::createFromDateString( '1 day' ) );
		$access_token = new AccessTokenEntity();
		$access_token->setIdentifier( random_bytes( 255 ) );
		$access_token->setExpiryDateTime( $expiry_date );
		$access_token->setIdentifier( $userIdentifier );
		foreach ( $scopes as $scope ) {
			$access_token->addScope( $scope );
		}
		$access_token->setClient( $clientEntity );
		return $access_token;
	}

	public function persistNewAccessToken( AccessTokenEntityInterface $accessTokenEntity ) {
		global $wpdb;
		$access_token_table = Model::get_table_name( 'AccessTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $access_token_table
				VALUES (%s, %s, %s, %s, %s);",
				[
					$accessTokenEntity->getIdentifier(),
					$accessTokenEntity->getExpiryDateTime(),
					$accessTokenEntity->getUserIdentifier(),
					implode( ',', $accessTokenEntity->getScopes() ),
					$accessTokenEntity->getClient()->getIdentifier(),
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
					new \DateTimeImmutable( 'now' ),
				]
			)
		);
		return ! empty( $access_token );
	}
}
