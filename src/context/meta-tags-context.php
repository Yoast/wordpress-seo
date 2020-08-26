<?php
/**
 * Class that contains all relevant data for rendering the meta tags.
 *
 * @package Yoast\YoastSEO\Context
 */

namespace Yoast\WP\SEO\Context;

use WP_Block_Parser_Block;
use WP_Post;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Abstract_Presentation;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Meta_Tags_Context
 *
 * @property string      $canonical
 * @property string      $title
 * @property string      $description
 * @property string      $id
 * @property string      $site_name
 * @property string      $wordpress_site_name
 * @property string      $site_url
 * @property string      $company_name
 * @property int         $company_logo_id
 * @property int         $site_user_id
 * @property string      $site_represents
 * @property array|false $site_represents_reference
 * @property bool        $breadcrumbs_enabled
 * @property string      schema_page_type
 * @property string      $main_schema_id
 * @property bool        $open_graph_enabled
 * @property string      $open_graph_publisher
 * @property string      $twitter_card
 * @property string      $page_type
 */
class Meta_Tags_Context extends Abstract_Presentation {

	/**
	 * The indexable.
	 *
	 * @var Indexable
	 */
	public $indexable;

	/**
	 * The WP Block Parser Block.
	 *
	 * @var WP_Block_Parser_Block[]
	 */
	public $blocks;

	/**
	 * The WP Post.
	 *
	 * @var WP_Post
	 */
	public $post;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	public $presentation;

	/**
	 * Whether or not the indexable has an image.
	 *
	 * @var bool
	 */
	public $has_image = false;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	private $id_helper;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The site helper.
	 *
	 * @var Site_Helper
	 */
	private $site;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	private $user;

	/**
	 * Meta_Tags_Context constructor.
	 *
	 * @param Options_Helper     $options      The options helper.
	 * @param Url_Helper         $url          The url helper.
	 * @param Image_Helper       $image        The image helper.
	 * @param ID_Helper          $id_helper    The schema id helper.
	 * @param WPSEO_Replace_Vars $replace_vars The replace vars helper.
	 * @param Site_Helper        $site         The site helper.
	 * @param User_Helper        $user         The user helper.
	 */
	public function __construct(
		Options_Helper $options,
		Url_Helper $url,
		Image_Helper $image,
		ID_Helper $id_helper,
		WPSEO_Replace_Vars $replace_vars,
		Site_Helper $site,
		User_Helper $user
	) {
		$this->options      = $options;
		$this->url          = $url;
		$this->image        = $image;
		$this->id_helper    = $id_helper;
		$this->replace_vars = $replace_vars;
		$this->site         = $site;
		$this->user         = $user;
	}

	/**
	 * Generates the title.
	 *
	 * @return string the title
	 */
	public function generate_title() {
		return $this->replace_vars->replace( $this->presentation->title, $this->presentation->source );
	}

	/**
	 * Generates the description.
	 *
	 * @return string the description
	 */
	public function generate_description() {
		return $this->replace_vars->replace( $this->presentation->meta_description, $this->presentation->source );
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
		$site_name = $this->options->get( 'website_name', '' );
		if ( $site_name !== '' ) {
			return $site_name;
		}

		return \get_bloginfo( 'name' );
	}

	/**
	 * Generates the site name from the WordPress options.
	 *
	 * @return string The site name from the WordPress options.
	 */
	public function generate_wordpress_site_name() {
		return $this->site->get_site_name();
	}

	/**
	 * Generates the site url.
	 *
	 * @return string The site url.
	 */
	public function generate_site_url() {
		return \trailingslashit( $this->url->home() );
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
		return \apply_filters( 'wpseo_schema_company_name', $this->options->get( 'company_name' ) );
	}

	/**
	 * Generates the company logo id.
	 *
	 * @return int|bool The company logo id.
	 */
	public function generate_company_logo_id() {
		$company_logo_id = $this->image->get_attachment_id_from_settings( 'company_logo' );

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
		return (int) $this->options->get( 'company_or_person_user_id', false );
	}

	/**
	 * Determines what our site represents, and grabs their values.
	 *
	 * @return string|false Person or company. False if invalid value.
	 */
	public function generate_site_represents() {
		switch ( $this->options->get( 'company_or_person', false ) ) {
			case 'company':
				// Do not use a non-named company.
				if ( empty( $this->company_name ) ) {
					return false;
				}

				/*
				 * Do not use a company without a logo.
				 * The logic check is on `< 1` instead of `false` due to how `get_attachment_id_from_settings` works.
				 */
				if ( $this->company_logo_id < 1 ) {
					return false;
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
			return [ '@id' => $this->site_url . Schema_IDs::ORGANIZATION_HASH ];
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
			$breadcrumbs_enabled = $this->options->get( 'breadcrumbs-enable', false );
		}

		return $breadcrumbs_enabled;
	}

	/**
	 * Returns whether or not open graph is enabled.
	 *
	 * @return bool Whether or not open graph is enabled.
	 */
	public function generate_open_graph_enabled() {
		return $this->options->get( 'opengraph' ) === true;
	}

	/**
	 * Returns the open graph publisher.
	 *
	 * @return string The open graph publisher.
	 */
	public function generate_open_graph_publisher() {
		if ( $this->site_represents === 'company' ) {
			return $this->options->get( 'facebook_site', '' );
		}
		if ( $this->site_represents === 'person' ) {
			return $this->user->get_the_author_meta( 'facebook', $this->site_user_id );
		}

		return $this->options->get( 'facebook_site', '' );
	}

	/**
	 * Returns the twitter card type.
	 *
	 * @return string The twitter card type.
	 */
	public function generate_twitter_card() {
		return $this->options->get( 'twitter_card_type' );
	}

	/**
	 * Returns the schema page type.
	 *
	 * @return string|array The schema page type.
	 */
	public function generate_schema_page_type() {
		switch ( $this->indexable->object_type ) {
			case 'system-page':
				switch ( $this->indexable->object_sub_type ) {
					case 'search-result':
						$type = [ 'CollectionPage', 'SearchResultsPage' ];
						break;
					default:
						$type = 'WebPage';
				}
				break;
			case 'user':
				$type = 'ProfilePage';
				break;
			case 'home-page':
			case 'date-archive':
			case 'term':
			case 'post-type-archive':
				$type = 'CollectionPage';
				break;
			default:
				$additional_type = $this->indexable->schema_page_type;
				if ( \is_null( $additional_type ) ) {
					$additional_type = $this->options->get( 'schema-page-type-' . $this->indexable->object_sub_type );
				}

				$type = [ 'WebPage', $additional_type ];

				// Is this indexable set as a page for posts, e.g. in the wordpress reading settings as a static homepage?
				if ( (int) \get_option( 'page_for_posts' ) === $this->indexable->object_id ) {
					$type[] = 'CollectionPage';
				}

				// Ensure we get only unique values, and remove the index.
				$type = \array_values( \array_unique( $type ) );
		}

		/**
		 * Filter: 'wpseo_schema_webpage_type' - Allow changing the WebPage type.
		 *
		 * @api string|array $type The WebPage type.
		 */
		return \apply_filters( 'wpseo_schema_webpage_type', $type );
	}

	/**
	 * Returns the schema article type.
	 *
	 * @return string|array The schema article type.
	 */
	public function generate_schema_article_type() {
		$additional_type = $this->indexable->schema_article_type;
		if ( \is_null( $additional_type ) ) {
			$additional_type = $this->options->get( 'schema-article-type-' . $this->indexable->object_sub_type );
		}

		$type = 'Article';

		/*
		 * If `None` is set (either on the indexable or as a default), set type to 'None'.
		 * This simplifies is_needed checks downstream.
		 */
		if ( $additional_type === 'None' ) {
			$type = $additional_type;
		}

		if ( $additional_type !== $type ) {
			$type = [ $type, $additional_type ];
		}

		/**
		 * Filter: 'wpseo_schema_article_type' - Allow changing the Article type.
		 *
		 * @param string|string[] $type      The Article type.
		 * @param Indexable       $indexable The indexable.
		 */
		return \apply_filters( 'wpseo_schema_article_type', $type, $this->indexable );
	}

	/**
	 * Returns the main schema id.
	 *
	 * The main schema id.
	 */
	public function generate_main_schema_id() {
		return $this->canonical . Schema_IDs::WEBPAGE_HASH;
	}

	/**
	 * Strips all nested dependencies from the debug info.
	 *
	 * @return array
	 */
	public function __debugInfo() {
		return [
			'indexable'    => $this->indexable,
			'presentation' => $this->presentation,
		];
	}
}

\class_alias( Meta_Tags_Context::class, 'WPSEO_Schema_Context' );
