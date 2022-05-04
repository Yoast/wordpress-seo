<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use Yoast\WP\Lib\Model;


class RefreshTokenRepository implements RefreshTokenRepositoryInterface {

	public function getNewRefreshToken() {
		return new RefreshTokenEntity();
	}

	public function persistNewRefreshToken( RefreshTokenEntityInterface $refreshTokenEntity ) {
		global $wpdb;
		$refresh_token_table = Model::get_table_name( 'RefreshTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $refresh_token_table (identifier, expiry_date_time, access_token)
				VALUES (%s, %s, %s);",
				[
					$refreshTokenEntity->getIdentifier(),
					$refreshTokenEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
					$refreshTokenEntity->getAccessToken(),
				]
			)
		);
	}

	public function revokeRefreshToken( $tokenId ) {
		global $wpdb;
		$refresh_token_table = Model::get_table_name( 'RefreshTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $refresh_token_table
					WHERE `identifier` = %s;",
				[
					$tokenId,
				]
			)
		);
	}

	public function isRefreshTokenRevoked( $tokenId ) {
		global $wpdb;
		$refresh_token_table = Model::get_table_name( 'RefreshTokens' );
		$refresh_token       = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT `identifier`, `expiry_date_time`, `access_token`
				FROM $refresh_token_table
				WHERE `identifier` = %s
				AND `expiry_date_time` > %s;",
				[
					$tokenId,
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);
		return empty( $refresh_token );
	}
}
