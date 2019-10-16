<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Generators\Twitter_Image_Generator;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Mocks\Meta_Tags_Context;

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
	 * @var Indexable_Presentation|Mockery\MockInterface
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
	protected $image_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * @var OG_Image_Helper|Mockery\MockInterface
	 */
	protected $og_image_helper;

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url_helper;

	/**
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user;

	/**
	 * @var Meta_Tags_Context|Mockery\MockInterface
	 */
	protected $context;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $og_image_generator;

	/**
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image_generator;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function setInstance() {
		$this->indexable = new Indexable();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->image_helper        = Mockery::mock( Image_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->og_image_helper     = Mockery::mock( OG_Image_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->user                = Mockery::mock( User_Helper::class );

		$this->context = Mockery::mock( Meta_Tags_Context::class );

		$instance = Mockery::mock( Indexable_Presentation::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance = $instance->of(
			[
				'model'   => $this->indexable,
				'context' => $this->context,
			]
		);

		$this->instance->set_helpers(
			$this->robots_helper,
			$this->image_helper,
			$this->options_helper,
			$this->current_page_helper,
			$this->user
		);

		$this->set_instance_generators();

		$this->context->indexable = $this->indexable;
	}

}
