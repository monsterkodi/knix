
module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        pepper:
            options:
                verbose:        false
                quiet:          true
                pepper:         ['log', 'warn', 'error']
            knix:
                files:
                    'tools':    ['./coffee/tools/*.coffee']
                    'knix':     ['./coffee/knix.coffee']
                    'widget':   ['./coffee/widget.coffee']
                    'window':   ['./coffee/window.coffee']
                    'widgets':  ['./coffee/widgets/value.coffee', './coffee/widgets/hbox.coffee', './coffee/widgets/*.coffee']
                    'windows':  ['./coffee/windows/*.coffee']
                    'audio':    ['./coffee/audio/audio.coffee', './coffee/audio/audiowindow.coffee', './coffee/audio/*.coffee']
                    'tracker':  ['./coffee/audio/tracker/tracker.coffee', './coffee/audio/tracker/trackcell.coffee', './coffee/audio/tracker/*.coffee']
                    'timeline': ['./coffee/audio/timeline/timeline.coffee', './coffee/audio/timeline/*.coffee']
                    'main':     ['./coffee/test.coffee', './coffee/main.coffee']

        salt:
            options:
                dryrun  : false
                verbose : false
                refresh : false
            coffee:
                files:
                    'asciiHeader' : ['./coffee/**/*.coffee']
                    'asciiText'   : ['./coffee/**/*.coffee']
            style: 
                options:
                    verbose     : false
                    textMarker  : '//!!'
                    textPrefix  : '/*'
                    textFill    : '*  '
                    textPostfix : '*/'
                files:
                    'asciiText' : ['./style/*.styl']

        coffee:
            options:
                sourceMap : true
                bare      : true
                joinExt   : '.coffee'
            knix:
                expand  : true
                flatten : true
                cwd     : '.pepper'
                src     : ['*.coffee']
                dest    : 'js'
                ext     : '.js'

        bower_concat:
            all:
                dest: 'js/lib/bower.js'
                bowerOptions:
                    relative: false
                exclude: ['octicons']

        stylus:
            compile:
                files:
                    'style/bright.css': ['style/bright-style.styl']
                    'style/dark.css': ['style/dark-style.styl']

        watch:
          scripts:
            files: ['coffee/**/*.coffee', 'style/*.styl']
            tasks: ['build']
            options:
                spawn:     true
                interrupt: false
          node:
            files: ['tools/node.js']
            tasks: ['kill', 'build', 'node']
            options:
                spawn:     true
                force:     true
                interrupt: true

        bumpup:
            file: 'package.json'

        clean:
            generated:    ["js/*", "style/*.css", ".pepper"]
            tempfiles:    ["**/.DS_STORE", "preview~*"]
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
            web:
                command: 'cd web && bundle exec jekyll serve'
            info_local:
                command: 'cp tools/info-local.json .info.json'
            info_github:
                command: 'cp tools/info-github.json .info.json'

        open:
          browser:
            path: 'index.html'
            app: 'Firefox'

    # npm install --save-dev <nodepackage>          to add <nodepackage> to package.json devDependencies

    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-bower-concat'
    grunt.loadNpmTasks 'grunt-bumpup'
    grunt.loadNpmTasks 'grunt-pepper'
    grunt.loadNpmTasks 'grunt-shell'
    grunt.loadNpmTasks 'grunt-open'

    grunt.registerTask 'build',     [ 'bumpup', 'salt', 'pepper', 'coffee', 'bower_concat', 'stylus', 'shell:touch' ]
    grunt.registerTask 'default',   [ 'build', 'clean:tempfiles' ]
    grunt.registerTask 'test',      [ 'build', 'open', 'clean:tempfiles' ]
    grunt.registerTask 'c',         [ 'clean:tempfiles' ]
    grunt.registerTask 'cc',        [ 'clean:generated' ]
    grunt.registerTask 'rebuild',   [ 'clean', 'shell:install' ]
    grunt.registerTask 'node',      [ 'shell:node' ]
    grunt.registerTask 'kill',      [ 'shell:kill' ]
    grunt.registerTask 'sleep',     [ 'shell:sleep' ]
    grunt.registerTask 'demo',      [ 'shell:info_github', 'build', 'shell:demo', 'shell:info_local' ]
    grunt.registerTask 'web',       [ 'shell:web' ]
