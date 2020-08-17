<?php
/**
 * Presenter class for the indexation warning.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Warning_Presenter class.
 */
class Indexation_Warning_Presenter extends Abstract_Presenter {

	/**
	 * Represents the link to action type.
	 */
	const ACTION_TYPE_LINK_TO = 'link_to';

	/**
	 * Represents the run here action type.
	 */
	const ACTION_TYPE_RUN_HERE = 'run_here';

	/**
	 * The number of objects that needs to be indexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Determines if the action is a link or a button.
	 *
	 * The link links to the Yoast Tools page.
	 * The button will run the action on the current page.
	 *
	 * @var string
	 */
	protected $action_type;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Indexation_Warning_Presenter constructor.
	 *
	 * @param int            $total_unindexed The number of objects that needs to be indexed.
	 * @param Options_Helper $options_helper  The options helper.
	 * @param string         $action_type     The action type.
	 */
	public function __construct( $total_unindexed, Options_Helper $options_helper, $action_type ) {
		$this->total_unindexed = $total_unindexed;
		$this->options_helper  = $options_helper;
		$this->action_type     = $action_type;
	}

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$output = '<div id="yoast-indexation-warning" class="notice notice-success">';

		if ( $this->show_indexation_incomplete_alert() ) {
			$output .= $this->get_incomplete_indexation_alert();
		}
		else {
			$output .= $this->get_base_alert();
		}

		$output .= '<hr />';
		$output .= '<p>';
		$output .= $this->get_dismiss_button();
		$output .= '</p>';
		$output .= '</div>';

		return $output;
	}

	/**
	 * Retrieves the base alert.
	 *
	 * @return string The generated alert.
	 */
	private function get_base_alert() {
		$output = \sprintf(
			'<p><a href="%1$s" target="_blank">%2$s</a></p>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-y' ) ),
			\sprintf(
				/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s creates and maintains an index of all of your site\'s SEO data in order to speed up your site.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);
		$output .= '<p>';
		$output .= \sprintf(
			/* translators: 1: Yoast SEO. */
			\esc_html__( 'To build your index, %1$s needs to process all of your content.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= $this->get_action( \__( 'Start processing and speed up your site now', 'wordpress-seo' ) );

		return $output;
	}

	/**
	 * Retrieves the incomplete indexation alert.
	 *
	 * @return string The generated alert.
	 */
	private function get_incomplete_indexation_alert() {
		$output = \sprintf(
			'<p><a href="%1$s" target="_blank">%2$s</a></p>',
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-x' ) ),
			\sprintf(
			/* translators: 1: Expands to Yoast SEO. */
				\esc_html__( '%1$s maintains an index of all of your site\'s SEO data in order to speed up your site.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);
		$output .= '<p>';
		$output .= \esc_html__( 'It looks like an indexing process was run earlier, but didn\'t complete. There is still some content which hasn\'t been indexed yet. Don\'t worry, you can pick up where you left off.', 'wordpress-seo' );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= $this->get_action( \__( 'Continue processing and speed up your site now', 'wordpress-seo' ) );

		return $output;
	}

	/**
	 * Generates the action, which is either a button or a link.
	 *
	 * @param string $text The text of the action.
	 *
	 * @return string The action.
	 */
	protected function get_action( $text ) {
		switch ( $this->action_type ) {
			case static::ACTION_TYPE_LINK_TO:
				return \sprintf(
					'<a class="button" href="%1$s">%2$s</a>',
					\admin_url( 'admin.php?page=wpseo_tools#start-indexation-yoastIndexationData' ),
					\esc_html( $text )
				);
			default:
				return \sprintf(
					'<button type="button" class="button yoast-open-indexation" data-title="<strong>%1$s</strong>" data-settings="yoastIndexationData">%2$s</button>',
					/* translators: 1: Expands to Yoast. */
					\sprintf( \esc_html__( '%1$s indexing status', 'wordpress-seo' ), 'Yoast' ),
					\esc_html( $text )
				);
		}
	}

	/**
	 * Determines the message given for the estimation of the time that calculation might take.
	 *
	 * @return string The message.
	 */
	protected function get_estimate() {
		if ( $this->total_unindexed > 2500 ) {
			$estimate = '<p>';
			$estimate .= \esc_html__( 'We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:', 'wordpress-seo' );
			$estimate .= '<ul class="ul-disc">';
			$estimate .= '<li>';
			$estimate .= \sprintf(
			/* translators: 1: Expands to Yoast SEO, 2: Button start tag for the reminder, 3: Button closing tag */
				\esc_html__( 'Wait for a week or so, until %1$s automatically processes most of your content in the background. %2$sRemind me in a week.%3$s', 'wordpress-seo' ),
				'Yoast SEO',
				\sprintf(
					'<button type="button" id="yoast-indexation-remind-button" class="button-link hide-if-no-js" data-nonce="%s">',
					\esc_js( \wp_create_nonce( 'wpseo-indexation-remind' ) )
				),
				'</button>'
			);
			$estimate .= '</li>';
			$estimate .= '<li>';
			$estimate .= \sprintf(
			/* translators: 1: Link to article about indexation command, 2: Anchor closing tag, 3: Link to WP CLI. */
				\esc_html__( '%1$sRun the indexation process on your server%2$s using %3$sWP CLI%2$s', 'wordpress-seo' ),
				'<a href="' . \esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-w' ) ) . '" target="_blank">',
				'</a>',
				'<a href="https://wp-cli.org/" target="_blank">'
			);
			$estimate .= '</li>';
			$estimate .= '</ul>';
			$estimate .= '</p>';

			return $estimate;
		}

		if ( $this->total_unindexed >= 400 ) {
			return '<p>' . \esc_html__( 'We estimate this will take a couple of minutes.', 'wordpress-seo' ) . '</p>';
		}

		return '<p>' . \esc_html__( 'We estimate this will take less than a minute.', 'wordpress-seo' ) . '</p>';
	}

	/**
	 * If the 'indexation is incomplete' warning should be shown or not.
	 *
	 * @return bool `true` if the 'indexation is incomplete' warning should be shown, `false` if not.
	 */
	private function show_indexation_incomplete_alert() {
		$indexation_started = $this->options_helper->get( 'indexation_started', false );
		if ( ! $indexation_started ) {
			return false;
		}

		return $indexation_started <= ( \time() - \MONTH_IN_SECONDS );
	}

	/**
	 * Generates the button/link for dismissing the notice.
	 *
	 * @return string The action.
	 */
	protected function get_dismiss_button() {
		/* translators: 1: Button/anchor start tag to dismiss the warning, 2: Button/anchor closing tag. */
		$dismiss_button = \esc_html__( '%1$sHide this notice%2$s (everything will continue to function normally)', 'wordpress-seo' );

		if ( $this->action_type === static::ACTION_TYPE_LINK_TO ) {
			return \sprintf(
				$dismiss_button,
				\sprintf(
					'<a href="%s" class="button-link">',
					\esc_url( \wp_nonce_url( \add_query_arg( 'yoast_seo_hide', 'indexation_warning' ), 'wpseo-ignore' ) )
				),
				'</a>'
			);
		}

		return \sprintf(
			$dismiss_button,
			\sprintf(
				'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="%s">',
				\esc_js( \wp_create_nonce( 'wpseo-ignore' ) )
			),
			'</button>'
		);
	}
}
