<?php
/**
 * Model for the Primary Term table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Yoast_Model;

/**
 * Primary Term model definition.
 *
 * @property int    $id       Identifier.
 * @property int    $post_id  Post ID.
 * @property int    $term_id  Term ID.
 * @property string $taxonomy Taxonomy.
 */
class Primary_Term extends Yoast_Model {
}
