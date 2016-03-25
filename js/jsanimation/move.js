function getStyle(obj, attr) {

    if (obj.currentStyle)
        return attr == 'opacity' ? parseInt(parseFloat(obj.currentStyle[attr]) * 100) : parseInt(obj.currentStyle[attr]);
    else return attr == 'opacity' ? parseInt(parseFloat(getComputedStyle(obj, false)[attr]) * 100) : parseInt(getComputedStyle(obj, false)[attr]);
}

function startMove(oDiv, iTarget, attr) {
    clearInterval(oDiv.timer);

    oDiv.timer = setInterval(function() {

        var iAttr = getStyle(oDiv, attr);

        var t = (iTarget - iAttr);
        var iSpeed = t > 0 ? Math.ceil(t / 8) : Math.floor(t / 8);

        if (iAttr == iTarget) {
            clearInterval(oDiv.timer);

        } else {

            if (attr == 'opacity') {
                oDiv.style.opacity = (iAttr + iSpeed) / 100;

                oDiv.style.filter = "alpha(opacity=" + (iAttr + iSpeed) + ")";
            } else {
                oDiv.style[attr] = iAttr + iSpeed + 'px';
            };
        }
    }, 20)
}
