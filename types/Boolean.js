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
goog.provide('prestans.types.Boolean');

goog.require('prestans');

/**
 * @constructor
 * @param {!Object=} opt_config
 * @param {!boolean=} opt_raiseValidateException whether to raise exception if validate fails in constructor
 */
prestans.types.Boolean = function(opt_config, opt_raiseValidateException) {

    if(!goog.isDef(opt_raiseValidateException))
        opt_raiseValidateException = true;

    //setup default values if config missing
    if(!goog.isDef(opt_config)) {
        opt_config = {
            required: true
        };
    }

    /**
     * @private
     * @type {!string}
     */
    this.name_ = "Boolean";
    if(goog.isDefAndNotNull(opt_config.opt_name))
        this.name_ = opt_config.opt_name;

    /**
     * required defaults to true
     * @type {!boolean}
     * @private
     */
    this.required_ = true;
    if(goog.isDef(opt_config.required))
        this.required_ = opt_config.required;

    if(goog.isDef(opt_config.defaultValue)) {

        /**
         * @type {?boolean}
         * @private
         */
        this.default_ = opt_config.defaultValue;

        /**
         * @type {?boolean}
         * @private
         */
        this.value_ = this.default_;
    }

    //run setter once to check if value is valid
    if(goog.isDef(opt_config.value)) {
        if(!this.setValue(opt_config.value) && opt_raiseValidateException)
            throw this.name_+": provided value is not valid";
    }
};

/**
 * @final
 *
 * @return {?boolean}
 */
prestans.types.Boolean.prototype.getValue = function() {
    return this.value_;
};

/**
 * @final
 * @param {*} value
 *
 * @return {!boolean}
 */
prestans.types.Boolean.prototype.setValue = function(value) {

    //Check required
    if(!this.required_ && value == null) {
        this.value_ = null;
        return true;
    }
    else if(!goog.isBoolean(value))
        return false;

    this.value_ = value;
    return true;
};