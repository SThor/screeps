var utility = require('utility');

var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
      // Setup
      if(!Memory.visitedRooms) Memory.visitedRooms = [] 

      // Find exit (if there is none yet)
      exits = creep.room.find(FIND_EXIT);
      for(var exit of exits)
      {
        console.log(exit)
        if(!Memory.visitedRooms.filter(room => room == exit.room))
        {
          console.log("adding " + exit);
          Memory.visitedRooms.push(exit.room);
        }
      }

    }
};

module.exports = roleScout;
