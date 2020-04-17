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
            console.log(creep.memory.target instanceof RoomPosition)
            console.log(creep.pos instanceof RoomPosition)
            creep.memory.roomToVisit = exits[exit];
            break;
          }
        }
      }
      else if(creep.memory.roomToVisit == creep.memory.startingRoom)
      {
        // we made it :) let's start over
        Memory.visitedRooms.push(creep.room.name);
        delete creep.memory.target;
        delete creep.memory.roomToVisit;
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

