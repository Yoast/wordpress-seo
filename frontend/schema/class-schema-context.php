<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Context variables for Schema generation.
 *
 * @property string $canonical           The current page's canonical.
 * @property string $company_name        Holds the company name, if the site represents a company.
 * @property int    $id                  The post ID, if there is one.
 * @property string $site_name           The site's name.
 * @property string $site_represents     Whether this site represents a `company` or a `person`.
 * @property string $site_url            The site's URL.
 * @property string $title               Page title.
 * @property string $description         Page description.
 * @property bool   $breadcrumbs_enabled Whether or not this site has breadcrumbs enabled.
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
	 * WPSEO_Schema_Context constructor.
	 */
	public function __construct() {
		$this->breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $this->breadcrumbs_enabled ) {
			$this->breadcrumbs_enabled = WPSEO_Options::get( 'breadcrumbs-enable', false );
		}

		$front             = WPSEO_Frontend::get_instance();
		$this->canonical   = $front->canonical( false );
		$this->title       = $front->title( '' );
		$this->description = $front->metadesc( false );

		$this->site_name       = $this->set_site_name();
		$this->site_represents = WPSEO_Options::get( 'company_or_person', '' );
		$this->site_url        = trailingslashit( WPSEO_Utils::home_url() );

		if ( $this->site_represents == 'company' ) {
			$this->company_name = WPSEO_Options::get( 'company_name' );
		}

		$this->id = get_queried_object_id();
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
}