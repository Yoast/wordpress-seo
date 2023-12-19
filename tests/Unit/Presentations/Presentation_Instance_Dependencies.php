<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations;

use Mockery;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Image_Generator;
use Yoast\WP\SEO\Generators\Open_Graph_Locale_Generator;
use Yoast\WP\SEO\Generators\Schema_Generator;
use Yoast\WP\SEO\Generators\Twitter_Image_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Values_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

trait Presentation_Instance_Dependencies {

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * Holds the image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * Holds the url helper.
	 *
	 * @var Url_Helper|Mockery\MockInterface
	 */
	protected $url;

	/**
	 * Holds the current page helper.
	 *
	 * @var Current_Page_Helper|Mockery\MockInterface
	 */
	protected $current_page;

	/**
	 * Holds the user helper.
	 *
	 * @var User_Helper|Mockery\MockInterface
	 */
	protected $user;

	/**
	 * Holds the indexable helper.
	 *
	 * @var Indexable_Helper|Mockery\MockInterface
	 */
	protected $indexable_helper;

	/**
	 * Holds the permalink helper.
	 *
	 * @var Permalink_Helper|Mockery\MockInterface
	 */
	protected $permalink_helper;

	/**
	 * Holds the values helper.
	 *
	 * @var Values_Helper|Mockery\MockInterface
	 */
	protected $values_helper;

	/**
	 * Holds the opengraph image helper.
	 *
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image;

	/**
	 * Holds the twitter image helper.
	 *
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter;

	/**
	 * Holds the open open graph image generator.
	 *
	 * @var Open_Graph_Image_Generator|Mockery\MockInterface
	 */
	protected $open_graph_image_generator;

	/**
	 * Holds the twitter image generator.
	 *
	 * @var Twitter_Image_Generator|Mockery\MockInterface
	 */
	protected $twitter_image_generator;

	/**
	 * Helper function for setting helpers of the base indexable presentation.
	 *
	 * @param Indexable_Presentation $presentation_instance The indexable presentation instance.
	 *
	 * @return void
	 */
	protected function set_instance_dependencies( Indexable_Presentation $presentation_instance ) {
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->image            = Mockery::mock( Image_Helper::class );
		$this->current_page     = Mockery::mock( Current_Page_Helper::class );
		$this->url              = Mockery::mock( Url_Helper::class );
		$this->user             = Mockery::mock( User_Helper::class );
		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->permalink_helper = Mockery::mock( Permalink_Helper::class );
		$this->values_helper    = Mockery::mock( Values_Helper::class );
		$this->open_graph_image = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter          = Mockery::mock( Twitter_Image_Helper::class );

		$presentation_instance->set_helpers(
			$this->image,
			$this->options,
			$this->current_page,
			$this->url,
			$this->user,
			$this->indexable_helper,
			$this->permalink_helper,
			$this->values_helper
		);

		$this->open_graph_image_generator = Mockery::mock(
			Open_Graph_Image_Generator::class,
			[
				$this->open_graph_image,
				$this->image,
				$this->options,
				$this->url,
			]
		);

		$this->twitter_image_generator = Mockery::mock(
			Twitter_Image_Generator::class,
			[
				$this->image,
				$this->url,
				$this->twitter,
			]
		);

		$presentation_instance->set_generators(
			Mockery::mock( Schema_Generator::class ),
			new Open_Graph_Locale_Generator(),
			$this->open_graph_image_generator,
			$this->twitter_image_generator,
			Mockery::mock( Breadcrumbs_Generator::class )
		);
	}
}
