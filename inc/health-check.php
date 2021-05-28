<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the abstract class for the health check.
 */
abstract class WPSEO_Health_Check {

	/**
	 * The health check section in which 'good' results should be shown.
	 *
	 * @var string
	 */
	const STATUS_GOOD = 'good';

	/**
	 * The health check section in which 'recommended' results should be shown.
	 *
	 * @var string
	 */
	const STATUS_RECOMMENDED = 'recommended';

	/**
	 * The health check section in which 'critical' results should be shown.
	 *
	 * @var string
	 */
	const STATUS_CRITICAL = 'critical';

	/**
	 * The value of the section header in the Health check.
	 *
	 * @var string
	 */
	protected $label = '';

	/**
	 * Section the result should be displayed in.
	 *
	 * @var string
	 */
	protected $status = '';

	/**
	 * What the badge should say with a color.
	 *
	 * @var array
	 */
	protected $badge = [
		'label' => '',
		'color' => '',
	];

	/**
	 * Additional details about the results of the test.
	 *
	 * @var string
	 */
	protected $description = '';

	/**
	 * A link or button to allow the end user to take action on the result.
	 *
	 * @var string
	 */
	protected $actions = '';

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = '';

	/**
	 * Whether or not the test should be ran on AJAX as well.
	 *
	 * @var bool True when is async, default false.
	 */
	protected $async = false;

	/**
	 * Runs the test and returns the result.
	 */
	abstract public function run();

	/**
	 * Registers the test to WordPress.
	 */
	public function register_test() {
		if ( $this->is_async() ) {
			add_filter( 'site_status_tests', [ $this, 'add_async_test' ] );

			add_action( 'wp_ajax_health-check-' . $this->get_test_name(), [ $this, 'get_async_test_result' ] );

			return;
		}

		add_filter( 'site_status_tests', [ $this, 'add_test' ] );
	}

	/**
	 * Runs the test.
	 *
	 * @param array $tests Array with the current tests.
	 *
	 * @return array The extended array.
	 */
	public function add_test( $tests ) {
		$tests['direct'][ $this->get_test_name() ] = [
			'test' => [ $this, 'get_test_result' ],
		];

		return $tests;
	}

	/**
	 * Runs the test in async mode.
	 *
	 * @param array $tests Array with the current tests.
	 *
	 * @return array The extended array.
	 */
	public function add_async_test( $tests ) {
		$tests['async'][ $this->get_test_name() ] = [
			'test' => $this->get_test_name(),
		];

		return $tests;
	}

	/**
	 * Formats the test result as an array.
	 *
	 * @return array The formatted test result.
	 */
	public function get_test_result() {
		$this->run();
		$this->add_yoast_signature();

		return [
			'label'       => $this->label,
			'status'      => $this->status,
			'badge'       => $this->get_badge(),
			'description' => $this->description,
			'actions'     => $this->actions,
			'test'        => $this->test,
		];
	}

	/**
	 * Formats the test result as an array.
	 */
	public function get_async_test_result() {
		wp_send_json_success( $this->get_test_result() );
	}

	/**
	 * Retrieves the badge and ensure usable values are set.
	 *
	 * @return array The proper formatted badge.
	 */
	protected function get_badge() {
		if ( ! is_array( $this->badge ) ) {
			$this->badge = [];
		}

		if ( empty( $this->badge['label'] ) ) {
			$this->badge['label'] = __( 'SEO', 'wordpress-seo' );
		}

		if ( empty( $this->badge['color'] ) ) {
			$this->badge['color'] = 'green';
		}

		return $this->badge;
	}

	/**
	 * WordPress converts the underscores to dashes. To prevent issues we have
	 * to do it as well.
	 *
	 * @return string The formatted testname.
	 */
	protected function get_test_name() {
		return str_replace( '_', '-', $this->test );
	}

	/**
	 * Checks if the health check is async.
	 *
	 * @return bool True when check is async.
	 */
	protected function is_async() {
		return ! empty( $this->async );
	}

	/**
	 * Adds a text to the bottom of the Site Health check to indicate it is a Yoast SEO Site Health Check.
	 */
	protected function add_yoast_signature() {
		$this->actions .= sprintf(
			/* translators: 1: Start of a paragraph beginning with the Yoast icon, 2: Expands to 'Yoast SEO', 3: Paragraph closing tag. */
			esc_html__( '%1$sThis was reported by the %2$s plugin%3$s', 'wordpress-seo' ),
			'<p class="yoast-site-health__signature"><img src="' . esc_url( plugin_dir_url( WPSEO_FILE ) . 'packages/js/images/Yoast_SEO_Icon.svg' ) . '" alt="" height="20" width="20" class="yoast-site-health__signature-icon">',
			'Yoast SEO',
			'</p>'
		);
	}
}
