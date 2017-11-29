<?php

namespace Yoast\YoastSEO\Models;

use Model;

/**
 * @property int $object_id
 * @property int $internal_link_count
 * @property int $incoming_link_count
 */
class SEO_Meta extends Model {
	public static $_table;
	public static $_id_column = 'object_id';
}
