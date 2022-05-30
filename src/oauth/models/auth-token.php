<?php

namespace Yoast\WP\SEO\Models;

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\AuthCodeEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\AuthCodeTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\TokenEntityTrait;

/**
 * Class Auth_Token.
 */
class Auth_Token extends Model implements AuthCodeEntityInterface {

	use EntityTrait;
	use TokenEntityTrait;
	use AuthCodeTrait;

	/**
	 * Whether nor this model uses timestamps.
	 *
	 * @var bool
	 */
	protected $uses_timestamps = true;

	/**
	 * The ID column of this model.
	 *
	 * @var string
	 */
	public static $id_column = 'identifier';

	/**
	 * Which columns contain int values.
	 *
	 * @var string[]
	 */
	protected $int_columns = [
		'user_identifier',
	];

}
