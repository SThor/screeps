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
            creep.memory.target = creep.room.findExitTo(exits[exit])
            break;
          }
        }
      }
      else if(creep.memory.target.roomName == creep.memory.startingRoom)
      {
        // we made it :) let's start over
        Memory.visitedRooms.push(creep.room.name);
        delete creep.memory.target;
      }
      else
      {
        utility.travelTo(creep, creep.memory.target);
      }

    }
};

module.exports = roleScout;
