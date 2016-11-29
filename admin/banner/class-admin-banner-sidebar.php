<?php
/**
 * @package WPSEO\Admin\Banner
 */

/**
 * Represents the render object for generating the html for the given banner.
 */
class WPSEO_Admin_Banner_Sidebar {

	/** @var string */
	protected $title = '';

	/** @var WPSEO_Admin_Banner_Spot[] */
	protected $banner_spots = array();

	/** @var  WPSEO_Admin_Banner_Renderer */
	protected $banner_renderer;

	/**
	 * WPSEO_Admin_Banner_Sidebar constructor.
	 *
	 * @param string                      $title           The title for the sidebar.
	 * @param WPSEO_Admin_Banner_Renderer $banner_renderer The render class for banners.
	 */
	public function __construct( $title, WPSEO_Admin_Banner_Renderer $banner_renderer ) {
		$this->title = $title;
		$this->banner_renderer = $banner_renderer;
	}

	/**
	 * Returns the set title.
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Initializes the banner sidebar by setting its banner spots.
	 *
	 * @param WPSEO_Features $features Class regarding WPSEO Features.
	 */
	public function initialize( WPSEO_Features $features ) {
		if ( $features->is_free() ) {
			$this->add_banner_spot( $this->get_premium_spot() );
		}

		$this->add_banner_spot( $this->get_services_spot() );

		$extensions_spot = $this->get_extensions_spot( $this->get_active_extensions() );
		if ( $extensions_spot->has_banners() ) {
			$this->add_banner_spot( $extensions_spot );
		}

		$this->add_banner_spot( $this->get_courses_spot() );
		$this->add_banner_spot( $this->get_remove_banner_spot() );
	}

	/**
	 * Returns array with bannerspots.
	 *
	 * @return WPSEO_Admin_Banner_Spot[]
	 */
	public function get_banner_spots() {
		return $this->banner_spots;
	}

	/**
	 * Adds a banner spot.
	 *
	 * @param WPSEO_Admin_Banner_Spot $spot The spot to add.
	 */
	protected function add_banner_spot( WPSEO_Admin_Banner_Spot $spot ) {
		$this->banner_spots[] = $spot;
	}

	/**
	 * Returns the premium banner spot.
	 *
	 * @return WPSEO_Admin_Banner_Spot
	 */
	protected function get_premium_spot() {
		$premium_spot = new WPSEO_Admin_Banner_Spot( __( 'Premium', 'wordpress-seo' ), $this->banner_renderer );

		$premium_spot->set_description(
			sprintf(
				/* translators: %1$s to anchor to the Yoast plugin page, %2$s is the a-closing tag, %3$s: Yoast SEO  */
				__( 'Consider switching to the %1$sPremium version of %3$s%2$s.', 'wordpress-seo' ),
				'<a target="_blank" href="https://yoa.st/ji">',
				'</a>',
				'Yoast SEO'
			)
		);

		$premium_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jj',
				'premium-seo.png',
				261,
				152,
				__( 'Buy the Yoast SEO Premium plugin now and get access to extra features and 24/7 support!', 'wordpress-seo' )
			)
		);

		return $premium_spot;
	}

	/**
	 * Returns the services banner spot.
	 *
	 * @return WPSEO_Admin_Banner_Spot
	 */
	protected function get_services_spot() {
		$service_spot = new WPSEO_Admin_Banner_Spot( __( 'Services', 'wordpress-seo' ), $this->banner_renderer );

		$service_spot->set_description(
			sprintf(
				/* translators: %1$s expands to anchor start text with link to the Yoast Services page, %2$s to Yoast, %3$s is the a-closing tag.  */
				__( 'Don\'t want dive into SEO yourself? %1$sLet team %2$s help you!%3$s', 'wordpress-seo' ),
				'<a target="_blank" href="https://yoa.st/jk">',
				'Yoast',
				'</a>'
			)
		);

		$service_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jl',
				'website-review.png',
				261,
				152,
				__( 'Order a Website Review and we will tell you what to improve to attract more visitors!', 'wordpress-seo' )
			)
		);

		$service_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jm',
				'configuration-service.png',
				261,
				152,
				__( 'Let our experts set up your Yoast SEO Premium plugin!', 'wordpress-seo' )
			)
		);

		return $service_spot;
	}

	/**
	 * Returns an array with the Yoast SEO extensions with the value true when they are active.
	 *
	 * @return array
	 */
	protected function get_active_extensions() {
		return array(
			'video'       => class_exists( 'wpseo_Video_Sitemap' ),
			'woocommerce' => class_exists( 'Woocommerce' ) && class_exists( 'Yoast_WooCommerce_SEO' ),
			'news'        => class_exists( 'WPSEO_News' ),
			'local'       => defined( 'WPSEO_LOCAL_VERSION' ),
		);
	}

	/**
	 * Returns the extensions banner spot.
	 *
	 * @param array $active_extensions The active extensions.
	 *
	 * @return WPSEO_Admin_Banner_Spot
	 */
	protected function get_extensions_spot( array $active_extensions ) {
		$extension_spot = new WPSEO_Admin_Banner_Spot( __( 'Extensions', 'wordpress-seo' ), $this->banner_renderer );

		$extension_spot->set_description(
			sprintf(
				/* translators: %1$s expands to Yoast SEO, %2$s to anchor to the Yoast plugin page, %3$s is the a-closing tag.  */
				__( 'Extend your %1$s plugin with our %2$sSEO plugins%3$s.', 'wordpress-seo' ),
				'Yoast SEO',
				'<a target="_blank" href="https://yoa.st/jn">',
				'</a>'
			)
		);

		if ( empty( $active_extensions['video'] ) ) {
			$extension_spot->add_banner(
				new WPSEO_Admin_Banner(
					'https://yoa.st/jo',
					'video-seo.png',
					261,
					152,
					__( 'Buy the Yoast Video SEO plugin now and optimize your videos for video search results and social media!', 'wordpress-seo' )
				)
			);
		}

		if ( empty( $active_extensions['woocommerce'] )  ) {
			$extension_spot->add_banner(
				new WPSEO_Admin_Banner(
					'https://yoa.st/jp',
					'woocommerce-seo.png',
					261,
					152,
					__( 'Buy the Yoast WooCommerce SEO plugin now and optimize your shop today to improve your product promotion!', 'wordpress-seo' )
				)
			);
		}

		if ( empty( $active_extensions['local'] ) ) {
			$extension_spot->add_banner(
				new WPSEO_Admin_Banner(
					'https://yoa.st/jq',
					'local-seo.png', 261,
					152,
					__( 'Buy the Yoast Local SEO plugin now to improve your site&#8217;s Local SEO and ranking in Google Maps!', 'wordpress-seo' )
				)
			);
		}

		if ( empty( $active_extensions['news'] ) ) {
			$extension_spot->add_banner(
				new WPSEO_Admin_Banner(
					'https://yoa.st/jr',
					'news-seo.png',
					261,
					152,
					__( 'Buy the Yoast News SEO plugin now and start optimizing to get your site featured in Google News!', 'wordpress-seo' )
				)
			);
		}

		return $extension_spot;
	}

	/**
	 * Returns the courses banner spot.
	 *
	 * @return WPSEO_Admin_Banner_Spot
	 */
	protected function get_courses_spot() {
		$courses_spot = new WPSEO_Admin_Banner_Spot( __( 'Courses', 'wordpress-seo' ), $this->banner_renderer );

		$courses_spot->set_description(
			sprintf(
				/* translators: %1$s expands to anchor start text with link to the Yoast Services page, %2$s is the a-closing tag.  */
				__( 'You can easily learn more about SEO, content and the like with one of %1$sour courses%2$s', 'wordpress-seo' ),
				'<a target="_blank" href="https://yoa.st/jt">',
				'</a>'
			)
		);

		$courses_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/ju',
				'basic-seo-training.png',
				261,
				152,
				__( 'Take the online Basic SEO Training course and learn the fundamentals of SEO!', 'wordpress-seo' )
			)
		);

		$courses_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jv',
				'yoast-seo-for-wordpress-training.png',
				261,
				152,
				/* translators: %1$s expands to Yoast SEO for WordPress Training  */
				sprintf( __( 'Take the %s course and become a certified Yoast SEO for WordPress expert!', 'wordpress-seo' ), 'Yoast SEO for WordPress Training' )
			)
		);

		$courses_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jw',
				'seo-copywriting-training.png',
				261,
				152,
				__( 'Take the online SEO Copywriting Training course and learn how to write awesome copy that ranks!', 'wordpress-seo' )
			)
		);

		$courses_spot->add_banner(
			new WPSEO_Admin_Banner(
				'https://yoa.st/jx',
				'keyword-research-training.png',
				261,
				152,
				__( 'Take the online Keyword Research Training course and learn how to rank with your keywords!', 'wordpress-seo' )
			)
		);

		return $courses_spot;
	}

	/**
	 * Returns the remove banner spot.
	 *
	 * @return WPSEO_Admin_Banner_Spot
	 */
	protected function get_remove_banner_spot() {

		$remove_banner_spot = new WPSEO_Admin_Banner_Spot(
			__( 'Remove these ads?', 'wordpress-seo' )
		);

		$remove_banner_spot->set_description(
			'<a target="_blank" href="https://yoa.st/jy">'.
			/* translators: %1$s expands to Yoast SEO Premium */
			sprintf( __( 'Upgrade to %1$s &raquo;', 'wordpress-seo' ), 'Yoast SEO Premium' ) .
			'</a>'
		);

		return $remove_banner_spot;
	}
}
