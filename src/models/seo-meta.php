<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\SEO\ORM\Yoast_Model;

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

	/**
	 * Which columns contain int values.
	 *
	 * @var array
	 */
	protected $int_columns = [
		'object_id',
		'internal_link_count',
		'incoming_link_count',
	];
}
