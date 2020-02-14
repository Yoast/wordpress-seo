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
 * @property int    $id
 * @property string $url
 * @property int    $post_id
 * @property int    $target_post_id
 * @property string $type
 */
class SEO_Links extends Yoast_Model {
}
