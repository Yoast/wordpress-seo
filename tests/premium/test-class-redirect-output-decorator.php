<?php

class WPSEO_Redirect_Output_Decorator_Test extends WPSEO_UnitTestCase {

    /**
     * Test the output of the origin column when the format is plain.
     *
     * @covers WPSEO_Redirect_Output_Decorator::decorate_origin_column
     */
    public function test_decorate_origin_column_format_is_plain() {
        $value = 'test-redirect';

        $redirect = new WPSEO_Redirect( 'test-redirect', 'test', '301', 'plain' );

        $expected = '<span class="redirect_table_row_origin_slash">/</span>test-redirect<span class="redirect_table_row_origin_slash">/</span>';

        $this->assertEquals( $expected, WPSEO_Redirect_Output_Decorator::decorate_origin_column( $value, $redirect ) );
    }

    /**
     * Test the output of the origin column when the format is regex.
     *
     * @covers WPSEO_Redirect_Output_Decorator::decorate_origin_column
     */
    public function test_decorate_origin_column_format_is_regex() {
        $value = 'origin';

        $redirect = new WPSEO_Redirect( 'origin', 'test', '301', 'regex' );

        $this->assertEquals( 'origin', WPSEO_Redirect_Output_Decorator::decorate_origin_column( $value, $redirect ) );
    }

    /**
     * Test the output of the target column when the url is relative
     *
     * @covers WPSEO_Redirect_Output_Decorator::decorate_target_column
     */
    public function test_decorate_target_column_format_relative_url() {
        $value = 'target';

        $expected = '<span class="redirect_table_row_origin_slash">/</span>target<span class="redirect_table_row_target_slash">/</span>';

        $this->assertEquals( $expected, WPSEO_Redirect_Output_Decorator::decorate_target_column( $value ) );
    }

    /**
     * Test the output of the target clumn when the url is absolute
     *
     * @covers WPSEO_Redirect_Output_Decorator::decorate_target_column
     */
    public function test_decorate_target_column_format_absolute_url() {
        $value = 'https://yoast.com';

        $this->assertEquals( $value, WPSEO_Redirect_Output_Decorator::decorate_target_column( $value ) );
    }


}
