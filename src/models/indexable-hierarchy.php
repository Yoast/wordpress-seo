<?php
/**
 * Model for the Indexable Hierarchy table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Indexable Hierarchy model definition.
 *
 * @property int $indexable_id The ID of the indexable.
 * @property int $ancestor_id  The ID of the indexable's ancestor.
 * @property int $depth        The depth of the ancestry. 1 being a parent, 2 being a grandparent etc.
 * @property int $blog_id      Blog ID.
 */
class Indexable_Hierarchy extends Yoast_Model {

	/**
	 * Which columns contain int values.
	 *
	 * @var array
	 */
	protected $int_columns = [
		'indexable_id',
		'ancestor_id',
		'depth',
		'blog_id',
	];
}
