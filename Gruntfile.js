module.exports = function(grunt) {
  // Do grunt-related things in here
    grunt.loadNpmTasks('grunt-contrib-less');
    less: {
      development: {
        options: {
          paths: ['node_modules/bootstrap/less']
        },
        files: {
          'path/to/result.css': 'path/to/source.less'
        }
      },
      production: {
        options: {
          paths: ['assets/css'],
          plugins: [
            new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
            new (require('less-plugin-clean-css'))(cleanCssOptions)
          ],
          modifyVars: {
            imgPath: '"http://mycdn.com/path/to/images"',
            bgColor: 'red'
          }
        },
        files: {
          'path/to/result.css': 'path/to/source.less'
        }
      }
    }
};
