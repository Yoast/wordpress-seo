<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use Yoast\WP\Lib\Model;

class AuthCodeRepository implements AuthCodeRepositoryInterface {

	public function getNewAuthCode() {
		return new AuthCodeEntity();
	}

	public function persistNewAuthCode( AuthCodeEntityInterface $authCodeEntity ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthTokens' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $auth_code_table (identifier, expiry_date_time, user_identifier, scopes, client_identifier)
				VALUES (%s, %s, %s, %s, %s);",
				[
					$authCodeEntity->getIdentifier(),
					$authCodeEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
					$authCodeEntity->getUserIdentifier(),
					implode( ',', $authCodeEntity->getScopes() ),
					$authCodeEntity->getClient()->getIdentifier(),
				]
			)
		);
	}

	public function revokeAuthCode( $codeId ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthTokens' );
		/*
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $auth_code_table
					WHERE `identifier` = %s;",
				[
					$codeId,
				]
			)
		);*/
	}

	public function isAuthCodeRevoked( $codeId ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthTokens' );
		$auth_code       = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT `identifier`, `expiry_date_time`, `user_identifier`, `scopes`, `client_identifier`
				FROM $auth_code_table
				WHERE `identifier` = %s
				AND `expiry_date_time` > %s;",
				[
					$codeId,
					(new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"),
				]
			)
		);
		return empty( $auth_code );
	}
}
