
execSync = require "exec-sync"
mkpath   = require 'mkpath'

module.exports = (grunt) ->

    pepper = (files) ->
        result = {}
        for joined, list of files
            # console.log files;
            mkpath.sync '.pepper'
            ppr = '.pepper/'+joined+'.coffee'
            pfs = 'tools/pepper -o ' + ppr + ' ' + list.join(' ')
            console.log pfs
            rst = execSync pfs
            console.log rst
            result['js/'+joined+'.js'] = ppr
        result

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        coffee:
            options:
                sourceMap: true
                bare:      true
                joinExt:   '.coffee'
            knix:
                files:
                    pepper
                        'tools':   ['./coffee/tools/*.coffee']
                        'knix':    ['./coffee/knix.coffee']
                        'widget':  ['./coffee/widget.coffee']
                        'window':  ['./coffee/window.coffee']
                        'widgets': ['./coffee/widgets/*.coffee']
                        'audio':   ['./coffee/audio/audio.coffee', './coffee/audio/*.coffee']
                        'main':    ['./coffee/test.coffee', './coffee/main.coffee']

        bower_concat:
            all:
                dest: 'js/lib/bower.js'
                bowerOptions:
                    relative: false
                exclude: ['octicons']

        stylus:
            compile:
                files:
                    'style/bright.css': ['style/bright.styl']
                    'style/dark.css': ['style/dark.styl']

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
            generated:    ["js/*", "style/*.css"]
            tempfiles:    ["coffee/**/.DS_STORE", "js/**/.DS_STORE", "style/**/.DS_STORE", "preview~*"]
            deps:         ["node_modules", "bower_components"]

        shell:
            install:
                command: 'tools/install.sh'
            touch:
                command: 'touch index.html'
            node:
                command: 'node tools/node.js'
            sleep:
                command: 'sleep 1'
            kill:
                command: 'tools/unwatch'
            demo:
                command: 'tools/makedemo.sh'

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

    grunt.registerTask 'build',     [ 'coffee', 'bower_concat', 'stylus', 'shell:touch' ]
    grunt.registerTask 'default',   [ 'build', 'clean:tempfiles' ]
    grunt.registerTask 'test',      [ 'build', 'open', 'clean:tempfiles' ]
    grunt.registerTask 'c',         [ 'clean:tempfiles' ]
    grunt.registerTask 'cc',        [ 'clean:generated' ]
    grunt.registerTask 'rebuild',   [ 'clean', 'shell:install' ]
    grunt.registerTask 'node',      [ 'shell:node' ]
    grunt.registerTask 'kill',      [ 'shell:kill' ]
    grunt.registerTask 'sleep',     [ 'shell:sleep' ]
    grunt.registerTask 'demo',      [ 'shell:demo' ]
