'use strict';

const EmqttSymbol = Symbol('enn-egg-mqtt#EMQTT');
const debug = require('debug')('enn-egg-mqtt:app:extend:application.js');

module.exports = {
  get mqtt() {
    if (!this[EmqttSymbol]) {
      debug('[enn-egg-mqtt] create Emqtt instance!');
      this[EmqttSymbol] = {};
    }
    return this[EmqttSymbol];
  },
};
