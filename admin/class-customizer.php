<?php
/**
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
	 * @param WP_Customize_Manager $wp_customize
	 */
	public function wpseo_customize_register( $wp_customize ) {
		$this->wp_customize = $wp_customize;

		$this->breadcrumbs_section();
		$this->breadcrumbs_enable_setting();
		$this->breadcrumbs_enable_setting();
		$this->breadcrumbs_boldlast_setting();
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
		$this->wp_customize->add_section(
			'wpseo_breadcrumbs_customizer_section', array(
				/* translators: %s is the name of the plugin */
				'title'          => sprintf( __( '%s Breadcrumbs', 'wordpress-seo' ), 'Yoast SEO' ),
				'priority'       => 999,
				'theme_supports' => 'yoast-seo-breadcrumbs',
			)
		);

	}

	/**
	 * Adds the enable breadcrumbs checkbox
	 */
	private function breadcrumbs_enable_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-enable]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-enable', array(
					'label'    => __( 'Enable Breadcrumbs', 'wordpress-seo' ),
					'type'     => 'checkbox',
					'section'  => 'wpseo_breadcrumbs_customizer_section',
					'settings' => 'wpseo_internallinks[breadcrumbs-enable]',
					'context'  => '',
				)
			)
		);
	}

	/**
	 * Returns whether or not the breadcrumbs are active
	 *
	 * @return bool
	 */
	public function breadcrumbs_active_callback() {
		$options = WPSEO_Options::get_all();

		return true === $options['breadcrumbs-enable'];
	}

	/**
	 * Adds the breadcrumbs bold last checkbox
	 */
	private function breadcrumbs_boldlast_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-boldlast]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-boldlast', array(
					'label'           => __( 'Bold the last page in the breadcrumb', 'wordpress-seo' ),
					'type'            => 'checkbox',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-boldlast]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs remove blog checkbox
	 */
	private function breadcrumbs_blog_remove_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-blog-remove]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-blog-remove', array(
					'label'           => __( 'Remove Blog page from Breadcrumbs', 'wordpress-seo' ),
					'type'            => 'checkbox',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-blog-remove]',
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
		return $this->breadcrumbs_active_callback() && 'page' === get_option( 'show_on_front' );
	}

	/**
	 * Adds the breadcrumbs separator text field
	 */
	private function breadcrumbs_separator_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-sep]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-separator', array(
					'label'           => __( 'Breadcrumbs Separator:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-sep]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs home anchor text field
	 */
	private function breadcrumbs_home_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-home]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-home', array(
					'label'           => __( 'Anchor Text for Homepage:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-home]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs prefix text field
	 */
	private function breadcrumbs_prefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-prefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-prefix', array(
					'label'           => __( 'Prefix for the breadcrumb path:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-prefix]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs archive prefix text field
	 */
	private function breadcrumbs_archiveprefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-archiveprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-archiveprefix', array(
					'label'           => __( 'Prefix for Archive breadcrumbs:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-archiveprefix]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs search prefix text field
	 */
	private function breadcrumbs_searchprefix_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-searchprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-searchprefix', array(
					'label'           => __( 'Prefix for Search Page breadcrumbs:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-searchprefix]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}

	/**
	 * Adds the breadcrumb 404 prefix text field
	 */
	private function breadcrumbs_404_setting() {
		$this->wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-404crumb]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$this->wp_customize->add_control(
			new WP_Customize_Control(
				$this->wp_customize, 'wpseo-breadcrumbs-404crumb', array(
					'label'           => __( 'Breadcrumb for 404 Page:', 'wordpress-seo' ),
					'type'            => 'text',
					'section'         => 'wpseo_breadcrumbs_customizer_section',
					'settings'        => 'wpseo_internallinks[breadcrumbs-404crumb]',
					'context'         => '',
					'active_callback' => array( $this, 'breadcrumbs_active_callback' ),
				)
			)
		);
	}
}
