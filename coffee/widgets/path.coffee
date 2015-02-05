
class Path extends Widget

    @create: (config, defaults) ->

        cfg = _.def(config, defaults)

        log cfg
