<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Table definition for the SEO Meta table.
 *
 * @property int $object_id
 * @property int $internal_link_count
 * @property int $incoming_link_count
 */
class SEO_Meta extends Yoast_Model {

	/**
	 * Overwrites the default ID column name.
	 *
	 * @var string
	 */
	public static $id_column = 'object_id';
}
