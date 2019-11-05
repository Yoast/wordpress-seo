<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Context variables for Schema generation.
 *
 * @property string $canonical                 The current page's canonical.
 * @property string $company_name              Holds the company name, if the site represents a company.
 * @property int    $company_logo_id           Holds the company logo's ID, if the site represents a company.
 * @property int    $id                        The post ID, if there is one.
 * @property string $site_name                 The site's name.
 * @property string $site_description          The site's tagline.
 * @property string $site_represents           Whether this site represents a `company` or a `person`.
 * @property string $site_url                  The site's URL.
 * @property int    $site_user_id              The site's user ID if a site represents a `person`.
 * @property string $title                     Page title.
 * @property string $description               Page description.
 * @property bool   $breadcrumbs_enabled       Whether or not this site has breadcrumbs enabled.
 * @property array  $site_represents_reference A schema @id reference to the piece the site represents.
 * @property bool   $has_image                 A boolean that determines whether the current URL has a primary image.
 *
 * @since 10.2
 */
class WPSEO_Schema_Context {

	/**
	 * The current page's canonical.
	 *
	 * @var string
	 */
	public $canonical;

	/**
	 * Holds the company name, if the site represents a company.
	 *
	 * @var string
	 */
	public $company_name;

	/**
	 * Holds the company logo's ID, if the site represents a company.
	 *
	 * @var int
	 */
	public $company_logo_id;

	/**
	 * The queried object ID, if there is one.
	 *
	 * @var int
	 */
	public $id;

	/**
	 * Whether this site represents a `company` or a `person`.
	 *
	 * @var string
	 */
	public $site_represents;

	/**
	 * The site's Name.
	 *
	 * @var string
	 */
	public $site_name;

	/**
	 * The site's tagline.
	 *
	 * @var string
	 */
	public $site_description;

	/**
	 * The site's URL.
	 *
	 * @var string
	 */
	public $site_url;

	/**
	 * Page title.
	 *
	 * @var string
	 */
	public $title;

	/**
	 * User ID when the site represents a Person.
	 *
	 * @var int
	 */
	public $site_user_id;

	/**
	 * Page description.
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Whether or not this site has breadcrumbs enabled.
	 *
	 * @var bool
	 */
	public $breadcrumbs_enabled;

	/**
	 * A schema @id reference to the piece the site represents.
	 *
	 * @var array
	 */
	public $site_represents_reference;

	/**
	 * A boolean that determines whether the current URL has a primary image.
	 *
	 * @var bool
	 */
	public $has_image = false;

	/**
	 * WPSEO_Schema_Context constructor.
	 */
	public function __construct() {
		$this->build_data();
	}

	/**
	 * Builds all the required data for the context object.
	 */
	private function build_data() {
		// Page level variables.
		$front             = WPSEO_Frontend::get_instance();
		$this->canonical   = $front->canonical( false, false, true );
		$this->title       = $front->title( '' );
		$this->description = $front->metadesc( false );
		$this->id          = get_queried_object_id();

		// Site level variables.
		$this->site_name 		= $this->set_site_name();
		$this->site_description = get_bloginfo( 'description' );
		$this->site_url  		= trailingslashit( WPSEO_Utils::home_url() );

		$this->set_breadcrumbs_variables();
		$this->set_site_represents_variables();
		$this->set_site_represents_reference();
	}

	/**
	 * Retrieves the site's name from settings.
	 *
	 * @return string
	 */
	private function set_site_name() {
		if ( '' !== WPSEO_Options::get( 'website_name', '' ) ) {
			return WPSEO_Options::get( 'website_name' );
		}

		return get_bloginfo( 'name' );
	}

	/**
	 * Sets our site represents reference for easy use.
	 */
	private function set_site_represents_reference() {
		$this->site_represents_reference = false;

		if ( $this->site_represents === 'person' ) {
			$this->site_represents_reference = array( '@id' => WPSEO_Schema_Utils::get_user_schema_id( $this->site_user_id, $this ) );
		}

		if ( $this->site_represents === 'company' ) {
			$this->site_represents_reference = array( '@id' => $this->site_url . WPSEO_Schema_IDs::ORGANIZATION_HASH );
		}
	}

	/**
	 * Determines what our site represents, and grabs their values.
	 */
	private function set_site_represents_variables() {
		$this->site_represents = WPSEO_Options::get( 'company_or_person', false );

		switch ( $this->site_represents ) {
			case 'company':
				$company_name = WPSEO_Options::get( 'company_name' );

				/**
				 * Filter: 'wpseo_schema_company_name' - Allows filtering company name
				 *
				 * @api string $company_name.
				 */
				$this->company_name = apply_filters( 'wpseo_schema_company_name', $company_name );

				// Do not use a non-named company.
				if ( empty( $this->company_name ) ) {
					$this->site_represents = false;
					break;
				}

				$company_logo_id = WPSEO_Image_Utils::get_attachment_id_from_settings( 'company_logo' );

				/**
				 * Filter: 'wpseo_schema_company_logo_id' - Allows filtering company logo id
				 *
				 * @api integer $company_logo_id.
				 */
				$this->company_logo_id = apply_filters( 'wpseo_schema_company_logo_id', $company_logo_id );

				/*
				 * Do not use a company without a logo.
				 * This is not a false check due to how `get_attachment_id_from_settings` works.
				 */
				if ( $this->company_logo_id < 1 ) {
					$this->site_represents = false;
				}
				break;
			case 'person':
				$this->site_user_id = WPSEO_Options::get( 'company_or_person_user_id', false );
				// Do not use a non-existing user.
				if ( $this->site_user_id !== false && get_user_by( 'id', $this->site_user_id ) === false ) {
					$this->site_represents = false;
				}
				break;
		}
	}

	/**
	 * Determines whether the site uses Yoast SEO breadcrumbs.
	 */
	private function set_breadcrumbs_variables() {
		$this->breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $this->breadcrumbs_enabled ) {
			$this->breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}
	}
}
