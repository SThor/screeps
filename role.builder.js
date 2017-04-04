var common = require("common")

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(targets) {
                if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.say(common.COLOR_PATH.builder.work)
                    creep.moveTo(targets, {visualizePathStyle: common.COLOR_PATH.builder.work});
                }
            }else{
                targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                
                // targets.sort((a,b) => a.hits - b.hits);
                
                if(targets) {
                    creep.say('🚧 repair');
                    creep.say(common.COLOR_PATH.builder.work)
                    if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: common.COLOR_PATH.builder.work});
                    }
                }
            }
        }
        else {
            var containerWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            })
            if(containerWithEnergy){
                if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.say(common.COLOR_PATH.builder.refill)
                    creep.moveTo(containerWithEnergy, {visualizePathStyle: common.COLOR_PATH.builder.refill})
                }
            }else{
             // in case of empty container
                var targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(targetEnergy, {visualizePathStyle: common.COLOR_PATH.builder.refill});
                }
            }
            // var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            // if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
            // }
            // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
        }
    }
};

module.exports = roleBuilder;