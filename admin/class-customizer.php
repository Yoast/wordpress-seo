<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Customizer
 */

/**
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 */
class WPSEO_Customizer {

	/**
	 * @var WP_Customize_Manager
	 */
	protected $wp_customize;

	/**
	 * Construct Method.
	 */
	public function __construct() {
		add_action( 'customize_register', array( $this, 'wpseo_customize_register' ) );
	}

	/**
	 * Function to support WordPress Customizer
	 *
	 * @param WP_Customize_Manager $wp_customize Manager class instance.
	 */
	public function wpseo_customize_register( $wp_customize ) {
		if ( ! WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		$this->wp_customize = $wp_customize;

		$this->breadcrumbs_section();
		$this->breadcrumbs_blog_remove_setting();
		$this->breadcrumbs_separator_setting();
		$this->breadcrumbs_home_setting();
		$this->breadcrumbs_prefix_setting();
		$this->breadcrumbs_archiveprefix_setting();
		$this->breadcrumbs_searchprefix_setting();
		$this->breadcrumbs_404_setting();
	}

	/**
	 * Add the breadcrumbs section to the customizer
	 */
	private function breadcrumbs_section() {
		$section_args = array(
			/* translators: %s is the name of the plugin */
			'title'           => sprintf( __( '%s Breadcrumbs', 'wordpress-seo' ), 'Yoast SEO' ),
			'priority'        => 999,
			'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
		);

		$this->wp_customize->add_section( 'wpseo_breadcrumbs_customizer_section', $section_args );
	}

	/**
	 * Returns whether or not the breadcrumbs are active
	 *
	 * @return bool
	 */
	public function breadcrumbs_active_callback() {
		return true === ( current_theme_supports( 'yoast-seo-breadcrumbs' ) || WPSEO_Options::get( 'breadcrumbs-enable' ) );
	}

	/**
	 * Adds the breadcrumbs remove blog checkbox
	 */
	private function breadcrumbs_blog_remove_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-display-blog-page]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-display-blog-page', array(
					'label'           => __( 'Remove blog page from breadcrumbs', 'wordpress-seo' ),
					'type'            => 'checkbox',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_titles[breadcrumbs-display-blog-page]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_blog_remove_active_cb' ),
				)
			)
		);
	}

	/**
	 * Returns whether or not to show the breadcrumbs blog remove option
	 *
	 * @return bool
	 */
	public function breadcrumbs_blog_remove_active_cb() {
		return 'page' === get_option( 'show_on_front' );
	}

	/**
	 * Adds the breadcrumbs separator text field
	 */
	private function breadcrumbs_separator_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-sep]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-separator', array(
					'label'    => __( 'Breadcrumbs separator:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-sep]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs home anchor text field
	 */
	private function breadcrumbs_home_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-home]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-home', array(
					'label'    => __( 'Anchor text for the homepage:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-home]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs prefix text field
	 */
	private function breadcrumbs_prefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-prefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-prefix', array(
					'label'    => __( 'Prefix for breadcrumbs:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-prefix]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs archive prefix text field
	 */
	private function breadcrumbs_archiveprefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-archiveprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-archiveprefix', array(
					'label'    => __( 'Prefix for archive pages:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-archiveprefix]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs search prefix text field
	 */
	private function breadcrumbs_searchprefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-searchprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-searchprefix', array(
					'label'    => __( 'Prefix for search result pages:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-searchprefix]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumb 404 prefix text field
	 */
	private function breadcrumbs_404_setting() {
		$this->wp_customize->add_setting(
			'wpseo_titles[breadcrumbs-404crumb]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-404crumb', array(
					'label'    => __( 'Breadcrumb for 404 pages:', 'wordpress-seo' ),
					'type'     => 'text',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_titles[breadcrumbs-404crumb]',
					'context'  => '',
				)
			)
		);
	}
}
