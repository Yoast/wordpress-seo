<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Context;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

/**
 * Class Meta_Tags_Context_Mock.
 */
class Meta_Tags_Context_Mock extends Meta_Tags_Context {

	/**
	 * @var string
	 */
	public $canonical;

	/**
	 * @var string
	 */
	public $title;

	/**
	 * @var string
	 */
	public $description;

	/**
	 * @var string
	 */
	public $id;

	/**
	 * @var string
	 */
	public $site_name;

	/**
	 * @var string
	 */
	public $wordpress_site_name;

	/**
	 * @var string
	 */
	public $site_url;

	/**
	 * @var string
	 */
	public $company_name;

	/**
	 * @var int
	 */
	public $company_logo_id;

	/**
	 * @var int
	 */
	public $site_user_id;

	/**
	 * @var string
	 */
	public $site_represents;

	/**
	 * @var array|false
	 */
	public $site_represents_reference;

	/**
	 * @var bool
	 */
	public $breadcrumbs_enabled;

	/**
	 * @var string|string[]
	 */
	public $schema_page_type;

	/**
	 * @var string|string[]
	 */
	public $schema_article_type;

	/**
	 * @var string
	 */
	public $main_schema_id;

	/**
	 * @var bool
	 */
	public $open_graph_enabled = true;

	/**
	 * Meta_Tags_Context constructor.
	 */
	public function __construct() {
		// Intentionally empty.
	}
}
