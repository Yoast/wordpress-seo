<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Mock
 *
 * Indexable mock class.
 */
class Indexable_Mock extends Indexable {

	public $id;

	public $object_id;

	public $object_type;

	public $object_sub_type;

	public $author_id;

	public $post_parent;

	public $created_at;

	public $updated_at;

	public $permalink;

	public $permalink_hash;

	public $canonical;

	public $is_robots_noindex;

	public $is_robots_nofollow;

	public $is_robots_noarchive;

	public $is_robots_noimageindex;

	public $is_robots_nosnippet;

	public $title;

	public $description;

	public $breadcrumb_title;

	public $is_cornerstone;

	public $primary_focus_keyword;

	public $primary_focus_keyword_score;

	public $readability_score;

	public $inclusive_language_score;

	public $link_count;

	public $incoming_link_count;

	public $number_of_pages;

	public $open_graph_title;

	public $open_graph_description;

	public $open_graph_image;

	public $open_graph_image_id;

	public $open_graph_image_source;

	public $open_graph_image_meta;

	public $twitter_title;

	public $twitter_description;

	public $twitter_image;

	public $twitter_image_id;

	public $twitter_image_source;

	public $twitter_card;

	public $prominent_words_version;

	public $is_public;

	public $is_protected;

	public $post_status;

	public $has_public_posts;

	public $blog_id;

	public $language;

	public $region;

	public $schema_page_type;

	public $schema_article_type;

	public $has_ancestors;

	public $estimated_reading_time_minutes;

	public $object_last_modified;

	public $object_published_at;

	public $version;
}
