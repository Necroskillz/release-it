var Insight = require('insight'),
    when = require('when'),
    pkg = require('../package.json');

var stopTracking;

Insight.prototype._initialTrack = function(callback) {
    if (!this.optOut) {
        this._track(
            'config',
            this._options['non-interactive'] ? 'non-interactive' : 'interactive',
            this._options.increment,
            this._options.distRepo ? 'distRepo' : 'no-distRepo',
            this._options.private ? 'private' : 'public'
        );
    }
    callback();
};

Insight.prototype._track = function() {
    if (this._options['dry-run']) {
        if(!stopTracking) {
            this.track('dry-run');
            stopTracking = true;
        }
    } else {
        this.track.apply(this, arguments);
    }
};

Insight.prototype._askPermission = function(options) {
    this._options = options;
    return when.promise(function(resolve) {
        if (this.optOut === undefined) {
            this.askPermission(null, function() {
                this._initialTrack(resolve);
            });
        } else {
            this._initialTrack(resolve);
        }
    }.bind(this));
};

module.exports = new Insight({
    trackingCode: 'UA-65084890-1',
    pkg: pkg
});
