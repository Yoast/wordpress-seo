<?php

namespace Yoast\YoastSEO\Database\Models;

use Yoast\Yoast_Model;

/**
 * @property int $object_id
 * @property int $internal_link_count
 * @property int $incoming_link_count
 */
class SEO_Meta extends Yoast_Model {
	public static $_id_column = 'object_id';
}
