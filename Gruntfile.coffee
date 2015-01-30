
module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        browserify:
            compile:
                files: 'js/knix.js': ['coffee/**/*.coffee']
                options:
                  transform: ['coffeeify']

        bower_concat:
            all:
                dest: 'js/lib/bower.js',
                bowerOptions:
                    relative: false

        stylus:
            compile:
                files:
                    'style/style.css': ['style/style.styl']

        watch:
          scripts:
            files: ['coffee/*.coffee', 'style/*.styl'],
            tasks: ['build'],
            options:
              spawn: false

        clean:
            generated:    ["js/*js", "style/*.css"]
            tempfiles:    ["coffee/**/.DS_STORE", "js/**/.DS_STORE", "style/**/.DS_STORE", "preview~*"]
            node_modules: ["node_modules"]

        shell:
            install:
                command: 'npm install'
            touch:
                command: 'touch index.html'

        open:
          browser:
            path: 'index.html'
            app: 'Firefox'

    # npm install --save-dev <nodepackage>          to add <nodepackage> to package.json devDependencies

    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-bower-concat'
    grunt.loadNpmTasks 'grunt-browserify'
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask 'default',   [ 'bower_concat', 'browserify', 'stylus', 'clean:tempfiles' ]
    grunt.registerTask 'build',     [ 'bower_concat', 'browserify', 'stylus' ]
    grunt.registerTask 'test',      [ 'bower_concat', 'browserify', 'stylus', 'shell:touch', 'open', 'clean:tempfiles' ]
    grunt.registerTask 'c',         [ 'clean:tempfiles' ]
    grunt.registerTask 'install',   [ 'shell:install' ]
