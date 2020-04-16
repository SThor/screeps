var utility = require('utility');

var roleHarvester = {
    pickupRessources: function(creep){
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.state) creep.memory.state = "harvest";

        if(creep.memory.state == "harvest" && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.state = "recharge";
            creep.say('⚡ recharge');
        }
        if(creep.memory.state == "recharge" && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.state = "harvest";
            creep.say('🔄 harvest');
        }

        if(creep.memory.state == "harvest") {
            
            //todo: pick up dropped ressources
            if(this.pickupRessources(creep)){
                return;
            }
          utility.harvestFood(creep);  
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            targets = _.sortBy(targets, t => creep.pos.getRangeTo(t));
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    utility.travelTo(creep, targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
