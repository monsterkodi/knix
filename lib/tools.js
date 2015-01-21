
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

String.prototype.fmt = function()
{
  return this.sprintf.apply(this, [].slice.call(arguments));
}
