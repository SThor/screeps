var common = require("common")
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var err;
        var containerWithEnergy;
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy > 0 ) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            
            if(err = creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: common.COLOR_PATH.upgrader.work});
            }
        }
        else {
            // var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            // if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(target);
            // }
            containerWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            })
            if(containerWithEnergy){
                if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerWithEnergy, {visualizePathStyle: common.COLOR_PATH.upgrader.refill})
                }
            }else{
                waitingZone = creep.pos.findClosestByRange(FIND_FLAGS, {filter : (f) => f.color == common.WAITING_FLAG_COLOR})
                creep.moveTo(waitingZone, {visualizePathStyle: common.COLOR_PATH.upgrader.refill})
            }
            // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
        }
    }
};

module.exports = roleUpgrader;