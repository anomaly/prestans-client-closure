//
// Copyright (c) 2015, Anomaly Software Pty Ltd.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of Anomaly Software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL ETERNITY TECHNOLOGIES BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
goog.provide('prestans.types.Time');

goog.require('goog.date.DateTime');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');

goog.require('prestans');

/**
 * @constructor
 * @param {!Object=} opt_config
 * @param {!boolean=} opt_raiseValidateException whether to raise exception if validate fails in constructor
 */
prestans.types.Time = function(opt_config, opt_raiseValidateException) {

    if(!goog.isDef(opt_raiseValidateException))
        opt_raiseValidateException = true;

    //setup default config if missing
    if(!goog.isDef(opt_config))
        opt_config = {};

    /**
     * @private
     * @type {!string}
     */
    this.name_ = "Time";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * @private
     * @type {?goog.date.DateTime}
     */
    this.value_ = null;

    /**
     * @private
     * @type {?goog.date.DateTime}
     */
    this.default_ = null;

    /**
     * @private
     * @type {!goog.i18n.DateTimeFormat}
     */
    this.format_ = new goog.i18n.DateTimeFormat(prestans.types.Time.FORMAT);

    /**
     * @private
     * @type {!goog.i18n.DateTimeParse}
     */
    this.parse_ = new goog.i18n.DateTimeParse(prestans.types.Time.FORMAT);

    //setup default values if config missing
    if(!goog.isDef(opt_config)) {
        opt_config = {
            required: true
        };
    }

    /**
     * Required defaults to true
     * @private
     * @type {!boolean}
     */
    this.required_ = true;
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;

    //Check that default is defined and not null
    if(goog.isDefAndNotNull(opt_config.defaultValue)) {

        if(opt_config.defaultValue instanceof goog.date.DateTime) {
            this.default_ = opt_config.defaultValue;
            this.value_ = this.default_;

            console.log("default datetime");
        }
        else if(opt_config.defaultValue === prestans.types.Time.NOW) {
            this.default_ = opt_config.defaultValue;
            this.value_ = new goog.date.DateTime();

            console.log("default now");
        }
        else if(goog.isString(opt_config.defaultValue)) {
            var parsedDate_ = goog.date.Date.fromIsoString(opt_config.defaultValue);
            if(goog.isNull(parsedDate_))
                throw this.name_+": default time string incorrect format";
            else {
                var datetime_ = new goog.date.DateTime(0, 0, 0, parsedDate_.getHours(), parsedDate_.getMinutes(), parsedDate_.getSeconds());

                this.default_ = datetime_;
                this.value_ = datetime_;
            }
        }
        else
            throw this.name_+": default must be of acceptable type";
    }
    
    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value) && opt_raiseValidateException)
            throw this.name_+": provided value is not valid";
    }
};

/** @const {!string} */
prestans.types.Time.FORMAT = 'HH:mm:ss';

/** @const {!string} */
prestans.types.Time.NOW = 'prestans.types.Time.NOW';

/**
 * @final
 *
 * @return {?goog.date.DateTime}
 */
prestans.types.Time.prototype.getValue = function() {
    return this.value_;
};

/**
 * @final
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Time.prototype.setValue = function(value) {

    //Allow null for not required
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(this.required_ && value == null)
        return false;

    //Allow goog.date.Date
    if(value instanceof goog.date.DateTime) {
        this.value_ = value;
        return true;
    }

    //Try to parse string
    if(goog.isString(value)) {
        var parsedDate_ = new goog.date.DateTime(); 
        this.parse_.parse(value, parsedDate_);
        if(goog.isNull(parsedDate_))
            return false;
        else {
            var datetime_ = new goog.date.DateTime(0, 0, 0, parsedDate_.getHours(), parsedDate_.getMinutes(), parsedDate_.getSeconds());
            this.value_ = datetime_;
            return true;
        }

    }

    //Unacceptable type
    return false;
};

/**
 * @return {?string}
 */
prestans.types.Time.prototype.getJSONObject = function() {
    if(this.value_ instanceof goog.date.DateTime) {
        return this.format_.format(this.value_);
    }
    else
        return null;
};
