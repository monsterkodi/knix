
class Connector extends Widget

    @create: (config) ->

        con = knix.setup config,
            type: 'connector'
        con
