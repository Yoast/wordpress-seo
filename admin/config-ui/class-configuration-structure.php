<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Structure
 */
class WPSEO_Configuration_Structure {

	/** @var array Registered steps */
	protected $steps = array();

	/**
	 * WPSEO_Configuration_Structure constructor.
	 */
	public function __construct() {

		$this->add_step( 'intro', 'Intro', array(
			'upsellConfigurationService',
			'mailchimpSignup',
		) );
		$this->add_step( 'environment', 'Environment', array( 'environment' ) );
		$this->add_step( 'siteType', 'Site type', array( 'siteType' ) );
		$this->add_step( 'publishingEntity', 'Company or person', array( 'publishingEntity' ) );
		$this->add_step( 'profileUrls', 'Social profiles', array(
			'profileUrlFacebook',
			'profileUrlTwitter',
			'profileUrlInstagram',
			'profileUrlLinkedIn',
			'profileUrlMySpace',
			'profileUrlPinterest',
			'profileUrlYouTube',
			'profileUrlGooglePlus',
		) );

		$fields = array( 'postTypeVisibility' );

		$post_type_factory = new WPSEO_Config_Factory_Post_Type();
		foreach ( $post_type_factory->get_fields() as $post_type_field ) {
			$fields[] = $post_type_field->get_identifier();
		}
		$this->add_step( 'postTypeVisibility', 'Post type visibility', $fields );

		$this->add_step( 'multipleAuthors', 'Multiple authors', array( 'multipleAuthors' ) );
		$this->add_step( 'connectGoogleSearchConsole', 'Google Search Console', array( 'connectGoogleSearchConsole' ) );
		$this->add_step( 'titleTemplate', 'Title settings', array(
			'siteName',
			'separator',
		) );
		$this->add_step( 'tagLine', 'Tagline', array( 'tagLine' ) );
		$this->add_step( 'success', 'Success!', array(
			'successMessage',
			'upsellSiteReview',
			'mailchimpSignup',
		) );
	}

	/**
	 * Add a step to the structure
	 *
	 * @param string $identifier Identifier for this step.
	 * @param string $title      Title to display for this step.
	 * @param array  $fields     Fields to use on the step.
	 */
	protected function add_step( $identifier, $title, $fields ) {
		$this->steps[ $identifier ] = array(
			'title'  => $title,
			'fields' => $fields,
		);
	}

	/**
	 * Retrieve the registered steps
	 *
	 * @return array
	 */
	public function retrieve() {
		return $this->steps;
	}
}
