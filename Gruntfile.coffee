
module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            compile:
                files:
                    'js/knarz.js': [
                      'cs/tools.coffee'
                      'cs/widget.coffee'
                      'cs/main.coffee'
                      ]
        browserify:
            compile:
                files: 'js/knarz.js': ['cs/**/*.coffee']
                options:
                  transform: ['coffeeify']

        stylus:
            compile:
                files:
                    'st/style.css': ['st/*.styl']

        clean:
            generated:    ["js/*js", "st/*.css"]
            tempfiles:    ["cs/**/.DS_STORE", "js/**/.DS_STORE", "st/**/.DS_STORE", "preview~*"]
            node_modules: ["node_modules"]

        shell:
            install:
              command: 'npm install'

        open:
          browser:
            path: 'index.html'
            app: 'Firefox'

    # npm install --save-dev <nodepackage>          to add <nodepackage> to package.json devDependencies

    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-browserify'
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask 'default',   [ 'browserify', 'stylus', 'clean:tempfiles' ]
    grunt.registerTask 'build',     [ 'browserify', 'stylus', 'clean:tempfiles' ]
    grunt.registerTask 'test',      [ 'browserify', 'stylus', 'open', 'clean:tempfiles' ]
    grunt.registerTask 'c',         [ 'clean:tempfiles' ]
    grunt.registerTask 'del',       [ 'clean' ]
    grunt.registerTask 'bs',        [ 'clean', 'shell:install' ]
