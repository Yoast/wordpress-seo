<?php

namespace Yoast\WP\SEO\Models;

use YoastSEO_Vendor\League\OAuth2\Server\Entities\AccessTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\AccessTokenTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\TokenEntityTrait;
use Yoast\WP\Lib\Model;

/**
 * Class Access_Token.
 */
class Access_Token extends Model implements AccessTokenEntityInterface {

	use TokenEntityTrait;
	use EntityTrait;
	use AccessTokenTrait;

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
