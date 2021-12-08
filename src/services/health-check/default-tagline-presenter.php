<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Presents a set of different messages for the Default_Tagline health check.
 */
class Default_Tagline_Presenter {

	/**
	 * The name that WordPress needs to identify this test.
	 *
	 * @var string
	 */
	private $test_identifier;

	/**
	 * The builder object that generates WordPress-friendly test results.
	 *
	 * @var Presenter_Result_Builder
	 */
	private $result_builder;

	/**
	 * Constructor
	 *
	 * @param  Presenter_Result_Builder $result_builder The result builder object that this class uses to generate WordPress-friendly health check results.
	 * @return void
	 */
	public function __construct( Presenter_Result_Builder $result_builder ) {
		$this->result_builder = $result_builder;
	}

	/**
	 * Sets the name that WordPress uses to identify this health check.
	 *
	 * @param  string $test_identifier The identifier.
	 * @return void
	 */
	public function set_test_identifier( $test_identifier ) {
		$this->test_identifier = $test_identifier;
		$this->result_builder->set_test_identifier( $this->test_identifier );
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @return string[]
	 */
	public function get_success_result() {
		return $this->result_builder
			->set_label( esc_html__( 'You changed the default WordPress tagline', 'wordpress-seo' ) )
			->set_status_good()
			->set_description( esc_html__( 'You are using a custom tagline or an empty one.', 'wordpress-seo' ) )
			->build();
	}

	/**
	 * Returns the message for a failed health check. In this case, when the user still has the default WordPress tagline set.
	 *
	 * @return string[]
	 */
	public function get_has_default_tagline_result() {
		return $this->result_builder
			->set_label( esc_html__( 'You should change the default WordPress tagline', 'wordpress-seo' ) )
			->set_status_recommended()
			->set_description( esc_html__( 'You still have the default WordPress tagline. Even an empty one is probably better.', 'wordpress-seo' ) )
			->set_actions( $this->get_actions() )
			->build();
	}

	/**
	 * Returns the actions that the user should take when his tagline is still set to the WordPress default.
	 *
	 * @return string
	 */
	private function get_actions() {
		$query_args    = [
			'autofocus[control]' => 'blogdescription',
		];
		$customize_url = add_query_arg( $query_args, wp_customize_url() );

		return sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( '%1$sYou can change the tagline in the customizer%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_attr( $customize_url ) . '">',
			'</a>'
		);
	}
}
