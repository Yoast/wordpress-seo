<?php

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Yoast_Model;

/**
 * @property int     $id
 * @property int     $object_id
 * @property string  $object_type
 * @property string  $object_sub_type
 *
 * @property string  $created_at
 * @property string  $updated_at
 *
 * @property string  $permalink
 * @property string  $canonical
 * @property int     $content_score
 *
 * @property boolean $robots_noindex
 * @property boolean $robots_nofollow
 * @property boolean $robots_noarchive
 * @property boolean $robots_noimageindex
 * @property boolean $robots_nosnippet
 *
 * @property string  $title
 * @property string  $description
 * @property string  $breadcrumb_title
 *
 * @property boolean $cornerstone
 *
 * @property string  $og_title
 * @property string  $og_image
 * @property string  $og_description
 *
 * @property string  $twitter_title
 * @property string  $twitter_image
 * @property string  $twitter_description
 *
 * @property int     $internal_link_count
 * @property int     $incoming_link_count
 *
 * @property boolean $include_in_sitemap
 */
class Indexable extends Yoast_Model {
}
