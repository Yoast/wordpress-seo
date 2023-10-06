<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;

/**
 * Class WPSEO_Premium_Upsell_Admin_Block
 */
class WPSEO_Premium_Upsell_Admin_Block {

	/**
	 * Hook to display the block on.
	 *
	 * @var string
	 */
	protected $hook;

	/**
	 * Identifier to use in the dismissal functionality.
	 *
	 * @var string
	 */
	protected $identifier = 'premium_upsell';

	/**
	 * Registers which hook the block will be displayed on.
	 *
	 * @param string $hook Hook to display the block on.
	 */
	public function __construct( $hook ) {
		$this->hook = $hook;
	}

	/**
	 * Registers WordPress hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( $this->hook, [ $this, 'render' ] );
	}

	/**
	 * Renders the upsell block.
	 *
	 * @return void
	 */
	public function render() {
		$url = WPSEO_Shortlinker::get( 'https://yoa.st/17h' );

		$arguments = [
			'<strong>' . esc_html__( 'Use AI', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Quickly create titles & meta descriptions', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'No more dead links', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Easy redirect manager', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'Superfast internal linking suggestions', 'wordpress-seo' ) . '</strong>',
			'<strong>' . esc_html__( 'Social media preview', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Facebook & Twitter', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'Multiple keyphrases', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Increase your SEO reach', 'wordpress-seo' ),
			'<strong>' . esc_html__( 'SEO Workouts', 'wordpress-seo' ) . '</strong>: ' . esc_html__( 'Get guided in routine SEO tasks', 'wordpress-seo' ),
			'<strong>' . esc_html__( '24/7 email support', 'wordpress-seo' ) . '</strong>',
			'<strong>' . esc_html__( 'No ads!', 'wordpress-seo' ) . '</strong>',
		];

		$arguments_html = implode( '', array_map( [ $this, 'get_argument_html' ], $arguments ) );

		$class = $this->get_html_class();

		/* translators: %s expands to Yoast SEO Premium */
		$button_text = YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2023-promotion' ) ? \esc_html__( 'Claim your 30% off now!', 'wordpress-seo' ) : sprintf( esc_html__( 'Get %s', 'wordpress-seo' ), 'Yoast SEO Premium' );
		/* translators: Hidden accessibility text. */
		$button_text .= '<span class="screen-reader-text">' . esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' ) . '</span>' .
			'<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';

		$upgrade_button = sprintf(
			'<a id="%1$s" class="yoast-button-upsell" data-action="load-nfd-ctb" data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2" href="%2$s" target="_blank">%3$s</a>',
			esc_attr( 'wpseo-' . $this->identifier . '-popup-button' ),
			esc_url( $url ),
			$button_text
		);

		echo '<div class="' . esc_attr( $class ) . '">';

		if ( YoastSEO()->classes->get( Promotion_Manager::class )->is( 'black-friday-2023-promotion' ) ) {
			$bf_label   = \esc_html__( 'BLACK FRIDAY', 'wordpress-seo' );
			$sale_label = \esc_html__( '30% OFF', 'wordpress-seo' );
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped above.
			echo "<div class='black-friday-container'><span>$bf_label</span> <span style='margin-left: auto;'>$sale_label</span> </div>";
		}

		echo '<div class="' . esc_attr( $class . '--container' ) . '">';
		echo '<h2 class="' . esc_attr( $class . '--header' ) . '">' .
			sprintf(
				/* translators: %s expands to Yoast SEO Premium */
				esc_html__( 'Upgrade to %s', 'wordpress-seo' ),
				'Yoast SEO Premium'
			) .
		'</h2>';

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Correctly escaped in $this->get_argument_html() method.
		echo '<ul class="' . esc_attr( $class . '--motivation' ) . '">' . $arguments_html . '</ul>';

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Correctly escaped in $upgrade_button and $button_text above.
		echo '<p>' . $upgrade_button . '</p>';
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Formats the argument to a HTML list item.
	 *
	 * @param string $argument The argument to format.
	 *
	 * @return string Formatted argument in HTML.
	 */
	protected function get_argument_html( $argument ) {
		$class = $this->get_html_class();

		return sprintf(
			'<li><div class="%1$s">%2$s</div></li>',
			esc_attr( $class . '--argument' ),
			$argument
		);
	}

	/**
	 * Returns the HTML base class to use.
	 *
	 * @return string The HTML base class.
	 */
	protected function get_html_class() {
		return 'yoast_' . $this->identifier;
	}
}
