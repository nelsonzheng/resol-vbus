/*! resol-vbus | Copyright (c) 2013-2014, Daniel Wippermann | MIT license */
'use strict';



var _ = require('lodash');


var Packet = require('./resol-vbus').Packet;
var Specification = require('./resol-vbus').Specification;



describe('Specification', function() {

    describe('constructor', function() {

        it('should be a constructor function', function() {
            expect(Specification).to.be.a('function');

            var spec = new Specification();

            expect(spec).to.be.an.instanceOf(Specification);
        });

        it('should have resonable defaults', function() {
            var spec = new Specification();

            expect(spec.language).to.equal('en');
        });

        it('should copy selected options', function() {
            var options = {
                language: 'de',
                junk: 'JUNK'
            };

            var spec = new Specification(options);

            expect(spec.language).to.equal(options.language);
            expect(spec.junk).to.equal(undefined);
        });

        // the specificationData option if checked later

    });

    describe('.loadSpecificationData', function() {

        var rawSpecificationData1 = {
            'filteredPacketFieldSpecs': [{
                'filteredPacketFieldId': 'DemoValue1',
                'packetId': '00_0010_7722_10_0100',
                'fieldId': '000_2_0',
                'name': {
                    'ref': 'Flow temperatureL',
                    'en': 'Flow temperature',
                    'de': 'T-VL',
                    'fr': 'Température Départ'
                },
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_7722_0100_000_2_0'
            }]
        };

        var checkSpecificationData1 = function(specData) {
            expect(specData).to.be.an('object');

            var fpfs = specData.filteredPacketFieldSpecs;

            expect(fpfs).to.be.an('array');
            expect(fpfs.length).to.equal(1);
            expect(fpfs [0].filteredPacketFieldId).to.equal('DemoValue1');
            expect(fpfs [0].packetId).to.equal('00_0010_7722_10_0100');
            expect(fpfs [0].fieldId).to.equal('000_2_0');
            expect(fpfs [0].name.de).to.equal('T-VL');
            expect(fpfs [0].type).to.be.an('object');
            expect(fpfs [0].getRawValue).to.be.a('function');
            expect(fpfs [0].packetSpec).to.be.an('object');
            expect(fpfs [0].packetFieldSpec).to.be.an('object');
        };

        it('should be a function', function() {
            expect(Specification.loadSpecificationData).to.be.a('function');
        });

        it('should work correctly without arguments', function() {
            var spec = new Specification();

            var specData = Specification.loadSpecificationData();

            expect(specData).to.be.an('object');
            expect(specData.units).to.be.an('object', 'units');
            expect(specData.types).to.be.an('object', 'types');
            expect(specData.deviceSpecs).to.be.an('object', 'deviceSpecs');
            expect(specData.packetSpecs).to.be.an('object', 'packetSpecs');
            expect(specData.getDeviceSpecification).to.be.a('function');
            expect(specData.getPacketSpecification).to.be.a('function');
            expect(specData.filteredPacketFieldSpecs).to.equal(undefined);
        });

        it('should work correctly with raw spec data', function() {
            var rawSpecData = rawSpecificationData1;

            var specData = Specification.loadSpecificationData(rawSpecData);

            checkSpecificationData1(specData);
        });

        it('should work correctly as part of the constructor', function() {
            var rawSpecData = rawSpecificationData1;

            var spec = new Specification({
                specificationData: rawSpecData
            });

            checkSpecificationData1(spec.specificationData);
        });
    });

    describe('.storeSpecificationData', function() {

        var rawSpecificationData1 = {
            'filteredPacketFieldSpecs': [{
                'filteredPacketFieldId': 'DemoValue1',
                'packetId': '00_0010_7722_10_0100',
                'fieldId': '000_2_0',
                'name': {
                    'ref': 'Flow temperatureL',
                    'en': 'Flow temperature',
                    'de': 'T-VL',
                    'fr': 'Température Départ'
                },
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_7722_0100_000_2_0',
                'setRawValue': '_0010_7722_0100_000_2_0'
            }]
        };

        it('should be a function', function() {
            expect(Specification.storeSpecificationData).to.be.a('function');
        });

        it('should work correctly without arguments', function() {
            var spec = new Specification();

            var rawSpecData = Specification.storeSpecificationData();

            expect(rawSpecData).to.be.an('object');
            expect(rawSpecData.units).to.equal(undefined);
            expect(rawSpecData.types).to.equal(undefined);
            expect(rawSpecData.deviceSpecs).to.equal(undefined);
            expect(rawSpecData.packetSpecs).to.equal(undefined);
            expect(rawSpecData.getDeviceSpecification).to.equal(undefined);
            expect(rawSpecData.getPacketSpecification).to.equal(undefined);
            expect(rawSpecData.filteredPacketFieldSpecs).to.equal(undefined);
        });

        it('should work correctly with an unfiltered spec', function() {
            var spec = new Specification();

            var rawSpecData = Specification.storeSpecificationData(spec);

            expect(rawSpecData).to.be.an('object');
            expect(rawSpecData.units).to.equal(undefined);
            expect(rawSpecData.types).to.equal(undefined);
            expect(rawSpecData.deviceSpecs).to.equal(undefined);
            expect(rawSpecData.packetSpecs).to.equal(undefined);
            expect(rawSpecData.getDeviceSpecification).to.equal(undefined);
            expect(rawSpecData.getPacketSpecification).to.equal(undefined);
            expect(rawSpecData.filteredPacketFieldSpecs).to.equal(undefined);
        });

        it('should work correctly with a filtered spec', function() {
            var rawSpecDataInput = rawSpecificationData1;

            var spec = new Specification({
                specificationData: rawSpecDataInput
            });

            var rawSpecData = Specification.storeSpecificationData(spec);

            expect(rawSpecData).to.eql(rawSpecDataInput);
        });

    });

    describe('#getUnitById', function() {

        it('should be a method', function() {
            expect(Specification.prototype.getUnitById).to.be.a('function');
        });

        it('should work correctly for known units', function() {
            var spec = new Specification();

            var unit = spec.getUnitById('None');

            expect(unit).to.be.an('object');
        });

        it('should work correctly for unknown units', function() {
            var spec = new Specification();

            var unit = spec.getUnitById('Unknown');

            expect(unit).to.equal(undefined);
        });

    });

    describe('#getTypeById', function() {

        it('should be a method', function() {
            expect(Specification.prototype.getTypeById).to.be.a('function');
        });

        it('should work correctly for known types', function() {
            var spec = new Specification();

            var unit = spec.getTypeById('Number_1_None');

            expect(unit).to.be.an('object');
        });

        it('should work correctly for unknown types', function() {
            var spec = new Specification();

            var unit = spec.getTypeById('Unknown');

            expect(unit).to.equal(undefined);
        });

    });

    describe('#getDeviceSpecification', function() {

        it('should be a method', function() {
            expect(Specification.prototype.getDeviceSpecification).to.be.a('function');
        });

        it('should work correctly with a number pair', function() {
            var spec = new Specification();

            var deviceSpec = spec.getDeviceSpecification(0x7721, 0x0010);

            expect(deviceSpec).to.be.an('object');
            expect(deviceSpec.deviceId).to.be.a('string');
            expect(deviceSpec.channel).to.equal(0);
            expect(deviceSpec.selfAddress).to.equal(0x7721);
            expect(deviceSpec.peerAddress).to.equal(0x0010);
            expect(deviceSpec.name).to.equal('DeltaSol E [Regler]');
            expect(deviceSpec.fullName).to.equal('DeltaSol E [Regler]');
        });

        it('should work correctly with a number triple', function() {
            var spec = new Specification();

            var deviceSpec = spec.getDeviceSpecification(0x7721, 0x0010, 1);

            expect(deviceSpec).to.be.an('object');
            expect(deviceSpec.deviceId).to.be.a('string');
            expect(deviceSpec.channel).to.equal(1);
            expect(deviceSpec.selfAddress).to.equal(0x7721);
            expect(deviceSpec.peerAddress).to.equal(0x0010);
            expect(deviceSpec.name).to.equal('DeltaSol E [Regler]');
            expect(deviceSpec.fullName).to.equal('VBus #1: DeltaSol E [Regler]');
        });

        it('should work correctly with a header and "source"', function() {
            var header = new Packet({
                channel: 1,
                destinationAddress: 0x0010,
                sourceAddress: 0x7721,
            });

            var spec = new Specification();

            var deviceSpec = spec.getDeviceSpecification(header, 'source');

            expect(deviceSpec).to.be.an('object');
            expect(deviceSpec.deviceId).to.be.a('string');
            expect(deviceSpec.channel).to.equal(1);
            expect(deviceSpec.selfAddress).to.equal(0x7721);
            expect(deviceSpec.peerAddress).to.equal(0x0010);
            expect(deviceSpec.name).to.equal('DeltaSol E [Regler]');
            expect(deviceSpec.fullName).to.equal('VBus #1: DeltaSol E [Regler]');
        });

        it('should work correctly with a header and "destination"', function() {
            var header = new Packet({
                channel: 1,
                destinationAddress: 0x0010,
                sourceAddress: 0x7721,
            });

            var spec = new Specification();

            var deviceSpec = spec.getDeviceSpecification(header, 'destination');

            expect(deviceSpec).to.be.an('object');
            expect(deviceSpec.deviceId).to.be.a('string');
            expect(deviceSpec.name).to.equal('DFA');
            expect(deviceSpec.fullName).to.equal('VBus #1: DFA');
        });

        it('should work correctly for an unknown device', function() {
            var spec = new Specification();

            var deviceSpec = spec.getDeviceSpecification(0x772F, 0x0010, 1);

            expect(deviceSpec).to.be.an('object');
            expect(deviceSpec.deviceId).to.be.a('string');
            expect(deviceSpec.channel).to.equal(1);
            expect(deviceSpec.selfAddress).to.equal(0x772F);
            expect(deviceSpec.peerAddress).to.equal(0x0010);
            expect(deviceSpec.name).to.equal('Unknown Device (0x772F)');
            expect(deviceSpec.fullName).to.equal('VBus #1: Unknown Device (0x772F)');
        });

    });

    describe('#getPacketSpecification', function() {

        it('should be a method', function() {
            expect(Specification.prototype.getPacketSpecification).to.be.a('function');
        });

        it('should work correctly with a number quadruple', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(1, 0x0010, 0x7721, 0x0100);

            expect(packetSpec).to.be.an('object');
            expect(packetSpec.packetId).to.be.a('string');
            expect(packetSpec.channel).to.equal(1);
            expect(packetSpec.destinationAddress).to.equal(0x0010);
            expect(packetSpec.sourceAddress).to.equal(0x7721);
            expect(packetSpec.command).to.equal(0x0100);
            expect(packetSpec.destinationDevice).to.be.an('object');
            expect(packetSpec.sourceDevice).to.be.an('object');
            expect(packetSpec.fullName).to.equal('VBus #1: DeltaSol E [Regler]');
            expect(packetSpec.packetFields).to.be.an('array');
            expect(packetSpec.packetFields.length).to.be.above(0);
        });

        it('should work correctly with a header', function() {
            var header = new Packet({
                channel: 1,
                destinationAddress: 0x0010,
                sourceAddress: 0x7721,
                command: 0x0100,
            });

            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(header);

            expect(packetSpec).to.be.an('object');
            expect(packetSpec.packetId).to.be.a('string');
            expect(packetSpec.destinationDevice).to.be.an('object');
            expect(packetSpec.sourceDevice).to.be.an('object');
            expect(packetSpec.packetFields).to.be.an('array');
            expect(packetSpec.packetFields.length).to.be.above(0);
        });

        it('should work correctly with a packet ID string with protocol version', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification('01_0010_7721_10_0100');

            expect(packetSpec).to.be.an('object');
            expect(packetSpec.packetId).to.be.a('string');
            expect(packetSpec.destinationDevice).to.be.an('object');
            expect(packetSpec.sourceDevice).to.be.an('object');
            expect(packetSpec.packetFields).to.be.an('array');
            expect(packetSpec.packetFields.length).to.be.above(0);
        });

        it('should work correctly with a packet ID string without protocol version', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification('01_0010_7721_0100');

            expect(packetSpec).to.be.an('object');
            expect(packetSpec.packetId).to.be.a('string');
            expect(packetSpec.destinationDevice).to.be.an('object');
            expect(packetSpec.sourceDevice).to.be.an('object');
            expect(packetSpec.packetFields).to.be.an('array');
            expect(packetSpec.packetFields.length).to.be.above(0);
        });

        it('should work correctly for an unknown packet', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(1, 0x0010, 0x772F, 0x0100);

            expect(packetSpec).to.be.an('object');
            expect(packetSpec.packetId).to.be.a('string');
            expect(packetSpec.destinationDevice).to.be.an('object');
            expect(packetSpec.sourceDevice).to.be.an('object');
            expect(packetSpec.packetFields).to.be.an('array');
            expect(packetSpec.packetFields.length).to.equal(0);
        });

    });

    describe('#getPacketFieldSpecification', function() {

        var rawSpecificationData1 = {
            'filteredPacketFieldSpecs': [{
                'filteredPacketFieldId': 'DemoValue1',
                'packetId': '00_0010_7722_10_0100',
                'fieldId': '000_2_0',
                'name': {
                    'ref': 'Flow temperatureL',
                    'en': 'Flow temperature',
                    'de': 'T-VL',
                    'fr': 'Température Départ'
                },
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_7722_0100_000_2_0'
            }]
        };

        it('should be a method', function() {
            expect(Specification.prototype.getPacketFieldSpecification).to.be.a('function');
        });

        it('should work correctly with a packet spec and a field ID', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(1, 0x0010, 0x7721, 0x0100);

            var packetFieldSpec = spec.getPacketFieldSpecification(packetSpec, '000_2_0');

            expect(packetFieldSpec).to.be.an('object');
            expect(packetFieldSpec.fieldId).to.be.a('string');
            expect(packetFieldSpec.name).to.be.a('string');
            expect(packetFieldSpec.type).to.be.an('object');
            expect(packetFieldSpec.type.typeId).to.be.a('string');
            expect(packetFieldSpec.type.rootTypeId).to.be.a('string');
            expect(packetFieldSpec.type.precision).to.be.a('number');
            expect(packetFieldSpec.type.unit).to.be.an('object');
            expect(packetFieldSpec.type.unit.unitCode).to.be.a('string');
            expect(packetFieldSpec.type.unit.unitText).to.be.a('string');
        });

        it('should work correctly with a packet field ID string with protocol version', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            expect(packetFieldSpec).to.be.an('object');
            expect(packetFieldSpec.fieldId).to.be.a('string');
            expect(packetFieldSpec.name).to.be.a('string');
            expect(packetFieldSpec.type).to.be.an('object');
            expect(packetFieldSpec.type.typeId).to.be.a('string');
            expect(packetFieldSpec.type.rootTypeId).to.be.a('string');
            expect(packetFieldSpec.type.precision).to.be.a('number');
            expect(packetFieldSpec.type.unit).to.be.an('object');
            expect(packetFieldSpec.type.unit.unitCode).to.be.a('string');
            expect(packetFieldSpec.type.unit.unitText).to.be.a('string');
        });

        it('should work correctly with a packet field ID string without protocol version', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_0100_000_2_0');

            expect(packetFieldSpec).to.be.an('object');
            expect(packetFieldSpec.fieldId).to.be.a('string');
            expect(packetFieldSpec.name).to.be.a('string');
            expect(packetFieldSpec.type).to.be.an('object');
            expect(packetFieldSpec.type.typeId).to.be.a('string');
            expect(packetFieldSpec.type.rootTypeId).to.be.a('string');
            expect(packetFieldSpec.type.precision).to.be.a('number');
            expect(packetFieldSpec.type.unit).to.be.an('object');
            expect(packetFieldSpec.type.unit.unitCode).to.be.a('string');
            expect(packetFieldSpec.type.unit.unitText).to.be.a('string');
        });

        it('should work correctly for a missing packet spec', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification(null, '000_2_0');

            expect(packetFieldSpec).to.equal(undefined);
        });

        it('should work correctly for a missing field ID', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(1, 0x0010, 0x7721, 0x0100);

            var packetFieldSpec = spec.getPacketFieldSpecification(packetSpec, null);

            expect(packetFieldSpec).to.equal(undefined);
        });

        it('should work correctly for an unknown field ID', function() {
            var spec = new Specification();

            var packetSpec = spec.getPacketSpecification(1, 0x0010, 0x7721, 0x0100);

            var packetFieldSpec = spec.getPacketFieldSpecification(packetSpec, '000_0_0');

            expect(packetFieldSpec).to.equal(undefined);
        });

        it('should work correctly with a filtered spec and a custom ID string', function() {
            var spec = new Specification({
                specificationData: rawSpecificationData1
            });

            var packetFieldSpec = spec.getPacketFieldSpecification('DemoValue1');

            expect(packetFieldSpec).to.be.an('object');
            expect(packetFieldSpec.fieldId).to.be.a('string');
            expect(packetFieldSpec.name).to.be.an('object');
            expect(packetFieldSpec.name.ref).to.be.a('string');
            expect(packetFieldSpec.type).to.be.an('object');
            expect(packetFieldSpec.type.typeId).to.be.a('string');
            expect(packetFieldSpec.type.rootTypeId).to.be.a('string');
            expect(packetFieldSpec.type.precision).to.be.a('number');
            expect(packetFieldSpec.type.unit).to.be.an('object');
            expect(packetFieldSpec.type.unit.unitCode).to.be.a('string');
            expect(packetFieldSpec.type.unit.unitText).to.be.a('string');
        });

    });

    describe('#getRawValue', function() {

        it('should be a method', function() {
            expect(Specification.prototype.getRawValue).to.be.a('function');
        });

        it('should work correctly with all arguments', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var buffer = new Buffer('b822', 'hex');

            var rawValue = spec.getRawValue(packetFieldSpec, buffer, 0, buffer.length);

            expect(rawValue).to.be.closeTo(888.8, 0.05);
        });

        it('should work correctly without start and end arguments', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var buffer = new Buffer('b822', 'hex');

            var rawValue = spec.getRawValue(packetFieldSpec, buffer);

            expect(rawValue).to.be.closeTo(888.8, 0.05);
        });

        it('should work correctly with a too small buffer', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var buffer = new Buffer('', 'hex');

            var rawValue = spec.getRawValue(packetFieldSpec, buffer, 0, buffer.length);

            expect(rawValue).to.equal(null);
        });

        it('should work correctly with a partial buffer', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var buffer = new Buffer('b8', 'hex');

            var rawValue = spec.getRawValue(packetFieldSpec, buffer, 0, buffer.length);

            expect(rawValue).to.be.closeTo(18.4, 0.05);
        });

        it('should work correctly for an unknown packet field spec', function() {
            var spec = new Specification();

            var buffer = new Buffer('b822', 'hex');

            var rawValue = spec.getRawValue(null, buffer, 0, buffer.length);

            expect(rawValue).to.equal(null);
        });

        it('should work correctly without a buffer', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var rawValue = spec.getRawValue(packetFieldSpec);

            expect(rawValue).to.equal(null);
        });

        it('should work correctly with a filtered spec and conversion', function() {
            var rawSpecificationData1 = {
                'filteredPacketFieldSpecs': [{
                    'filteredPacketFieldId': 'DemoValue1',
                    'packetId': '01_0010_7721_10_0100',
                    'fieldId': '000_2_0',
                    'name': 'T1',
                    'type': 'Number_0_1_DegreesFahrenheit',
                }]
            };
            var spec = new Specification({
                specificationData: rawSpecificationData1,
            });

            var packetFieldSpec = spec.getPacketFieldSpecification('DemoValue1');

            var buffer = new Buffer('0000', 'hex');

            var rawValue = spec.getRawValue(packetFieldSpec, buffer, 0, buffer.length);

            expect(rawValue).to.be.closeTo(32.0, 0.05);
        });

    });

    describe('#convertRawValue', function() {

        var specData = Specification.loadSpecificationData();

        var unitsByFamily = {};

        var knownFamilyUnitCodes = [];

        _.forEach(specData.units, function(unit) {
            var uf = unit.unitFamily;
            if (uf) {
                if (!_.has(unitsByFamily, uf)) {
                    unitsByFamily [uf] = [];
                }

                unitsByFamily [uf].push(unit);
                knownFamilyUnitCodes.push(unit.unitCode);
            }
        });

        var content = [];
        _.forEach(_.keys(unitsByFamily).sort(), function(uf) {
            var units = unitsByFamily [uf];

            content.push('describe(\'Unit Family ' + JSON.stringify(uf) + '\', function() {');
            content.push('');
            // content.push('var units = unitsByFamily [\'' + uf + '\'];');
            // content.push('');

            _.forEach(units, function(sourceUnit, index) {
                var targetUnit = units [index + 1] || units [0];

                content.push('it(\'should convert from ' + JSON.stringify(sourceUnit.unitCode) + ' to ' + JSON.stringify(targetUnit.unitCode) + '\', function() {');
                content.push('expectConversion(0, \'' + sourceUnit.unitCode + '\', \'' + targetUnit.unitCode + '\').closeTo(undefined, delta);');
                content.push('expectConversion(1000000, \'' + sourceUnit.unitCode + '\', \'' + targetUnit.unitCode + '\').closeTo(undefined, delta);');
                content.push('});');
                content.push('');
            });

            content.push('});');
            content.push('');
        });

        // console.log(content.join('\n'));

        it('should be a method', function() {
            expect(Specification.prototype).property('convertRawValue').a('function');
        });

        var checkedSourceUnitCodes = [];
        var checkedTargetUnitCodes = [];

        var expectConversion = function(rawValue, sourceUnitCode, targetUnitCode) {
            checkedSourceUnitCodes.push(sourceUnitCode);
            checkedTargetUnitCodes.push(targetUnitCode);

            var spec = new Specification();

            var sourceUnit = specData.units [sourceUnitCode];
            var targetUnit = specData.units [targetUnitCode];

            expect(sourceUnit).a('object').property('unitCode').equal(sourceUnitCode);
            expect(targetUnit).a('object').property('unitCode').equal(targetUnitCode);

            var error, result;
            try {
                result = spec.convertRawValue(rawValue, sourceUnit, targetUnit);
            } catch (ex) {
                error = ex;
            }

            expect(error).equal(undefined);
            expect(result).a('object').property('unit').equal(targetUnit);

            return expect(result).property('rawValue').a('number');
        };

        var delta = 0.000000001;

        describe('Unit Family "Energy"', function() {

            it('should convert from "Btus" to "GramsCO2Gas"', function() {
                expectConversion(0, 'Btus', 'GramsCO2Gas').closeTo(0, delta);
                expectConversion(1000000, 'Btus', 'GramsCO2Gas').closeTo(74323.12035187425, delta);
            });

            it('should convert from "GramsCO2Gas" to "GramsCO2Oil"', function() {
                expectConversion(0, 'GramsCO2Gas', 'GramsCO2Oil').closeTo(0, delta);
                expectConversion(10, 'GramsCO2Gas', 'GramsCO2Oil').closeTo(22.397476, 0.0000005);
            });

            it('should convert from "GramsCO2Oil" to "KiloBtus"', function() {
                expectConversion(0, 'GramsCO2Oil', 'KiloBtus').closeTo(0, delta);
                expectConversion(1000000, 'GramsCO2Oil', 'KiloBtus').closeTo(6007.267605633803, delta);
            });

            it('should convert from "KiloBtus" to "KilogramsCO2Gas"', function() {
                expectConversion(0, 'KiloBtus', 'KilogramsCO2Gas').closeTo(0, delta);
                expectConversion(1000000, 'KiloBtus', 'KilogramsCO2Gas').closeTo(74323.12035187425, delta);
            });

            it('should convert from "KilogramsCO2Gas" to "KilogramsCO2Oil"', function() {
                expectConversion(0, 'KilogramsCO2Gas', 'KilogramsCO2Oil').closeTo(0, delta);
                expectConversion(10, 'KilogramsCO2Gas', 'KilogramsCO2Oil').closeTo(22.397476, 0.0000005);
            });

            it('should convert from "KilogramsCO2Oil" to "KilowattHours"', function() {
                expectConversion(0, 'KilogramsCO2Oil', 'KilowattHours').closeTo(0, delta);
                expectConversion(1000000, 'KilogramsCO2Oil', 'KilowattHours').closeTo(1760563.3802816903, delta);
            });

            it('should convert from "KilowattHours" to "MegaBtus"', function() {
                expectConversion(0, 'KilowattHours', 'MegaBtus').closeTo(0, delta);
                expectConversion(1000000, 'KilowattHours', 'MegaBtus').closeTo(3412.128, delta);
            });

            it('should convert from "MegaBtus" to "MegawattHours"', function() {
                expectConversion(0, 'MegaBtus', 'MegawattHours').closeTo(0, delta);
                expectConversion(1, 'MegaBtus', 'MegawattHours').closeTo(0.293072241, delta);
            });

            it('should convert from "MegawattHours" to "TonsCO2Gas"', function() {
                expectConversion(0, 'MegawattHours', 'TonsCO2Gas').closeTo(0, delta);
                expectConversion(1000000, 'MegawattHours', 'TonsCO2Gas').closeTo(253600, delta);
            });

            it('should convert from "TonsCO2Gas" to "TonsCO2Oil"', function() {
                expectConversion(0, 'TonsCO2Gas', 'TonsCO2Oil').closeTo(0, delta);
                expectConversion(10, 'TonsCO2Gas', 'TonsCO2Oil').closeTo(22.397476, 0.0000005);
            });

            it('should convert from "TonsCO2Oil" to "WattHours"', function() {
                expectConversion(0, 'TonsCO2Oil', 'WattHours').closeTo(0, delta);
                expectConversion(10, 'TonsCO2Oil', 'WattHours').closeTo(17605633.8, 0.05);
            });

            it('should convert from "WattHours" to "Btus"', function() {
                expectConversion(0, 'WattHours', 'Btus').closeTo(0, delta);
                expectConversion(1000000, 'WattHours', 'Btus').closeTo(3412128, delta);
            });

        });

        describe('Unit Family "Pressure"', function() {

            it('should convert from "Bars" to "PoundsForcePerSquareInch"', function() {
                expectConversion(0, 'Bars', 'PoundsForcePerSquareInch').closeTo(0, delta);
                expectConversion(10, 'Bars', 'PoundsForcePerSquareInch').closeTo(145.037738, delta);
            });

            it('should convert from "PoundsForcePerSquareInch" to "Bars"', function() {
                expectConversion(0, 'PoundsForcePerSquareInch', 'Bars').closeTo(0, delta);
                expectConversion(100, 'PoundsForcePerSquareInch', 'Bars').closeTo(6.89475728, delta);
            });

        });

        describe('Unit Family "Temperature"', function() {

            it('should convert from "DegreesCelsius" to "DegreesFahrenheit"', function() {
                expectConversion(0, 'DegreesCelsius', 'DegreesFahrenheit').closeTo(32, delta);
                expectConversion(100, 'DegreesCelsius', 'DegreesFahrenheit').closeTo(212, delta);
            });

            it('should convert from "DegreesFahrenheit" to "DegreesCelsius"', function() {
                expectConversion(32, 'DegreesFahrenheit', 'DegreesCelsius').closeTo(0, delta);
                expectConversion(212, 'DegreesFahrenheit', 'DegreesCelsius').closeTo(100, delta);
            });

        });

        describe('Unit Family "Time"', function() {

            it('should convert from "Days" to "Hours"', function() {
                expectConversion(0, 'Days', 'Hours').closeTo(0, delta);
                expectConversion(10, 'Days', 'Hours').closeTo(240, delta);
            });

            it('should convert from "Hours" to "Minutes"', function() {
                expectConversion(0, 'Hours', 'Minutes').closeTo(0, delta);
                expectConversion(10, 'Hours', 'Minutes').closeTo(600, delta);
            });

            it('should convert from "Minutes" to "Seconds"', function() {
                expectConversion(0, 'Minutes', 'Seconds').closeTo(0, delta);
                expectConversion(10, 'Minutes', 'Seconds').closeTo(600, delta);
            });

            it('should convert from "Seconds" to "Days"', function() {
                expectConversion(0, 'Seconds', 'Days').closeTo(0, delta);
                expectConversion(86400, 'Seconds', 'Days').closeTo(1, delta);
            });

        });

        describe('Unit Family "Volume"', function() {

            it('should convert from "CubicMeters" to "Gallons"', function() {
                expectConversion(0, 'CubicMeters', 'Gallons').closeTo(0, delta);
                expectConversion(10, 'CubicMeters', 'Gallons').closeTo(2641.72, 0.005);
            });

            it('should convert from "Gallons" to "Liters"', function() {
                expectConversion(0, 'Gallons', 'Liters').closeTo(0, delta);
                expectConversion(10, 'Gallons', 'Liters').closeTo(37.8541, 0.00005);
            });

            it('should convert from "Liters" to "CubicMeters"', function() {
                expectConversion(0, 'Liters', 'CubicMeters').closeTo(0, delta);
                expectConversion(10000, 'Liters', 'CubicMeters').closeTo(10, delta);
            });

        });

        describe('Unit Family "VolumeFlow"', function() {

            it('should convert from "CubicMetersPerHour" to "GallonsPerHour"', function() {
                expectConversion(0, 'CubicMetersPerHour', 'GallonsPerHour').closeTo(0, delta);
                expectConversion(10, 'CubicMetersPerHour', 'GallonsPerHour').closeTo(2641.72, 0.005);
            });

            it('should convert from "GallonsPerHour" to "GallonsPerMinute"', function() {
                expectConversion(0, 'GallonsPerHour', 'GallonsPerMinute').closeTo(0, delta);
                expectConversion(600, 'GallonsPerHour', 'GallonsPerMinute').closeTo(10, delta);
            });

            it('should convert from "GallonsPerMinute" to "LitersPerHour"', function() {
                expectConversion(0, 'GallonsPerMinute', 'LitersPerHour').closeTo(0, delta);
                expectConversion(10, 'GallonsPerMinute', 'LitersPerHour').closeTo(2271.2475, 0.00005);
            });

            it('should convert from "LitersPerHour" to "LitersPerMinute"', function() {
                expectConversion(0, 'LitersPerHour', 'LitersPerMinute').closeTo(0, delta);
                expectConversion(6000, 'LitersPerHour', 'LitersPerMinute').closeTo(100, delta);
            });

            it('should convert from "LitersPerMinute" to "CubicMetersPerHour"', function() {
                expectConversion(0, 'LitersPerMinute', 'CubicMetersPerHour').closeTo(0, delta);
                expectConversion(1000, 'LitersPerMinute', 'CubicMetersPerHour').closeTo(60, delta);
            });

        });

        describe('Units', function() {

            it('should have checked all units as source units', function() {
                expect(_.uniq(checkedSourceUnitCodes).sort()).eql(knownFamilyUnitCodes.sort());
            });

            it('should have checked all units as target units', function() {
                expect(_.uniq(checkedTargetUnitCodes).sort()).eql(knownFamilyUnitCodes.sort());
            });

        });

    });

    describe('#formatTextValueFromRawValue', function() {

        it('should be a methods', function() {
            expect(Specification.prototype.formatTextValueFromRawValue).to.be.a('function');
        });

        it('should work correctly with all arguments', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var textValue = spec.formatTextValueFromRawValue(packetFieldSpec, 888.8, 'DegreesCelsius');

            expect(textValue).to.equal('888.8 °C');
        });

        it('should work correctly without unit', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var textValue = spec.formatTextValueFromRawValue(packetFieldSpec, 888.8);

            expect(textValue).to.equal('888.8 °C');
        });

        it('should work correctly with "None" unit', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var textValue = spec.formatTextValueFromRawValue(packetFieldSpec, 888.8, 'None');

            expect(textValue).to.equal('888.8');
        });

        it('should work correctly without raw value', function() {
            var spec = new Specification();

            var packetFieldSpec = spec.getPacketFieldSpecification('01_0010_7721_10_0100_000_2_0');

            var textValue = spec.formatTextValueFromRawValue(packetFieldSpec, null, 'None');

            expect(textValue).to.equal('');
        });

        it('should work correctly without packet field spec', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValue(null, 888.8, 'DegreesCelsius');

            expect(textValue).to.equal('888.8 °C');
        });

    });

    describe('#formatTextValueFromRawValueInternal', function() {

        it('should be a method', function() {
            expect(Specification.prototype.formatTextValueFromRawValueInternal).to.be.a('function');
        });

        it('should work correctly for root type "Time"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(721, null, 'Time', 0, null);

            expect(textValue).to.equal('12:01');
        });

        it('should work correctly for root type "Weektime"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(3 * 1440 + 721, null, 'Weektime', 0, null);

            expect(textValue).to.equal('Th,12:01');
        });

        it('should work correctly for root type "DateTime"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(409418262, null, 'DateTime', 0, null);

            expect(textValue).to.equal('12/22/2013 15:17:42');
        });

        it('should work correctly for root type "Number" and precision "0"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(12345.6789, null, 'Number', 0, null);

            expect(textValue).to.equal('12346');
        });

        it('should work correctly for root type "Number" and precision "1"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(12345.6789, null, 'Number', 1, null);

            expect(textValue).to.equal('12345.7');
        });

        it('should work correctly for root type "Number" and precision "2"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(12345.6789, null, 'Number', 2, null);

            expect(textValue).to.equal('12345.68');
        });

        it('should work correctly for root type "Number" and precision "3"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(12345.6789, null, 'Number', 3, null);

            expect(textValue).to.equal('12345.679');
        });

        it('should work correctly for root type "Number" and precision "4"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(12345.6789, null, 'Number', 4, null);

            expect(textValue).to.equal('12345.6789');
        });

        it('should work correctly for root type "Number" and precision "10"', function() {
            var spec = new Specification();

            var textValue = spec.formatTextValueFromRawValueInternal(1.23456789, null, 'Number', 10, null);

            expect(textValue).to.equal('1.2345678900');
        });

    });

    describe('#getPacketFieldsForHeaders', function() {

        var header1 = new Packet({
            channel: 1,
            destinationAddress: 0x0010,
            sourceAddress: 0x7722,
            command: 0x0100,
            frameCount: 1,
            frameData: new Buffer('b8220000', 'hex'),
        });

        var header2 = new Packet({
            channel: 2,
            destinationAddress: 0x0010,
            sourceAddress: 0x7722,
            command: 0x0100,
            frameCount: 1,
            frameData: new Buffer('000048dd', 'hex'),
        });

        var header3 = new Packet({
            channel: 3,
            destinationAddress: 0x0010,
            sourceAddress: 0x7E31,
            command: 0x0100,
            frameCount: 4,
            frameData: new Buffer('2211221122112211221122112211221122112211', 'hex'), // data for five frames, but only four advertised
        });

        var rawSpecificationData1 = {
            'filteredPacketFieldSpecs': [{
                'filteredPacketFieldId': 'DemoValue1',
                'packetId': '01_0010_7722_10_0100',
                'fieldId': '000_2_0',
                'name': 'T-flow',
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_7722_0100_000_2_0'
            }, {
                'filteredPacketFieldId': 'DemoValue2',
                'packetId': '02_0010_7722_10_0100',
                'fieldId': '002_2_0',
                'name': 'T-return',
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_7722_0100_002_2_0'
            }]
        };

        var rawSpecificationData2 = {
            'filteredPacketFieldSpecs': [{
                'filteredPacketFieldId': 'DemoValue3',
                'packetId': '01_0010_7722_10_0100',
                'fieldId': '002_2_0',
                'name': 'T-return',
                'type': 'Number_0_1_DegreesFahrenheit',
            }]
        };

        it('should be a method', function() {
            expect(Specification.prototype.getPacketFieldsForHeaders).to.be.a('function');
        });

        it('should work correctly with an unfiltered spec', function() {
            var spec = new Specification();

            var pfs = spec.getPacketFieldsForHeaders([ header1, header2 ]);

            expect(pfs).to.be.an('array');
            expect(pfs.length).to.equal(8);
            expect(pfs [0]).to.be.an('object');
            expect(pfs [0].id).to.equal('01_0010_7722_10_0100_000_2_0');
            expect(pfs [0].packet).to.be.an('object');
            expect(pfs [0].packetSpec).to.be.an('object');
            expect(pfs [0].packetFieldSpec).to.be.an('object');
            expect(pfs [0].origPacketFieldSpec).to.be.an('object');
            expect(pfs [0].name).to.equal('Flow temperature');
            expect(pfs [0].rawValue).to.be.closeTo(888.8, 0.05);
            expect(pfs [0].formatTextValue).to.be.a('function');
            expect(pfs [0].formatTextValue()).to.equal('888.8 °C');
            expect(pfs [5]).to.be.an('object');
            expect(pfs [5].id).to.equal('02_0010_7722_10_0100_002_2_0');
            expect(pfs [5].packet).to.be.an('object');
            expect(pfs [5].packetSpec).to.be.an('object');
            expect(pfs [5].packetFieldSpec).to.be.an('object');
            expect(pfs [5].origPacketFieldSpec).to.be.an('object');
            expect(pfs [5].name).to.equal('Return temperature');
            expect(pfs [5].rawValue).to.be.closeTo( -888.8, 0.05);
            expect(pfs [5].formatTextValue).to.be.a('function');
            expect(pfs [5].formatTextValue()).to.equal('-888.8 °C');
        });

        it('should work correctly with a filtered spec', function() {
            var spec = new Specification({
                specificationData: rawSpecificationData1
            });

            var pfs = spec.getPacketFieldsForHeaders([ header1, header2 ]);

            expect(pfs).to.be.an('array');
            expect(pfs.length).to.equal(2);
            expect(pfs [0]).to.be.an('object');
            expect(pfs [0].id).to.equal('DemoValue1');
            expect(pfs [0].packet).to.be.an('object');
            expect(pfs [0].packetSpec).to.be.an('object');
            expect(pfs [0].packetFieldSpec).to.be.an('object');
            expect(pfs [0].origPacketFieldSpec).to.be.an('object');
            expect(pfs [0].name).to.equal('T-flow');
            expect(pfs [0].rawValue).to.be.closeTo(888.8, 0.05);
            expect(pfs [0].formatTextValue).to.be.a('function');
            expect(pfs [0].formatTextValue()).to.equal('888.8 °C');
            expect(pfs [1]).to.be.an('object');
            expect(pfs [1].id).to.equal('DemoValue2');
            expect(pfs [1].packet).to.be.an('object');
            expect(pfs [1].packetSpec).to.be.an('object');
            expect(pfs [1].packetFieldSpec).to.be.an('object');
            expect(pfs [1].origPacketFieldSpec).to.be.an('object');
            expect(pfs [1].name).to.equal('T-return');
            expect(pfs [1].rawValue).to.be.closeTo( -888.8, 0.05);
            expect(pfs [1].formatTextValue).to.be.a('function');
            expect(pfs [1].formatTextValue()).to.equal('-888.8 °C');
        });

        it('should work correctly with a filtered spec but empty headers', function() {
            var spec = new Specification({
                specificationData: rawSpecificationData1
            });

            var pfs = spec.getPacketFieldsForHeaders([]);

            expect(pfs).to.be.an('array');
            expect(pfs.length).to.equal(2);
            expect(pfs [0]).to.be.an('object');
            expect(pfs [0].id).to.equal('DemoValue1');
            expect(pfs [0].packet).to.equal(undefined);
            expect(pfs [0].packetSpec).to.be.an('object');
            expect(pfs [0].packetFieldSpec).to.be.an('object');
            expect(pfs [0].origPacketFieldSpec).to.be.an('object');
            expect(pfs [0].name).to.equal('T-flow');
            expect(pfs [0].rawValue).to.equal(undefined);
            expect(pfs [0].formatTextValue).to.be.a('function');
            expect(pfs [0].formatTextValue()).to.equal('');
            expect(pfs [1]).to.be.an('object');
            expect(pfs [1].id).to.equal('DemoValue2');
            expect(pfs [1].packet).to.equal(undefined);
            expect(pfs [1].packetSpec).to.be.an('object');
            expect(pfs [1].packetFieldSpec).to.be.an('object');
            expect(pfs [1].origPacketFieldSpec).to.be.an('object');
            expect(pfs [1].name).to.equal('T-return');
            expect(pfs [1].rawValue).to.equal(undefined);
            expect(pfs [1].formatTextValue).to.be.a('function');
            expect(pfs [1].formatTextValue()).to.equal('');
        });

        it('should work correctly with a filtered spec and conversion', function() {
            var spec = new Specification({
                specificationData: rawSpecificationData2
            });

            var pfs = spec.getPacketFieldsForHeaders([ header1, header2 ]);

            expect(pfs).to.be.an('array');
            expect(pfs.length).to.equal(1);
            expect(pfs [0]).to.be.an('object');
            expect(pfs [0].id).to.equal('DemoValue3');
            expect(pfs [0].packet).to.be.an('object');
            expect(pfs [0].packetSpec).to.be.an('object');
            expect(pfs [0].packetFieldSpec).to.be.an('object');
            expect(pfs [0].origPacketFieldSpec).to.be.an('object');
            expect(pfs [0].name).to.equal('T-return');
            expect(pfs [0].rawValue).to.be.closeTo(32.0, 0.05);
            expect(pfs [0].formatTextValue).to.be.a('function');
            expect(pfs [0].formatTextValue()).to.equal('32.0 °F');
        });

        it('should work correctly for partial packets', function() {
            var spec = new Specification({
            });

            var pfs = spec.getPacketFieldsForHeaders([ header3 ]);

            expect(pfs).to.be.an('array');
            expect(pfs.length).to.equal(4);
            expect(pfs [3]).to.be.an('object');
            expect(pfs [3].id).to.equal('03_0010_7E31_10_0100_016_4_0');
            expect(pfs [3].packet).to.be.an('object');
            expect(pfs [3].packetSpec).to.be.an('object');
            expect(pfs [3].packetFieldSpec).to.be.an('object');
            expect(pfs [3].origPacketFieldSpec).to.be.an('object');
            expect(pfs [3].name).to.equal('Gesamtvolumen');
            expect(pfs [3].rawValue).to.equal(null);
            expect(pfs [3].formatTextValue).to.be.a('function');
            expect(pfs [3].formatTextValue()).to.equal('');
        });
    });

    describe('#getFilteredPacketFieldSpecificationsForHeaders', function() {

        var header1 = new Packet({
            channel: 1,
            destinationAddress: 0x0010,
            sourceAddress: 0x7722,
            command: 0x0100,
        });

        var header2 = new Packet({
            channel: 2,
            destinationAddress: 0x0010,
            sourceAddress: 0x7722,
            command: 0x0100,
        });

        it('should be a method', function() {
            expect(Specification.prototype.getFilteredPacketFieldSpecificationsForHeaders).to.be.a('function');
        });

        it('should work correctly', function() {
            var spec = new Specification();

            var fpfs = spec.getFilteredPacketFieldSpecificationsForHeaders([ header1, header2 ]);

            expect(fpfs).to.be.an('array');
            expect(fpfs.length).to.equal(8);
            expect(fpfs [0]).to.be.an('object');
            expect(fpfs [0].filteredPacketFieldId).to.equal('01_0010_7722_10_0100_000_2_0');
            expect(fpfs [0].packetId).to.equal('01_0010_7722_10_0100');
            expect(fpfs [0].fieldId).to.equal('000_2_0');
            expect(fpfs [0].name).to.equal('Flow temperature');
            expect(fpfs [0].type.typeId).to.equal('Number_0_1_DegreesCelsius');
            expect(fpfs [0].getRawValue).to.be.a('function');
            expect(fpfs [4]).to.be.an('object');
            expect(fpfs [4].filteredPacketFieldId).to.equal('02_0010_7722_10_0100_000_2_0');
            expect(fpfs [4].packetId).to.equal('02_0010_7722_10_0100');
            expect(fpfs [4].fieldId).to.equal('000_2_0');
            expect(fpfs [4].name).to.equal('Flow temperature');
            expect(fpfs [4].type.typeId).to.equal('Number_0_1_DegreesCelsius');
            expect(fpfs [4].getRawValue).to.be.a('function');
        });

        it('should work correctly with empty headers', function() {
            var spec = new Specification();

            var fpfs = spec.getFilteredPacketFieldSpecificationsForHeaders([]);

            expect(fpfs).to.be.an('array');
            expect(fpfs.length).to.equal(0);
        });

    });

/*

    it('should get unknown packet fields with filter', function() {
        var buffer = new Buffer('aa10002277100001034224012701003200006401001a350201000047', 'hex');

        var packet = Packet.fromLiveBuffer(buffer, 0, buffer.length);

        var rawSpecificationData = {
            'filteredPacketFieldSpecs': [{
                'fieldId': '000_2_0',
                'name': {
                    'ref': 'Flow temperature',
                    'en': 'Flow temperature',
                    'de': 'Temperatur Vorlauf',
                    'fr': 'Température Départ'
                },
                'type': 'Number_0_1_DegreesCelsius',
                'getRawValue': '_0010_772F_0100_000_2_0',
                'filteredPacketFieldId': '00_0010_772F_0100_10_000_2_0',
                'packetId': '00_0010_772F_0100_10'
            }]
        };

        var spec = new Specification({
            specificationData: rawSpecificationData
        });

        var packetSpec = spec.getPacketSpecification(packet);
        var packetFieldSpec = spec.getPacketFieldSpecification('00_0010_772F_0100_10_000_2_0');

        var packetFields = spec.getPacketFieldsForHeaders([ packet ]);

        expect(packetFields).to.be.an('array');
        expect(packetFields.length).to.equal(1);
        expect(packetFields [0].id).to.equal('00_0010_772F_0100_10_000_2_0');
        expect(packetFields [0].packet).to.equal(undefined);
        expect(packetFields [0].packetSpec).to.equal(undefined);
        expect(packetFields [0].packetFieldSpec).to.equal(packetFieldSpec);
        expect(packetFields [0].origPacketFieldSpec).to.equal(undefined);
    });

*/
});
