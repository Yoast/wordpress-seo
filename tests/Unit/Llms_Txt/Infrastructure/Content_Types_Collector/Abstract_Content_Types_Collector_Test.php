<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Infrastructure\Content_Types_Collector;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services\Content_Types_Collector;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Content_Types_Collector tests.
 *
 * @group llms.txt
 */
abstract class Abstract_Content_Types_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Content_Types_Collector
	 */
	protected $instance;

	/**
	 * Holds the post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Holds the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_type_helper     = Mockery::mock( Post_Type_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->indexable_helper     = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Content_Types_Collector(
			$this->post_type_helper,
			$this->options_helper,
			$this->indexable_helper,
			$this->indexable_repository
		);
	}
}
