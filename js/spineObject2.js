//when creating a new canvas on the page in html, you must follow the format given in the constructor, ex:
//app: new SpineObject("urlpath", "animationstate", false, {offsetY: 0})
//the constructor is order-sensitive; if you add a variable to it, you must add it at the END, or all existing canavases will break.
class SpineObject {
    constructor(spineUrl, initialAnimation, transparencyFix = false, options = {}) {
        this.skeleton = null;
        this.animationState = null;
        this.binaryUrl = spineUrl + '.skel';
        this.atlasUrl = spineUrl + '.atlas';
        this.initialAnimation = initialAnimation;
        this.transparencyFix = transparencyFix;
        this.skeletonBinary = null;
        this.skeletonScale = null;
        //default camera position set to x=0, -240
        this.offsetX = options.offsetX ?? 0;
        this.offsetY = options.offsetY ?? -240;
        //default scale setting defined here; used for sizing dragon/aura canvases on the page
        //if the default scale is not set to 1, the models will suffer from blurring and artifacts and the static undead images will not match in scale, so do not touch it.
        //background and floor is not scaled here, see the html for that
        this.skeletonScale = options.scale ?? 1;
    }

    loadAssets(canvas) {
        // Load the skeleton file.
        canvas.assetManager.loadBinary(this.binaryUrl);
        // Load the atlas and its pages.
        canvas.assetManager.loadTextureAtlas(this.atlasUrl);
    }

    initialize(canvas) {
        let assetManager = canvas.assetManager;

        // Create the texture atlas.
        var atlas = assetManager.require(this.atlasUrl);

        // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
        var atlasLoader = new spine.AtlasAttachmentLoader(atlas);

        // Create a SkeletonBinary instance for parsing the .skel file.
        var skeletonBinary = new spine.SkeletonBinary(atlasLoader);
        this.skeletonBinary = skeletonBinary;

        // Set the scale to apply during parsing, parse the file, and create a new skeleton.
        skeletonBinary.scale = this.skeletonScale;
        var skeletonData = skeletonBinary.readSkeletonData(assetManager.require(this.binaryUrl));
        this.skeleton = new spine.Skeleton(skeletonData);
        //added this here to center the camera
        //the offset should be defined in html when creating a canvas if the default offsets at the top of this document are not suitable.
        //to extend the edges of the canvas itself, increase the size of the grid-item instead.
        this.skeleton.x = this.offsetX;
        this.skeleton.y = this.offsetY;

        // Create an AnimationState, and set the "run" animation in looping mode.
        var animationStateData = new spine.AnimationStateData(skeletonData);
        this.animationState = new spine.AnimationState(animationStateData);
        if (this.initialAnimation && this.initialAnimation !== "")
            this.animationState.setAnimation(0, this.initialAnimation, true);
    }

    update(canvas, delta) {
        // Update the animation state using the delta time.
        this.animationState.update(delta);
        // Apply the animation state to the skeleton.
        this.animationState.apply(this.skeleton);
        // Let the skeleton update the transforms of its bones.
        this.skeleton.updateWorldTransform();
    }

    render(canvas) {
        let renderer = canvas.renderer;

        // passing the transparencyFix flag to the renderer (for Silent Moon, Spring Day, etc)
        renderer.transparencyFix = this.transparencyFix;

        // Resize the viewport to the full canvas.
        renderer.resize(spine.ResizeMode.Expand);

        // Clear the canvas with a light gray color.
        canvas.clear(0, 0, 0, 0);

        // Begin rendering.
        renderer.begin();
        // Draw the skeleton
        renderer.drawSkeleton(this.skeleton, false);
        // Complete rendering.
        renderer.end();
    }
}