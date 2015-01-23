
module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            compile:
                files:
                    'js/knarz.js': ['cs/*.coffee']

        stylus:
            compile:
                files:
                    'st/style.css': ['st/*.styl']

        clean:
            generated:    ["js/*js", "st/*.css"]
            ds_store:     ["cs/**/.DS_STORE", "js/**/.DS_STORE", "st/**/.DS_STORE"]
            node_modules: ["node_modules"]

        shell:
            install:
              command: 'npm install'

        open:
          browser:
            path: 'index.html'
            app: 'Firefox'

    # npm install --save-dev grunt-shell

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask 'default',   [ 'coffee', 'stylus' ]
    grunt.registerTask 'build',     [ 'coffee', 'stylus' ]
    grunt.registerTask 'test',      [ 'coffee', 'stylus', 'open' ]
    grunt.registerTask 'c',         [ 'clean:ds_store' ]
    grunt.registerTask 'del',       [ 'clean' ]
    grunt.registerTask 'bs',        [ 'clean', 'shell' ]
