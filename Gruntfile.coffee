
module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            options:
                sourceMap: true
                bare:      true
                joinExt:   '.coffee'
            knix:
                files:
                    './js/tools.js':   ['./coffee/tools/*.coffee']
                    './js/knix.js':    ['./coffee/knix.coffee']
                    './js/widget.js':  ['./coffee/widget.coffee']
                    './js/widgets.js': ['./coffee/widgets/*.coffee']
                    './js/main.js':    ['./coffee/main.coffee']

        bower_concat:
            all:
                dest: 'js/lib/bower.js'
                bowerOptions:
                    relative: false
                exclude: ['octicons']

        stylus:
            compile:
                files:
                    'style/style.css': ['style/style.styl']

        watch:
          scripts:
            files: ['coffee/**/*.coffee', 'style/*.styl']
            tasks: ['build']
            options:
                spawn:     true
                interrupt: true
          node:
            files: ['tools/node.js']
            tasks: ['kill', 'build', 'node']
            options:
                spawn:     true
                force:     true
                interrupt: true

        clean:
            generated:    ["js/*js", "style/*.css", "js/*.map", "js/*.coffee"]
            tempfiles:    ["coffee/**/.DS_STORE", "js/**/.DS_STORE", "style/**/.DS_STORE", "preview~*"]
            node_modules: ["node_modules"]

        shell:
            install:
                command: 'npm install'
            touch:
                command: 'touch index.html'
            node:
                command: 'node tools/node.js'
            sleep:
                command: 'sleep 1'
            kill:
                command: 'tools/unwatch'

        open:
          browser:
            path: 'index.html'
            app: 'Firefox'

    # npm install --save-dev <nodepackage>          to add <nodepackage> to package.json devDependencies

    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-bower-concat'
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask 'build',     [ 'coffee', 'bower_concat', 'stylus' ]
    grunt.registerTask 'default',   [ 'build', 'clean:tempfiles' ]
    grunt.registerTask 'test',      [ 'build', 'shell:touch', 'open', 'clean:tempfiles' ]
    grunt.registerTask 'c',         [ 'clean:tempfiles' ]
    grunt.registerTask 'cc',        [ 'clean:generated' ]
    grunt.registerTask 'install',   [ 'shell:install' ]
    grunt.registerTask 'node',      [ 'shell:node' ]
    grunt.registerTask 'kill',      [ 'shell:kill' ]
    grunt.registerTask 'sleep',     [ 'shell:sleep' ]
