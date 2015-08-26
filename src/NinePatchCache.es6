export default class NinePatchCache {
	/**
	 * * @param {Phaser.Game} game - A reference to the currently running game.
	 * @param {String} imageKey - The reference to the Cache entry of the texture to cut from.
	 * @param {String|Number} imageFrame - If the texture to cut from is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
	 * @param  {Number} left - position of left most point of the center patch
	 * @param  {Number} right - position of right most point of the center patch
	 * @param  {Number} top - position of top most point of the center patch
	 * @param  {Number} bottom - position of bottom most point of the center patch
	 */
	constructor(game, imageKey, imageFrame, left, right, top, bottom) {
		this.game       = game;
		this.imageKey   = imageKey;
		this.imageFrame = imageFrame;
		this.left       = left;
		this.right      = right;
		this.top        = top;
		this.bottom     = bottom;
		/** @type {Array} The 3x3 Texture Array that would be generated for the 9 patches */
		this.textures    = [[], [], []];
		/** Image Cache - Support for earlier version of Phaser */
		let _images = game.cache._images || game.cache._cache.image;
		let imageCache = _images[imageKey];
		/** @type {PIXI.BaseTexture} Get the Base Texture to process */
		this.baseTexture = PIXI.BaseTextureCache[imageKey] ? PIXI.BaseTextureCache[imageKey] : imageCache.base;
		/** @type {Number} Positions and measures of the texture on the base texture */
		if (imageFrame) {
			let frameData  = imageCache.frameData;
			let frame      = frameData._frames[frameData._frameNames[imageFrame]];
			this.x = frame.x;
			this.y = frame.y;
			this.width = frame.width;
			this.height = frame.height;
		} else {
			/** The texture would cover the entire base texture if it isn't a part of a sprite sheet or texture atlas */
			this.x      = 0;
			this.y      = 0;
			this.width  = this.baseTexture.width;
			this.height = this.baseTexture.height;
		}
		/** Process the data */
		this.CreateFrameData();
	}
	/** Generate the textures */
	CreateFrameData() {
		var {imageKey, baseTexture, textures} = this;
		/** Calculate the position of each patch relative to the texture */
		var dimensions = this.CreateDimensionMap();
		/** Offset by the position of the frame */
		if (this.imageFrame !== undefined) {
			for (let i = 2; i >= 0; i--) {
				for (let j = 2; j >= 0; j--) {
					let item = dimensions[i][j];
					item.x += this.x;
					item.y += this.y;
				};
			};
		}
		/** Generate the textures by cutting from the base texture */
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				this.textures[i][j] = new PIXI.Texture(baseTexture, dimensions[i][j]);
			}
		}
	}
	/**
	 * Get the position of each patch based on the measures specified
	 * @param {Number} width = this.width
	 * @param {Number} height = this.height
	 * @return {Array} The positions array mapped with the patches
	 */
	CreateDimensionMap(width = this.width, height = this.height) {
		var {left, right, top, bottom} = this;
		/** position of the patches in the middle (horizontally and vertically) */
		var midH = width - left - right;
		var midV = height - top - bottom;
		/**
		 * @type {Array} The positions array mapped with the patches
		 * Would be returned at the end of this function
		 */
		var dimensions = [ [], [], [] ];
		/** Set positions for each patch and record in the dimensions*/
		for (let i = 2; i >= 0; i--) {
			for (let j = 2; j >= 0; j--) {
				let item = dimensions[i][j] = {};
				switch (i) {
					case 0:
						item.height = top;
						item.y = 0;
					break;
					case 1:
						item.height = midV;
						item.y = top;
					break;
					case 2:
						item.height = bottom;
						item.y = top + midV;
					break;
				}
				switch (j) {
					case 0:
						item.width = left;
						item.x = 0;
					break;
					case 1:
						item.width = midH;
						item.x = left;
					break;
					case 2:
						item.width = right;
						item.x = left + midH;
					break;
				}
			};
		};

		return dimensions;
	}
	/**  */
	/**
	 * Generate patch images
	 * @param {DisplayObject}[Optional] Either a Phaser.Group or a Phaser.Image/Sprite/... that would contain these images
	 * @return {Array} 3x3 Array of Phaser.Image for the patches
	 */
	CreateImages(parent) {
		var textures = this.textures;
		/** @type {Array} The returned array */
		var images = [ [], [], [] ];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				/** @type {Phaser.Image} The generated image */
				let image = images[i][j] = this.game.add.image(0, 0, textures[i][j]);
				/** Add the image to parent */
				if (parent) {
					/** TODO: Write an isFunction check */
					if (parent.add) parent.add(image);
					else if (parent.addChild) parent.addChild(image);
				}
			}
		}
		return images;
	}
}