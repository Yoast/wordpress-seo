<?php

namespace Yoast\WP\SEO\OAuth\Repositories;

use Yoast\WP\SEO\Models\Refresh_Token;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Repositories\RefreshTokenRepositoryInterface;
use Yoast\WP\Lib\Model;


class RefreshTokenRepository implements RefreshTokenRepositoryInterface {

	public function query() {
		return Model::of_type( "Refresh_Token" );
	}

	public function getNewRefreshToken() {
		return new Refresh_Token();
	}

	public function persistNewRefreshToken( RefreshTokenEntityInterface $refreshTokenEntity ) {
		$this->query()->create(
			[
				"identifier" => $refreshTokenEntity->getIdentifier(),
				"expiry_date_time" => $refreshTokenEntity->getExpiryDateTime()->format("Y-m-d H:i:s"),
				"access_token" => $refreshTokenEntity->getAccessToken()->getIdentifier(),
			]
		)->save();
	}

	public function revokeRefreshToken( $tokenId ) {
		$this->query()->where('identifier', $tokenId)->delete_many();
	}

	public function isRefreshTokenRevoked( $tokenId ) {
		return $this->query()->where("identifier", $tokenId)->where_gt("expiry_date_time", (new \DateTimeImmutable( 'now' ))->format("Y-m-d H:i:s"))->count() === 0;
	}
}
