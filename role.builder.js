var common = require("common")

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var containerWithEnergy;
        var targetEnergy;
        var targets;
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }

        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(targets) {
                if(creep.build(targets) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: common.COLOR_PATH.builder.work});
                }
            }else{
                // targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                //     filter: object => object.hits < object.hitsMax
                // });
                targets = creep.pos.findInRange(FIND_STRUCTURES, 50, {
                    filter: (structure) => {
                        return ( structure.hits < structure.hitsMax)
                            // ( (structure.hits < structure.hitsMax) && (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax/3000) ) ||
                            // ( (structure.hits < structure.hitsMax) && (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax/300) ) 
                    }
                });
                
                
                if(targets) {
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    creep.say('🚧 repair');
                    if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: common.COLOR_PATH.builder.work});
                    }
                }
            }
        }
        else {
            containerWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0) || (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
            })
            if(containerWithEnergy){
                if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerWithEnergy, {visualizePathStyle: common.COLOR_PATH.builder.refill})
                }
            }else{
             // in case of empty container
                // targetEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                // if(creep.pickup(targetEnergy) == ERR_NOT_IN_RANGE) {
                //   creep.moveTo(targetEnergy, {visualizePathStyle: common.COLOR_PATH.builder.refill});
                // }
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