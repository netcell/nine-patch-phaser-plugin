/**
 * Return true if value is a String
 * TODO: Use a better method to prevent error
 */
function isString(value){
	return typeof value === 'string';
}

export default class NinePatchImage extends Phaser.Image {
	/**
	 * @param {Phaser.Game} game - REF Phaser.Image params
	 * @param {Number} x = 0 - REF Phaser.Image params
	 * @param {Number} y = 0 - REF Phaser.Image params
	 * @param  {String || NinePatchCache} key - The NinePatchCache used by the NinePatchImage. It can be a string which is a reference to the Cache entry, or an instance of a NinePatchCache.
	 * @param {NinePatchCache} ninePatchImages - To be deprecated.
	 */
	constructor(game, x = 0, y = 0, key, ninePatchImages) {
		super(game, x, y, PIXI.Texture.emptyTexture);
		game.add.existing(this);
		/** Get the NinePatchCache instance */
		if (!ninePatchImages) {
			if (typeof key == 'string') {
				ninePatchImages = game.cache.getNinePatch(key);
			} else if (true /** Check if key is an instance of NinePatchCache */) {
				ninePatchImages = key;
			} else throw new Error('NinePatchImage key must be a String or an instance of NinePatchCache');
		}
		this.ninePatchImages = ninePatchImages;
		/** @type {Array} Generate 9 instances of Phaser.Image as the children of this */
		this.images = ninePatchImages.CreateImages(this);
		/** Setting measures for this */
		this.currentWidth  = ninePatchImages.width;
		this.currentHeight = ninePatchImages.height;
		/** Update images' positions */
		this.UpdateImageSizes();
	}
	/** Get/Set for measures to update images' positions on chagnges */
	get targetWidth() {
		return this.currentWidth;
	}
	get targetHeight() {
		return this.currentHeight;
	}
	set targetWidth(value) {
		this.currentWidth = value;
		this.UpdateImageSizes();
	}
	set targetHeight(value) {
		this.currentHeight = value;
		this.UpdateImageSizes();
	}
	/** Update images' positions to match the new measures */
	UpdateImageSizes() {
		var {ninePatchImages, currentWidth, currentHeight, images, anchor} = this;
		/** Get the positions for the new measures */
		var dimensions = ninePatchImages.CreateDimensionMap(currentWidth, currentHeight);
		/** Calculate the padding to match the anchor */
		var paddingX = anchor.x * currentWidth;
		var paddingY = anchor.y * currentHeight;
		/** Loop through all images and update the positions */
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let image = images[i][j];
				let dimension = dimensions[i][j];
				image.x = dimension.x - paddingX;
				image.y = dimension.y - paddingY;
				image.width = dimension.width;
				image.height = dimension.height;
			}
		}
	}
}
