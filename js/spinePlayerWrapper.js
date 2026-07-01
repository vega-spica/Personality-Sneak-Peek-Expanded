class SpinePlayerWrapper {
    constructor(container) {
        this.container = container;
        this.player = null;
    }

    load(url, animation) {
        this.dispose();

        this.player = new spine.SpinePlayer(this.container, {
            skelUrl: url + ".skel",
            atlasUrl: url + ".atlas",

            animation: animation,

            alpha: true,
            showControls: false,
            interactive: true,

            viewport: {
                x: -157.5,
                y: -126.25,
                width: 375,
                height: 562.5
            }
        });
    }

    dispose() {
        if (!this.player) return;

        if (typeof this.player.dispose === "function")
            this.player.dispose();

        this.container.innerHTML = "";

        this.player = null;
    }
}