<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Post_Meta_Rest_Fields;

use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Initializers\Post_Meta_Rest_Fields;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Post_Meta_Rest_Fields tests.
 */
abstract class Abstract_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Post_Meta_Rest_Fields
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Post_Meta_Rest_Fields(
			Mockery::mock( Primary_Term_Helper::class ),
			Mockery::mock( Taxonomy_Helper::class ),
			Mockery::mock( Options_Helper::class ),
			Mockery::mock( Capability_Helper::class ),
			Mockery::mock( Post_Type_Helper::class ),
		);
	}
}
