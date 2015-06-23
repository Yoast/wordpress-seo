// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
    'js-text-analysis': {
        options: {
            preserveComments: 'some',
            report: 'gzip'
        },
        files: [{
            expand: true,
            cwd: 'js',
            src: [
                '*.js',
                '!*.min.js'
            ],
            dest: 'js/dist',
            ext: '.min.js',
            extDot: 'first',
            isFile: true
        }]
    }
};
