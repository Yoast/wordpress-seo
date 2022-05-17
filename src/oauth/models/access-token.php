<?php

namespace Yoast\WP\SEO\Models;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\AccessTokenTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\TokenEntityTrait;
use Yoast\WP\Lib\Model;

class Access_Token extends Model implements AccessTokenEntityInterface {

	use TokenEntityTrait;
	use EntityTrait;
	use AccessTokenTrait;

	protected $uses_timestamps = true;

	public static $id_column = "identifier";

	protected $int_columns = [
		"user_identifier",
	];

}
