<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Context;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Class Meta_Tags_Context_Mock.
 */
class Meta_Tags_Context_Mock extends Meta_Tags_Context {

	public $canonical;

	public $permalink;

	public $title;

	public $description;

	public $id;

	public $site_name;

	public $alternate_site_name;

	public $wordpress_site_name;

	public $site_url;

	public $company_name;

	public $company_alternate_name;

	public $company_logo_id;

	public $company_logo_meta;

	public $person_logo_id;

	public $person_logo_meta;

	public $site_user_id;

	public $site_represents;

	public $site_represents_reference;

	public $schema_page_type;

	public $schema_article_type;

	public $main_schema_id;

	public $main_entity_of_page;

	public $open_graph_enabled = true;

	public $open_graph_publisher;

	public $twitter_card;

	public $page_type;

	public $has_article;

	public $has_image;

	public $main_image_id;

	public $main_image_url;

	/**
	 * Meta_Tags_Context constructor.
	 */
	public function __construct() {
		// Intentionally empty.
	}
}
