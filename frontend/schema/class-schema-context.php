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
 * @property int    $id                        The post ID, if there is one.
 * @property string $site_name                 The site's name.
 * @property string $site_represents           Whether this site represents a `company` or a `person`.
 * @property string $site_url                  The site's URL.
 * @property int    $site_user_id              The site's User ID if a site represents a `person`.
 * @property string $title                     Page title.
 * @property string $description               Page description.
 * @property bool   $breadcrumbs_enabled       Whether or not this site has breadcrumbs enabled.
 * @property array  $site_represents_reference A schema @id reference to the piece the site represents.
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
		$this->site_name = $this->set_site_name();
		$this->site_url  = trailingslashit( WPSEO_Utils::home_url() );

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
			$this->site_represents_reference = array( '@id' => $this->site_url . WPSEO_Schema_IDs::PERSON_HASH );
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

		if ( $this->site_represents === 'company' ) {
			$this->company_name = WPSEO_Options::get( 'company_name' );
		}

		if ( $this->site_represents === 'person' ) {
			$this->site_user_id = WPSEO_Options::get( 'company_or_person_user_id', false );
			// Do not use a non-existing user.
			if ( $this->site_user_id !== false && get_user_by( 'id', $this->site_user_id ) === false ) {
				$this->site_represents = false;
			}
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
