var utility = require('utility');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.state) creep.memory.state = "harvest";

        if(creep.memory.state == "repair" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.state = "harvest";
            creep.say('🔄 harvest');
        }
        if(creep.memory.state == "harvest" && creep.store.getFreeCapacity() == 0) {
            creep.memory.state = "repair";
            creep.say('🚧 repair');
        }

        if(creep.memory.state == "repair") {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            targets.sort((a,b) => (a.hits/a.hitsMax) - (b.hits/b.hitsMax));
            // targets = _.sortBy(targets, s => creep.pos.getRangeTo(s));
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    utility.travelTo(creep, targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                utility.travelTo(creep, source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;
