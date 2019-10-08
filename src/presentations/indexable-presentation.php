<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Generators\OG_Image_Generator;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Robots_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Generators\OG_Locale_Generator;
use Yoast\WP\Free\Presentations\Generators\Schema_Generator;

/**
 * Class Indexable_Presentation
 *
 * @property string title
 * @property string meta_description
 * @property array  robots
 * @property string canonical
 * @property string og_type
 * @property string og_title
 * @property string og_description
 * @property array  og_images
 * @property string og_url
 * @property string og_article_publisher
 * @property string og_article_author
 * @property string og_article_publish_time
 * @property string og_article_modified_time
 * @property string og_locale
 * @property array  schema
 * @property string twitter_card
 * @property string twitter_title
 * @property string twitter_description
 * @property string twitter_image
 * @property array  replace_vars_object
 */
class Indexable_Presentation extends Abstract_Presentation {

	/**
	 * @var Indexable
	 */
	protected $model;

	/**
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * @var Schema_Generator
	 */
	protected $schema_generator;

	/**
	 * @var OG_Image_Generator
	 */
	protected $og_image_generator;

	/**
	 * @var OG_Locale_Generator
	 */
	private $og_locale_generator;

	/**
	 * @var Robots_Helper
	 */
	protected $robots_helper;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * @required
	 *
	 * Sets the generator dependencies.
	 *
	 * @param Schema_Generator    $schema_generator    The schema generator.
	 * @param OG_Locale_Generator $og_locale_generator The OG locale generator.
	 * @param OG_Image_Generator  $og_image_generator  The OG image generator.
	 */
	public function set_generators(
		Schema_Generator $schema_generator,
		OG_Locale_Generator $og_locale_generator,
		OG_Image_Generator $og_image_generator
	) {
		$this->schema_generator    = $schema_generator;
		$this->og_locale_generator = $og_locale_generator;
		$this->og_image_generator  = $og_image_generator;
	}

	/**
	 * @required
	 *
	 * Used by dependency injection container to inject the Robots_Helper.
	 *
	 * @param Robots_Helper       $robots_helper       The robots helper.
	 * @param Image_Helper        $image_helper        The image helper.
	 * @param Options_Helper      $options_helper      The options helper.
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 */
	public function set_helpers(
		Robots_Helper $robots_helper,
		Image_Helper $image_helper,
		Options_Helper $options_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->robots_helper       = $robots_helper;
		$this->image_helper        = $image_helper;
		$this->options_helper      = $options_helper;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Generates the title.
	 *
	 * @return string The title.
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return '';
	}

	/**
	 * Generates the meta description.
	 *
	 * @return string The meta description.
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return '';
	}

	/**
	 * Generates the robots value.
	 *
	 * @return array The robots value.
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * Generates the canonical.
	 *
	 * @return string The canonical.
	 */
	public function generate_canonical() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		return '';
	}

	/**
	 * Generates the og type.
	 *
	 * @return string The og type.
	 */
	public function generate_og_type() {
		return 'website';
	}

	/**
	 * Generates the open graph title.
	 *
	 * @return string The open graph title.
	 */
	public function generate_og_title() {
		if ( $this->model->og_title ) {
			return $this->model->og_title;
		}

		return $this->title;
	}

	/**
	 * Generates the open graph description.
	 *
	 * @return string The open graph description.
	 */
	public function generate_og_description() {
		if ( $this->model->og_description ) {
			return $this->model->og_description;
		}

		return $this->meta_description;
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( $this->context->open_graph_enabled === false ) {
			return [];
		}

		return $this->og_image_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_og_url() {
		return $this->canonical;
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_og_article_publisher() {
		return '';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_og_article_author() {
		return '';
	}

	/**
	 * Generates the open graph article publish time.
	 *
	 * @return string The open graph article publish time.
	 */
	public function generate_og_article_publish_time() {
		return '';
	}

	/**
	 * Generates the open graph article modified time.
	 *
	 * @return string The open graph article modified time.
	 */
	public function generate_og_article_modified_time() {
		return '';
	}

	/**
	 * Generates the open graph locale.
	 *
	 * @return string The open graph locale.
	 */
	public function generate_og_locale() {
		return $this->og_locale_generator->generate( $this->context );
	}

	/**
	 * Generates the open graph site name.
	 *
	 * @return string The open graph site name.
	 */
	public function generate_og_site_name() {
		return $this->context->wordpress_site_name;
	}

	/**
	 * Generates the Twitter card type.
	 *
	 * @return string The Twitter card type.
	 */
	public function generate_twitter_card() {
		return '';
	}

	/**
	 * Generates the Twitter title.
	 *
	 * @return string The Twitter title.
	 */
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		if ( $this->title ) {
			return $this->title;
		}

		return '';
	}

	/**
	 * Generates the Twitter description.
	 *
	 * @return string The Twitter description.
	 */
	public function generate_twitter_description() {
		if ( $this->model->twitter_description ) {
			return $this->model->twitter_description;
		}

		if ( $this->meta_description ) {
			return $this->meta_description;
		}

		return '';
	}

	/**
	 * Generates the Twitter image.
	 *
	 * @return string The Twitter image.
	 */
	public function generate_twitter_image() {
		if ( $this->model->twitter_image ) {
			return $this->model->twitter_image;
		}

		return '';
	}

	/**
	 * Generates the replace vars object.
	 *
	 * @return array The replace vars object.
	 */
	public function generate_replace_vars_object() {
		return [];
	}

	/**
	 * Generates the schema for the page.
	 *
	 * @return array The Schema object.
	 */
	public function generate_schema() {
		return $this->schema_generator->generate( $this->context );
	}

	/**
	 * Retrieves the attachment by a given image id.
	 *
	 * @param int $attachment_id The attachment id.
	 *
	 * @return string|false The url when found, false when not.
	 */
	protected function get_attachment_url_by_id( $attachment_id ) {
		/**
		 * Filter: 'wpseo_opengraph_image_size' - Allow overriding the image size used
		 * for OpenGraph sharing. If this filter is used, the defined size will always be
		 * used for the og:image. The image will still be rejected if it is too small.
		 *
		 * Only use this filter if you manually want to determine the best image size
		 * for the `og:image` tag.
		 *
		 * Use the `wpseo_image_sizes` filter if you want to use our logic. That filter
		 * can be used to add an image size that needs to be taken into consideration
		 * within our own logic.
		 *
		 * @api string|false $size Size string.
		 */
		$override_image_size = \apply_filters( 'wpseo_opengraph_image_size', null );

		if ( $override_image_size ) {
			return $this->image_helper->get_image( $attachment_id, $override_image_size );
		}

		$attachment = $this->image_helper->get_best_attachment_variation(
			$attachment_id,
			[
				'min_width'  => 200,
				'max_width'  => 2000,
				'min_height' => 200,
				'max_height' => 2000,
			]
		);

		return $attachment['url'];
	}

	/**
	 * Retrieves the default OpenGraph image.
	 *
	 * @return string|false The retrieved image.
	 */
	protected function get_default_og_image() {
		if ( $this->options_helper->get( 'opengraph' ) !== true ) {
			return '';
		}

		$default_image_id = $this->options_helper->get( 'og_default_image_id', '' );
		if ( $default_image_id ) {
			$attachment_url = $this->get_attachment_url_by_id( $default_image_id );
			if ( $attachment_url ) {
				return $attachment_url;
			}
		}

		$default_image_url = $this->options_helper->get( 'og_default_image', '' );
		if ( $default_image_url ) {
			return $default_image_url;
		}

		return '';
	}
}
