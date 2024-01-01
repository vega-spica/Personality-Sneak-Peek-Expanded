class Common {
    static applyProperStyle() {
        var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
        if (isMobile) { 
            document.getElementById("root").style.minWidth = '280px';
        }
        else {
            document.getElementById("root").style.minWidth = '800px';
        }
    }

    static setDragonSpine(res_url) {
        new spine.SpineCanvas(document.getElementById("canvas-dragon"), {
                app: new SpineObject(res_url, "idle")
        })
    }
}
