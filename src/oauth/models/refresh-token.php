<?php

namespace Yoast\WP\SEO\Models;

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\RefreshTokenTrait;

class Refresh_Token extends Model implements RefreshTokenEntityInterface {

	use RefreshTokenTrait;
	use EntityTrait;

	protected $uses_timestamps = true;

	public static $id_column = "identifier";
}
