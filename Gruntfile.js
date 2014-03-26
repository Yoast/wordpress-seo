module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    makepot: {
           target: {
               options: {
                   domainPath: '/languages',
                   potFilename: 'wordpress-seo.pot',
                   processPot: function( pot, options ) {
                                  pot.headers['report-msgid-bugs-to'] = 'http://wordpress.org/support/plugin/wordpress-seo\n';
                                  pot.headers['plural-forms'] = 'nplurals=2; plural=n != 1;';
                                  pot.headers['last-translator'] = 'Remkus de Vries <translations@yoast.com>\n';
                                  pot.headers['language-team'] = 'Yoast Translate <translations@yoast.com>\n';
                                  pot.headers['x-generator'] = 'CSL v1.x\n';
                                  pot.headers['x-poedit-basepath'] = '.\n';
                                  pot.headers['x-poedit-language'] = 'English\n';
                                  pot.headers['x-poedit-country'] = 'UNITED STATES\n';
                                  pot.headers['x-poedit-sourcecharset'] = 'utf-8\n';
                                  pot.headers['x-poedit-keywordslist'] = '__;_e;__ngettext:1,2;_n:1,2;__ngettext_noop:1,2;_n_noop:1,2;_c,_nc:4c,1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;_nx_noop:4c,1,2;\n';
                                  pot.headers['x-poedit-bookmarks'] = '\n';
                                  pot.headers['x-poedit-searchpath-0'] = '.\n';
                                  pot.headers['x-textdomain-support'] = 'yes\n';
                                  return pot;
                               },
                   type: 'wp-plugin'
               }
           }
       }
  });

  grunt.loadNpmTasks( 'grunt-wp-i18n' );

};