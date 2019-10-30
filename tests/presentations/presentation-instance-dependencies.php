<?php

namespace Yoast\WP\Free\Tests\Presentations;

use Mockery;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Generators\Twitter_Image_Generator;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Helpers\User_Helper;
use Yoast\WP\Free\Presentations\Generators\OG_Locale_Generator;
use Yoast\WP\Free\Presentations\Generators\Schema_Generator;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;

trait Presentation_Instance_Dependencies {

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options_helper;

	/**
	 * @var Robots_Helper|Mockery\MockInterface
	 */
	protected $robots_helper;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url_helper;

	/**
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page_helper;

	/**
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user_helper;

	/**
	 * @var OG_Image_Helper|Mockery\MockInterface
	 */
	protected $og_image_helper;

	/**
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter_helper;

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper|Mockery\MockInterface
	 */
	protected $pagination;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $og_image_generator;

	/**
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image_generator;

	/**
	 * Helper function for setting helpers of the base indexable presentation.
	 *
	 * @param Indexable_Presentation $presentation_instance The indexable presentation instance.
	 */
	protected function set_instance_dependencies( Indexable_Presentation $presentation_instance ) {
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->robots_helper       = Mockery::mock( Robots_Helper::class );
		$this->image_helper        = Mockery::mock( Image_Helper::class );
		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->og_image_helper     = Mockery::mock( OG_Image_Helper::class );
		$this->twitter_helper      = Mockery::mock( Twitter_Image_Helper::class );
		$this->pagination          = Mockery::mock( Pagination_Helper::class );

		$presentation_instance->set_helpers(
			$this->robots_helper,
			$this->image_helper,
			$this->options_helper,
			$this->current_page_helper,
			$this->url_helper,
			$this->user_helper,
			$this->pagination
		);

		$this->og_image_generator = Mockery::mock(
			OG_Image_Generator::class,
			[
				$this->og_image_helper,
				$this->image_helper,
				$this->options_helper,
				$this->url_helper,
			]
		);

		$this->twitter_image_generator = Mockery::mock(
			Twitter_Image_Generator::class,
			[
				$this->image_helper,
				$this->url_helper,
				$this->twitter_helper,
			]
		);

		$presentation_instance->set_generators(
			Mockery::mock( Schema_Generator::class ),
			new OG_Locale_Generator(),
			$this->og_image_generator,
			$this->twitter_image_generator
		);
	}
}
