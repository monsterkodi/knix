
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    wid = knix.init()

    c = new Console()
    # c.shade()

    # _________________________________________________________________________ connector test

    Test.connectorBox()
    Test.connectorBox().setPos pos(200,400)

    # _________________________________________________________________________ raise

    c.raise()

    # _________________________________________________________________________ widget test

    # Test.stageButtons()
    # Test.sliderHello()
    # Test.sliderAndValue()
    # Test.svgPath()

    return
