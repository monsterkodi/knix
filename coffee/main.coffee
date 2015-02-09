
document.observe "dom:loaded", ->

    # _________________________________________________________________________ console

    knix.init()

    # _________________________________________________________________________ console

    # c = new Console()
    # c.shade()
    # c.raise()

    # _________________________________________________________________________ widget test

    Test.connectors()
    # Test.stageButtons()
    Test.helloSlider()
    Test.sliderAndValue()
    # Test.svgPath()

    return
