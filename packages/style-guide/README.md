# Style guide

Design guidelines for use within different Yoast projects. Includes a shiny colors palette.

## General guidelines:
- all palette colors variables must be prefixed with `$palette_`
- do not use `$palette_*` variables directly, instead map them to other color variables with prefix `$color_` and use these in the various locations
- use underscores `_` instead of hyphens `-` for variable names; note that in Sass variable names (and all other Sass identifiers) [can use hyphens and underscores interchangeably](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variables_)
- prefer underscores anyways
- do not use rgba colors in the palette, instead use the `rgba()` function on specific locations
- platform specific colors (e.g. WordPress focus style) shouldn't be part of the palette or hardcoded in reusable components
- add new colors only if they're really needed: if they're used just once or twice, they're probably not needed

## Helper functions:
- for use in the JS components, the `rgba()` function can be used to output a CSS rgba color. Usage examples:
```
${ rgba( "#ff0000", .8 ) }
${ rgba( "#f00", .8 ) }
${ rgba( `${ colors.$color_red }`, .8 ) }
```

## Deprecated colors and breakpoints:
Yoast SEO and its add-ons no longer use these keys. They will be removed in a future release.
```
$palette_white
$palette_grey_ultra_light
$palette_grey_light
$palette_grey_medium_light
$palette_grey_disabled
$palette_grey_dark
$palette_black
$palette_purple
$palette_purple_dark
$palette_pink
$palette_pink_light
$palette_pink_dark
$palette_blue
$palette_blue_light
$palette_blue_medium
$palette_blue_link
$palette_blue_focus
$palette_yoast_focus
$palette_blue_dark
$palette_green
$palette_green_light
$palette_green_medium_light
$palette_green_medium
$palette_green_blue
$palette_orange
$palette_orange_light
$palette_red
$palette_red_light
$palette_yellow
$palette_yellow_score
$palette_button_upsell
$palette_button_upsell_hover
$palette_link_text
$palette_error_emphasis
$palette_info_background
$palette_info_text
$palette_info_emphasis
$palette_success_background
$palette_success_text
$palette_success_emphasis
$palette_warning_background
$palette_warning_text
$palette_warning_emphasis
$color_green_blue
$color_pink_light
$color_blue_light
$color_border_light
$color_border_gutenberg
$color_border
$color_upsell_text
$color_marker_inactive
$color_marker_active
$color_marker_disabled
$color_error
$color_orange
$color_orange_hover
$color_pink_hover
$color_grey_line
$color_grey_quote
$color_blue_link
$color_blue_focus
$color_blue_focus_shadow
$color_grey_light
$color_error_message
```

From `responsive-breakpoints.json`:
```
tablet
```

## Removed/replaced colors:
```
$color_border: #f7f7f7;					renamed in $color_border_light: #f7f7f7;
$color_buttons: #555555;				replaced with $color_button_text: #555;
$color_caret: #555555;					removed and replaced with $color_grey_dark: #555;
$color_caret_focus: #1074a8;			removed and replaced with #$color_blue: #0075b3;
$color_caret_hover: #bfbfbf;			removed and replaced with $color_grey_text: #646464;
$color_input_border_focus: #1074a8;		removed, the platform should take care of focus styles
$color_progress_background: #f7f7f7;	removed and replaced with $color_background_light: #f7f7f7;
$color-shadow-*							removed all, they were duplicating the base colors; use the base colors instead.
```

## Changed colors:
```
$color_border: #f7f7f7;					mapped to $palette_grey_medium #ccc;
$color_button_border: #dbdbdb;			mapped to $palette_grey_medium: #ccc;
$color-error: #E23132;					changed in $color_error > $palette_red: #dc3232;
$color-grey: #DCDCDC;					changed in $color_grey: #ddd;
$color-grey-cta: #DCDCDC;				mapped to $palette_grey: #ddd;
$color-grey-hover: #CDCDCD;				changed in $color_grey_hover: darken( $palette_grey, 6% );
$color-grey-line: #E6E6E6;				mapped to $palette_grey: #ddd;
$color-grey-quote: #8C8C8C;				mapped to $palette_grey_text: #646464;
$color-grey-text: #646464;				mapped to $palette_grey_text: #646464;
$color_input_border: #bfbfbf;			mapped to $palette_grey: #ddd;
$color_marker_disabled: #e6e6e6;		mapped to $palette_grey_disabled: #a0a5aa;
$color-orange-hover: #F58223;			changed in $color_orange_hover: darken( $palette_orange, 5% );
$color-pink: #D93F69;					changed in $color_pink: #d73763;
$color-pink-light: #D93F69;				changed in $color_pink_light: #e1bee7;
```

## New colors:
```
$palette_green_medium:		#008a00;
$palette_grey:              #ddd;
$palette_grey_disabled:     #a0a5aa; // Should be used only for disabled controls text.
$palette_grey_light:        #f1f1f1;
$palette_grey_medium:       #ccc;
$palette_grey_medium_dark:  #888;
$palette_pink_light:        #e1bee7;
```

## Snippet preview colors:
(see https://github.com/Yoast/wordpress-seo/issues/6042)
```
$color_google_title:     #1a0dab;
$color_google_url:       #006621;
$color_google_date:      #808080;
$color_google_desc:      #545454;
$color_google_desc_bold: #6a6a6a;
```
