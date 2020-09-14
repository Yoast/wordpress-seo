<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for the default tagline.
 */
class WPSEO_Health_Check_Default_Tagline extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-default-tagline';

	/**
	 * Runs the test.
	 */
	public function run() {
		if ( ! $this->has_default_tagline() ) {
			$this->label          = esc_html__( 'You changed the default WordPress tagline', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = esc_html__( 'You are using a custom tagline or an empty one.', 'wordpress-seo' );

			return;
		}

		$this->label          = esc_html__( 'You should change the default WordPress tagline', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = esc_html__( 'You still have the default WordPress tagline. Even an empty one is probably better.', 'wordpress-seo' );

		$query_args    = [
			'autofocus[control]' => 'blogdescription',
		];
		$customize_url = add_query_arg( $query_args, wp_customize_url() );

		$this->actions = sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( '%1$sYou can change the tagline in the customizer%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_attr( $customize_url ) . '">',
			'</a>'
		);
	}

	/**
	 * Returns whether or not the site has the default tagline.
	 *
	 * @return bool
	 */
	public function has_default_tagline() {
		$blog_description         = get_option( 'blogdescription' );
		$default_blog_description = 'Just another WordPress site';

		// We are using the WordPress internal translation.
		$translated_blog_description = __( 'Just another WordPress site', 'default' );

		return $translated_blog_description === $blog_description || $default_blog_description === $blog_description;
	}
}
