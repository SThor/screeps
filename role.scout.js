var utility = require('utility');

var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
      // Setup
      if(!Memory.visitedRooms) Memory.visitedRooms = [] 

      if(!creep.memory.target)
      {
        // Find exit (if there is none yet)
        creep.memory.startingRoom = creep.room.name;
        exits = Game.map.describeExits(creep.room.name)
        for(var exit in exits)
        {
          console.log(exits[exit])
          if(Memory.visitedRooms.filter((room) => room == exits[exit]).length == 0)
          {
            let targetList = creep.room.find(creep.room.findExitTo(exits[exit]));
            creep.memory.target = targetList[0]; //let's just take the first one...
            creep.memory.roomToVisit = exits[exit];
            break;
          }
        }
      }
      else if(creep.room.name == creep.memory.roomToVisit)
      {
        // we made it :) let's start over
        console.log("Visited new room: " + creep.room.name);
        Memory.visitedRooms.push(creep.room.name);
        delete creep.memory.target;
        delete creep.memory.roomToVisit;

        // Before we go, let's set up a few things
        creep.room.createFlag(creep.room.find(FIND_STRUCTURES, {filter: 
                                                            function(object) 
                                                            {
                                                              return object.structureType == STRUCTURE_CONTROLLER;
                                                            }
                                                          })[0])
      }
      else
      {
        // need to recreate it because memory stringifies and thus loses classes
        let target = new RoomPosition(creep.memory.target.x, creep.memory.target.y, creep.memory.target.roomName)
        utility.travelTo(creep, target);
      }

    }
};

module.exports = roleScout;

