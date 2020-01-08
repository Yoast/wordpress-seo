<?php
/**
 * Model for the Primary Term table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Primary Term model definition.
 *
 * @property int    $id       Identifier.
 * @property int    $post_id  Post ID.
 * @property int    $term_id  Term ID.
 * @property string $taxonomy Taxonomy.
 *
 * @property string $created_at
 * @property string $updated_at
 */
class Primary_Term extends Yoast_Model {

	/**
	 * Whether nor this model uses timestamps.
	 *
	 * @var bool
	 */
	protected $uses_timestamps = true;
}
