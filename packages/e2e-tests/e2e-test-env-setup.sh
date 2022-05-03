#!/bin/bash

# Move to the plugin root folder.
cd ../..

# Start the development environment.
wp-env start

# Check if the plugin is active or not.
# If the plugin is not active, check if it is installed. If the plugin is active, do nothing. 
# If the plugin is not installed, install and activate it. If the plugin is installed, activate it.
wp-env run tests-cli wp plugin is-active yoast-simple-custom-post-type
if [ $? -eq 1 ]; then
	wp-env run tests-cli wp plugin is-installed yoast-simple-custom-post-type
	if [ $? -eq 1 ]; then
		wp-env run tests-cli wp plugin install "https://github.com/Yoast/wordpress-seo/blob/try/e2e-tests-package/packages/e2e-tests/data/yoast-simple-custom-post-type.zip?raw=true"
		wp-env run tests-cli wp plugin activate yoast-simple-custom-post-type
	else
		wp-env run tests-cli wp plugin activate yoast-simple-custom-post-type
	fi
fi
