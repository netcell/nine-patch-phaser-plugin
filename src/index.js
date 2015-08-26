var NinePatchCache = require('./NinePatchCache');
/**
 * This function should be called when the image/spritesheet/texture has been loaded
 * @param {String} name - the key to refer to the created NinePatchCache
 * @param {String} imageKey   - REF NinePatchCache
 * @param {String} imageFrame - REF NinePatchCache
 * @param {Number} left       - REF NinePatchCache
 * @param {Number} right      - REF NinePatchCache
 * @param {Number} top        - REF NinePatchCache
 * @param {Number} bottom     - REF NinePatchCache
 */
Phaser.Cache.prototype.addNinePatch = function addNinePatch(name, imageKey, imageFrame, left, right, top, bottom){
	var _ninePatches = this._ninePatches = this._ninePatches || {};
	_ninePatches[name] = new NinePatchCache(this.game, imageKey, imageFrame, left, right, top, bottom);
	console.log(_ninePatches)
}
/** Return an instance of NinePatchCache match with the name */
Phaser.Cache.prototype.getNinePatch = function getNinePatch(name) {
	var _ninePatches = this._ninePatches = this._ninePatches || {};
	return _ninePatches[name];
}
Phaser.NinePatchImage = require('./NinePatchImage');