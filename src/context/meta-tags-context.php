<?php
/**
 * Class that contains all relevant data for rendering the meta tags.
 *
 * @package Yoast\YoastSEO\Context
 */

namespace Yoast\WP\Free\Context;

use WP_Block_Parser_Block;
use WP_Post;
use WPSEO_Replace_Vars;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Schema\ID_Helper;
use Yoast\WP\Free\Helpers\Site_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Abstract_Presentation;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Meta_Tags_Context
 *
 * @property string      canonical
 * @property string      title
 * @property string      description
 * @property string      id
 * @property string      site_name
 * @property string      site_url
 * @property string      company_name
 * @property int         company_logo_id
 * @property int         site_user_id
 * @property string      site_represents
 * @property array|false site_represents_reference
 * @property bool        breadcrumbs_enabled
 * @property string      schema_page_type
 * @property string      main_schema_id
 * @property bool        open_graph_enabled
 */
class Meta_Tags_Context extends Abstract_Presentation {

	/**
	 * @var Indexable
	 */
	public $indexable;

	/**
	 * @var WP_Block_Parser_Block[]
	 */
	public $blocks;

	/**
	 * @var WP_Post
	 */
	public $post;

	/**
	 * @var Indexable_Presentation
	 */
	public $presentation;

	/**
	 * @var bool
	 */
	public $has_image = false;

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * @var Image_Helper
	 */
	private $image_helper;

	/**
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars_helper;

	/**
	 * @var Site_Helper
	 */
	private $site_helper;

	/**
	 * Meta_Tags_Context constructor.
	 *
	 * @param Options_Helper     $options_helper      The options helper.
	 * @param Url_Helper         $url_helper          The url helper.
	 * @param Image_Helper       $image_helper        The image helper.
	 * @param ID_Helper          $id_helper           The schema id helper.
	 * @param WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 * @param Site_Helper        $site_helper         The site helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Url_Helper $url_helper,
		Image_Helper $image_helper,
		ID_Helper $id_helper,
		WPSEO_Replace_Vars $replace_vars_helper,
		Site_Helper $site_helper
	) {
		$this->options_helper      = $options_helper;
		$this->url_helper          = $url_helper;
		$this->image_helper        = $image_helper;
		$this->id_helper           = $id_helper;
		$this->replace_vars_helper = $replace_vars_helper;
		$this->site_helper         = $site_helper;
	}

	/**
	 * Generates the title.
	 *
	 * @return string the title
	 */
	public function generate_title() {
		return $this->replace_vars_helper->replace( $this->presentation->title, $this->presentation->replace_vars_object );
	}

	/**
	 * Generates the description.
	 *
	 * @return string the description
	 */
	public function generate_description() {
		return $this->replace_vars_helper->replace( $this->presentation->meta_description, $this->presentation->replace_vars_object );
	}

	/**
	 * Generates the canonical.
	 *
	 * @return string the canonical
	 */
	public function generate_canonical() {
		return $this->presentation->canonical;
	}

	/**
	 * Generates the id.
	 *
	 * @return string the id
	 */
	public function generate_id() {
		return $this->indexable->object_id;
	}

	/**
	 * Generates the site name.
	 *
	 * @return string The site name.
	 */
	public function generate_site_name() {
		$site_name = $this->options_helper->get( 'website_name', '' );
		if ( $site_name !== '' ) {
			return $site_name;
		}

		return \get_bloginfo( 'name' );
	}

	/**
	 * Generates the site name from the WordPress options.
	 *
	 * @return string The site name.
	 */
	public function generate_wordpress_site_name() {
		return $this->site_helper->get_site_name();
	}

	/**
	 * Generates the site url.
	 *
	 * @return string The site url.
	 */
	public function generate_site_url() {
		return \trailingslashit( $this->url_helper->home() );
	}

	/**
	 * Generates the company name.
	 *
	 * @return string The company name.
	 */
	public function generate_company_name() {
		/**
		 * Filter: 'wpseo_schema_company_name' - Allows filtering company name
		 *
		 * @api string $company_name.
		 */
		return \apply_filters( 'wpseo_schema_company_name', $this->options_helper->get( 'company_name' ) );
	}

	/**
	 * Generates the company logo id.
	 *
	 * @return int|bool The company logo id.
	 */
	public function generate_company_logo_id() {
		$company_logo_id = $this->image_helper->get_attachment_id_from_settings( 'company_logo' );

		/**
		 * Filter: 'wpseo_schema_company_logo_id' - Allows filtering company logo id
		 *
		 * @api integer $company_logo_id.
		 */
		return \apply_filters( 'wpseo_schema_company_logo_id', $company_logo_id );
	}

	/**
	 * Generates the site user id.
	 *
	 * @return int The site user id.
	 */
	public function generate_site_user_id() {
		return (int) $this->options_helper->get( 'company_or_person_user_id', false );
	}

	/**
	 * Determines what our site represents, and grabs their values.
	 *
	 * @return string|false Person or company. False if invalid value.
	 */
	public function generate_site_represents() {
		switch ( $this->options_helper->get( 'company_or_person', false ) ) {
			case 'company':
				// Do not use a non-named company.
				if ( empty( $this->company_name ) ) {
					return false;
				}

				/*
				 * Do not use a company without a logo.
				 * This is not a false check due to how `get_attachment_id_from_settings` works.
				 */
				if ( $this->company_logo_id < 1 ) {
					$this->site_represents = false;
				}

				return 'company';
			case 'person':
				// Do not use a non-existing user.
				if ( $this->site_user_id !== false && \get_user_by( 'id', $this->site_user_id ) === false ) {
					return false;
				}

				return 'person';
		}

		return false;
	}

	/**
	 * Returns the site represents reference.
	 *
	 * @return array|bool The site represents reference. False if none.
	 */
	public function generate_site_represents_reference() {
		if ( $this->site_represents === 'person' ) {
			return [ '@id' => $this->id_helper->get_user_schema_id( $this->site_user_id, $this ) ];
		}
		if ( $this->site_represents === 'company' ) {
			return [ '@id' => $this->site_url . $this->id_helper->organization_hash ];
		}

		return false;
	}

	/**
	 * Generates whether or not breadcrumbs are enabled.
	 *
	 * @return bool Whether or not breadcrumbs are enabled.
	 */
	public function generate_breadcrumbs_enabled() {
		$breadcrumbs_enabled = \current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$breadcrumbs_enabled = $this->options_helper->get( 'breadcrumbs-enable', false );
		}

		return $breadcrumbs_enabled;
	}

	/**
	 * Returns whether or not open graph is enabled.
	 *
	 * @return bool Whether or not open graph is enabled.
	 */
	public function generate_open_graph_enabled() {
		return $this->options_helper->get( 'opengraph' ) === true;
	}

	/**
	 * Returns the schema page type.
	 *
	 * @return string|array The schema page type.
	 */
	public function generate_schema_page_type() {
		switch ( $this->indexable->object_type ) {
			case 'search-result':
				$type = 'SearchResultsPage';
				break;
			case 'author':
				$type = 'ProfilePage';
				break;
			case 'home-page':
			case 'date-archive':
			case 'term':
			case 'post-type-archive':
				$type = 'CollectionPage';
				break;
			default:
				$type = 'WebPage';
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string $type The WebPage type.
		 */
		return \apply_filters( 'wpseo_schema_webpage_type', $type );
	}

	/**
	 * Returns the main schema id.
	 *
	 * The main schema id.
	 */
	public function generate_main_schema_id() {
		return $this->canonical . $this->id_helper->webpage_hash;
	}
}

class_alias( Meta_Tags_Context::class, 'WPSEO_Schema_Context' );
