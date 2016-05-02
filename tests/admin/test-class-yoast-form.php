<?php

class WPSEO_Yoast_Form_Test extends WPSEO_UnitTestCase {

    /**
     * Instance of class Yoast_Form
     */
    private $class_instance;

    /**
     * Create a mock object of class Yoast_Form
     */
    public function setUp() {
        $this->class_instance = $this->getMock( 'Yoast_Form', array( 'load_i18n_promo_class' ) );
    }

    /**
     * Make sure the method load_i18n_promo_class is called
     *
     * @covers Yoast_Form::admin_footer
     */
    public function test_load_i18n_promo_box() {
        $this->class_instance
            ->expects( $this->once() )
            ->method( 'load_i18n_promo_class' );

        $this->class_instance->admin_footer();
    }

    /**
     * Make sure that the action 'wpseo_admin_footer' is only called
     * when the method load_i18n_promo_class returns true
     *
     * @covers Yoast_Form::admin_footer
     */
    public function test_run_do_action_when_on_correct_page() {
        $this->class_instance
            ->expects( $this->once() )
            ->method( 'load_i18n_promo_class' )
            ->willReturn( true );

        $this->class_instance->admin_footer();

        $this->assertEquals( did_action( 'wpseo_admin_footer' ), 1 );
    }

    /**
     * Make sure that the action 'wpseo_admin_footer' is not called
     * when the method load_i18n_promo_class returns false
     *
     * @covers Yoast_Form::admin_footer
     */
    public function test_do_not_run_do_action_when_not_on_correct_page() {
        $this->class_instance
            ->expects( $this->once() )
            ->method( 'load_i18n_promo_class' )
            ->willReturn( false );

        $this->class_instance->admin_footer();

        $this->assertEquals( did_action( 'wpseo_admin_footer' ), 0 );
    }

}