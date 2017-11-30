<?php

namespace Yoast\YoastSEO\Database\Models;

use Yoast\Yoast_Model;

/**
 * @property int    $id
 * @property int    $object_id
 * @property string $object_type
 * @property string $object_sub_type
 *
 * @property string $modified_date_gmt
 *
 * @property string $permalink
 * @property string $canonical
 * @property int    $content_score
 *
 * @property string $robots_advanced
 * @property string $robots_noindex
 * @property string $robots_nofollow
 *
 * @property string $title
 * @property string $description
 * @property string $breadcrumb_title
 *
 * @property int    $cornerstone
 *
 * @property string $og_title
 * @property string $og_image_url
 * @property string $og_description
 *
 * @property string $twitter_title
 * @property string $twitter_image_url
 * @property string $twitter_description
 *
 * @property int $internal_link_count
 * @property int $incoming_link_count
 *
 * @property int $sitemap_exclude
 */
class Indexable extends Yoast_Model {
}
