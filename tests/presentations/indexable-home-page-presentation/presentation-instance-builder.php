<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Home_Page_Presentation;

use Mockery;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Home_Page_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Indexable_Presentation\Presentation_Instance_Generator_Builder;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {

	use Presentation_Instance_Generator_Builder;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Home_Page_Presentation|Mockery\MockInterface
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
	protected $meta_helper;

	/**
	 * @var Mockery\Mock
	 */
	protected $image_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/** @var Url_Helper|Mockery\MockInterface */
	protected $url_helper;

	/**
	 * Builds an instance of Indexable_Home_Page_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->image_helper        = Mockery::mock( Image_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );

		$instance = Mockery::mock( Indexable_Home_Page_Presentation::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );
		$this->instance->set_helpers(
			$this->robots_helper,
			$this->image_helper,
			$this->options_helper,
			$this->current_page_helper
		);

		$this->set_instance_generators();
	}
}
