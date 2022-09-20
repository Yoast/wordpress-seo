<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Context;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Class Meta_Tags_Context_Mock.
 */
class Meta_Tags_Context_Mock extends Meta_Tags_Context {

	/**
	 * Represents the canonical.
	 *
	 * @var string
	 */
	public $canonical;

	/**
	 * Represents the permalink.
	 *
	 * @var string
	 */
	public $permalink;

	/**
	 * Represents the title.
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Represents the meta description.
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Represents the id.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * Represents the site name.
	 *
	 * @var string
	 */
	public $site_name;

	/**
	 * Represents the site name set in WordPress.
	 *
	 * @var string
	 */
	public $wordpress_site_name;

	/**
	 * Represents the site url.
	 *
	 * @var string
	 */
	public $site_url;

	/**
	 * Represents the company name.
	 *
	 * @var string
	 */
	public $company_name;

	/**
	 * Represents the id of the company logo
	 *
	 * @var int
	 */
	public $company_logo_id;

	/**
	 * Represents the site user id.
	 *
	 * @var int
	 */
	public $site_user_id;

	/**
	 * Representation of the site.
	 *
	 * @var string
	 */
	public $site_represents;

	/**
	 * Represents the one that is represented by the site.
	 *
	 * @var array|false
	 */
	public $site_represents_reference;

	/**
	 * Represents the page type in schema output.
	 *
	 * @var string|string[]
	 */
	public $schema_page_type;

	/**
	 * Represents the type of article.
	 *
	 * @var string|string[]
	 */
	public $schema_article_type;

	/**
	 * Represents the main schema id.
	 *
	 * @var string
	 */
	public $main_schema_id;

	/**
	 * Represents the enabled state of open-graph.
	 *
	 * @var bool
	 */
	public $open_graph_enabled = true;

	/**
	 * Represents the meta image ID.
	 *
	 * @var int
	 */
	public $main_image_id;

	/**
	 * Represents the meta image URL.
	 *
	 * @var string
	 */
	public $main_image_url;

	/**
	 * Meta_Tags_Context constructor.
	 */
	public function __construct() {
		// Intentionally empty.
	}
}
