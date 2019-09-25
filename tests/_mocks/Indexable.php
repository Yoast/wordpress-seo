<?php
namespace Yoast\WP\Free\Tests\Mocks;
/**
 * Class Indexable
 *
 * Indexable mock class.
 *
 * @package Yoast\WP\Free\Tests\Mocks
 */
class Indexable extends \Yoast\WP\Free\Models\Indexable {
	public $id;
	public $object_id;
	public $object_type;
	public $object_sub_type;
	public $created_at;
	public $updated_at;
	public $permalink;
	public $permalink_hash;
	public $canonical;
	public $content_score;
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
	public $link_count;
	public $incoming_link_count;
	public $og_title;
	public $og_description;
	public $og_image;
	public $twitter_title;
	public $twitter_description;
	public $twitter_image;
}
