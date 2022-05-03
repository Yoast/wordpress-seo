<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use Yoast\WP\Lib\Model;


class RefreshTokenRepository implements RefreshTokenRepositoryInterface {

	public function getNewRefreshToken() {
		// TODO: Put refresh token expiration time somewhere
		$expiry_date = new \DateTimeImmutable( 'now' );
		$expiry_date = $expiry_date->add( \DateInterval::createFromDateString( '1 day' ) );
		$refresh_token = new RefreshTokenEntity();
		$refresh_token->setIdentifier( random_bytes( 255 ) );
		$refresh_token->setExpiryDateTime( $expiry_date );
		return $refresh_token;
	}

	public function persistNewRefreshToken( RefreshTokenEntityInterface $refreshTokenEntity ) {
		global $wpdb;
		$refresh_token_table = Model::get_table_name( 'RefreshTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $refresh_token_table
				VALUES (%s, %s, %s);",
				[
					$refreshTokenEntity->getIdentifier(),
					$refreshTokenEntity->getExpiryDateTime(),
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
					new \DateTimeImmutable( 'now' ),
				]
			)
		);
		return ! empty( $refresh_token );
	}
}
