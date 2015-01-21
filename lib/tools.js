
function str(o) { return JSON.stringify(o); }

function log() {
    var s = "";
    for (var i = 0; i < arguments.length; i++)
    {
        s += str(arguments[i]);
        if (i < arguments.length-1) { s += " "; }
    }
    console.log(s);
}

function newElement(type)
{
    e = new Element(type);
    e.identify();
    return e;
}

String.prototype.fmt = function()
{
  return this.sprintf.apply(this, [].slice.call(arguments));
}

Element.addMethods({
    raise: function(element) {
        if (!(element = $(element))) return;
        element.parentElement.appendChild(element);
    }
});
