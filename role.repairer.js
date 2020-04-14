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
            if(typeof creep.memory.target == 'undefined'){
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                targets.sort((a,b) => (a.hits/a.hitsMax) - (b.hits/b.hitsMax));
                // targets = _.sortBy(targets, s => creep.pos.getRangeTo(s));
                if(targets.length) {
                    creep.memory.target = targets[0];
                }
            }
            let tmpTarget = Game.getObjectById(creep.memory.target.id)
            let errCode = creep.repair(tmpTarget)
            if(errCode == ERR_NOT_IN_RANGE){
                utility.travelTo(creep, tmpTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }else if(tmpTarget.hits/tmpTarget.hitsMax > 0.5) {
                delete creep.memory.target;
            }
        }
        else {
          utility.harvestFood(creep);
        }
    }
};

module.exports = roleRepairer;
