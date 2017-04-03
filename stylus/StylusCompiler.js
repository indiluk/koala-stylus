/**
 * My compiler
 */

'use strict';

var fs          = require('fs'),
	path        = require('path'),
	FileManager = global.getFileManager(),
    Compiler    = require(FileManager.appScriptsDir + '/Compiler.js');

/**
 * My Compiler
 * @param {object} config compiler config
 */
function StylusCompiler(config) {
   Compiler.call(this, config);
}
require('util').inherits(StylusCompiler, Compiler);

module.exports = StylusCompiler;

/**
 * compile file
 * @param  {Object} file    compile file object
 * @param  {Object} emitter  compile event emitter
 */
StylusCompiler.prototype.compile = function (file, emitter) {

    var exec         = require('child_process').exec,
		self         = this,
		filePath     = file.src,
		output       = file.output,
		settings = file.settings || {},
		argv = [
		' -u nib ',
		' -u rupture ',
		' < "' + filePath + '"',
		' > "' + output + '"'
		];

	/*if(settings.prettyHtml) {
		argv = ['--pretty'].concat(argv);
	}*/

	var globalSettings  = this.getGlobalSettings(),
		stylusPath = globalSettings.advanced.commandPath || 'stylus';

	if (stylusPath.match(/ /)) {
		stylusPath = '"'+ stylusPath +'"';
	}

	global.debug(stylusPath);
	exec([stylusPath].concat(argv).join(' '), {cwd: path.dirname(filePath), timeout: 5000}, function (error, stdout, stderr) {
		if (error !== null) {
			emitter.emit('fail');
			self.throwError(stderr, filePath);
		} else {
			emitter.emit('done');
		}

		// do always handler
		emitter.emit('always');
	});

}