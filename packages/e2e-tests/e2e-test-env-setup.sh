# Move to the plugin root folder
cd ../..

# Start the development environment
wp-env start

# Install the custom plugin to create a custom post type
# and activate it
wp-env run tests-cli wp plugin install "https://github.com/Yoast/wordpress-seo/blob/try/e2e-tests-package/packages/e2e-tests/data/yoast-simple-custom-post-type.zip?raw=true"
wp-env run tests-cli wp plugin activate yoast-simple-custom-post-type