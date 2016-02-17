<?php

/**
 * Class WPSEO_Redirect_Output_Decorator
 */
class WPSEO_Redirect_Output_Decorator {

    /**
     * Make sure the origin column is presented correctly to the user.
     *
     * @param string         $value     The value of the string to format.
     * @param WPSEO_Redirect $redirect  The redirect.
     *
     * @return string
     */
    public static function decorate_origin_column( $value, WPSEO_Redirect $redirect ) {
        if( $redirect->get_format() === WPSEO_Redirect::FORMAT_PLAIN ) {
            //return plain formatter
        }
        if( $redirect->get_format() === WPSEO_Redirect::FORMAT_REGEX ) {
            //return regex formatter
        }

        return $value;
    }

    /**
     * Make sure the target column is presented correctly to the user.
     *
     * @param  string $value The value of the string to format.
     *
     * @return string
     */
    public static function decorate_target_column( $value ) {
            //return  formatter


        return $value;
    }



}