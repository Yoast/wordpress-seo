<?php

namespace Yoast\WP\SEO\Models;

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\AuthCodeTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\TokenEntityTrait;

class Auth_Token extends Model implements AuthCodeEntityInterface {

	use EntityTrait;
	use TokenEntityTrait;
	use AuthCodeTrait;

	protected $uses_timestamps = true;

	public static $id_column = "identifier";

	protected $int_columns = [
		"user_identifier",
	];

}
