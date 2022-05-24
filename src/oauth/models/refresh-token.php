<?php

namespace Yoast\WP\SEO\Models;

use Yoast\WP\Lib\Model;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\RefreshTokenEntityInterface;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\EntityTrait;
use YoastSEO_Vendor\League\OAuth2\Server\Entities\Traits\RefreshTokenTrait;

/**
 * Class Refresh_Token.
 */
class Refresh_Token extends Model implements RefreshTokenEntityInterface {

	use RefreshTokenTrait;
	use EntityTrait;

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
}
