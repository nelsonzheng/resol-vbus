/*! resol-vbus | Copyright (c) 2015, Nelson Zheng | MIT license */
'use strict';



var _ = require('lodash');


var configurationData = require('./resol-deltasol-bs-2009-data');

var BaseConfigurationOptimizer = require('../base-configuration-optimizer');



var ResolDeltaSolBs2009ConfigurationOptimizer = BaseConfigurationOptimizer.extend({

    optimizeConfiguration: function($) {
        // TODO?
    },

}, {

    deviceAddress: 0x427B,

    configurationData: configurationData,

});



module.exports = ResolDeltaSolBs2009ConfigurationOptimizer;
