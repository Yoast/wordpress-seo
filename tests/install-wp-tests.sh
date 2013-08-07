#!/bin/sh

set -x

export WP_CORE_DIR=/tmp/wordpress

plugin_slug=$(basename $(pwd))
plugin_dir=$WP_CORE_DIR/wp-content/plugins/$plugin_slug
wp_content=$WP_CORE_DIR/wp-content

# Init database
mysql -e 'CREATE DATABASE wordpress_test;' -uroot

# Grab specified version of WordPress from github
wget -nv -O /tmp/wordpress.tar.gz https://github.com/WordPress/WordPress/tarball/$WP_VERSION
mkdir -p $WP_CORE_DIR
tar --strip-components=1 -zxmf /tmp/wordpress.tar.gz -C $WP_CORE_DIR

# set up testing suite
export WP_TESTS_DIR=/tmp/wordpress-tests/
svn co --ignore-externals --quiet http://unit-tests.svn.wordpress.org/trunk/ $WP_TESTS_DIR
cd $WP_TESTS_DIR
cp wp-tests-config-sample.php wp-tests-config.php
sed -i "s:dirname( __FILE__ ) . '/wordpress/':'$WP_CORE_DIR':" wp-tests-config.php
sed -i "s/yourdbnamehere/wordpress_test/" wp-tests-config.php
sed -i "s/yourusernamehere/root/" wp-tests-config.php
sed -i "s/yourpasswordhere//" wp-tests-config.php
cd -

# set up database
mysql -e 'CREATE DATABASE wordpress_test;' -uroot

if [ "TRAVIS_PHP_VERSION" == "5.5" ]
then
	wget -nv -O $WP_CONTENT_DIR/db.php https://raw.github.com/markoheijnen/wp-mysqli/master/db.php
fi

set +x
