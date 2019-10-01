<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Helpers\Taxonomy_Helper;
use Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Wrappers\WP_Query_Wrapper;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Term_Archive_Presentation
	 */
	protected $instance;

	/**
	 * @var Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $robots_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $current_page_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $wp_query_wrapper;

	/**
	 * @var Mockery\Mock
	 */
	protected $taxonomy_helper;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->wp_query_wrapper    = Mockery::mock( WP_Query_Wrapper::class );
		$this->taxonomy_helper     = Mockery::mock( Taxonomy_Helper::class );

		$instance = new Indexable_Term_Archive_Presentation(
			$this->options_helper,
			$this->wp_query_wrapper,
			$this->taxonomy_helper
		);

		$this->instance = $instance->of( $this->indexable );
		$this->instance->set_helpers(
			$this->robots_helper,
			$this->current_page_helper
		);
	}
}
