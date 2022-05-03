<?php

namespace Yoast\WP\SEO\OAuth;

use League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use League\OAuth2\Server\Repositories\AuthCodeRepositoryInterface;
use Yoast\WP\Lib\Model;

class AuthCodeRepository implements AuthCodeRepositoryInterface {

	public function getNewAuthCode() {
		$expiry_date  = new \DateTimeImmutable( 'now' );
		$expiry_date  = $expiry_date->add( \DateInterval::createFromDateString( '1 day' ) );
		$auth_code = new AuthCodeEntity();
		$auth_code->setIdentifier( random_bytes( 255 ) );
		$auth_code->setExpiryDateTime( $expiry_date );
		return $auth_code;
	}

	public function persistNewAuthCode( AuthCodeEntityInterface $authCodeEntity ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthCodes' );
		$wpdb->query(
			$wpdb->prepare(
				"INSERT INTO $auth_code_table
				VALUES (%s, %s, %s, %s, %s);",
				[
					$authCodeEntity->getIdentifier(),
					$authCodeEntity->getExpiryDateTime(),
					$authCodeEntity->getUserIdentifier(),
					implode( ',', $authCodeEntity->getScopes() ),
					$authCodeEntity->getClient()->getIdentifier(),
				]
			)
		);
	}

	public function revokeAuthCode( $codeId ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthCodes' );
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $auth_code_table
					WHERE `identifier` = %s;",
				[
					$codeId,
				]
			)
		);
	}

	public function isAuthCodeRevoked( $codeId ) {
		global $wpdb;
		$auth_code_table = Model::get_table_name( 'AuthCodes' );
		$auth_code       = $wpdb->get_col(
			$wpdb->prepare(
				"SELECT `identifier`, `expiry_date_time`, `user_identifier`, `scopes`, `client_identifier`
				FROM $auth_code_table
				WHERE `identifier` = %s
				AND `expiry_date_time` > %s;",
				[
					$codeId,
					new \DateTimeImmutable( 'now' ),
				]
			)
		);
		return ! empty( $auth_code );
	}
}
