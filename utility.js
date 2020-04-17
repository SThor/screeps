module.exports = {
  travelTo: function(creep, target, opts) {
    // Breadcrumbs for non builders
    if(creep.memory.role != "builder")
    {
      // If there is no road or TODO construction site here
      var structures = creep.room.lookAt(creep.pos);
      structures = structures.filter(obj => obj.type == 'structure' && obj.structure.structureType == STRUCTURE_ROAD)
      if(structures.length == 0)
      {
        // Check room memory and breadcrumb existence
        if(!Memory.room) Memory.room = {}
        if(!Memory.room[creep.pos]) Memory.room[creep.pos] = 0
        // lay breadcrumb 
        Memory.room[creep.pos] += 1
      }
    }
    // move, either by path or to target
    if(target instanceof RoomPosition || target.hasOwnProperty('pos'))
    {
      return creep.moveTo(target, opts)
    }
    else if (target.hasOwnProperty('path')) // target is actually a path
    {
      let style = opts.visualizePathStyle
      style.lineStyle = "dashed"
      new RoomVisual(creep.room.name).poly(target.path, style);
      return creep.moveByPath(target.path)
    }
    else
    {
      console.log("Error while traveling to " + JSON.stringify(target))
    }
  },
  
  // compute cost matrix for pathfinding every tick and cache it in global
  computeCostMatrix : function(roomName) {
    if(!global.costs) global.costs = [];
    if(!global.costs[roomName] || global.lastComputed != Game.time)
    {
      let room = Game.rooms[roomName];
      let costs = new PathFinder.CostMatrix;

      if(!room) // let's not go through the rooms we can't see
      {
        return;
      }

      // roads are 1, assuming plain is 2. Structures are impassable
      room.find(FIND_STRUCTURES).forEach(function(struct) {
        if (struct.structureType == STRUCTURE_ROAD) {
          costs.set(struct.pos.x, struct.pos.y, 1);
        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                   (struct.stuctureType !== STRUCTURE_RAMPART ||
                    !struct.my)) {
          costs.set(struct.pos.x, struct.pos.y, 0xff);
        }
      });

      // creeps are impassable
      room.find(FIND_CREEPS).forEach(function(creep) {
        costs.set(creep.pos.x,creep.pos.y, 0xff)
      });

      global.costs[roomName] = costs
      global.lastComputed = Game.time
    }

    return global.costs[roomName];
  },

  harvestFood: function(creep) { // TODO: remember chosen source so that we don't flip flop
    // List all sources sorted by range
    let sources = creep.room.find(FIND_SOURCES);
    sources = _.sortBy(sources, s => creep.pos.getRangeTo(s));
    // Try to harvest closest one
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
    {
      // If we can't, go to closest accessible one
      for(var source of sources)
      {
        let path = PathFinder.search(creep.pos, 
                                     { pos: source.pos, range: 1},
                                     { 
                                       // default costs higher so that roads can be lower
                                       plainCost: 2,
                                       swampCost: 10,
                                       roomCallback: function(roomName) { // use roomCallback to fill costMatrix with creeps, as well as favour roads
                                         return module.exports.computeCostMatrix(roomName)
                                       },
                                     })
        if(path.incomplete == false)
        {
          this.travelTo(creep, path, {visualizePathStyle: {stroke: '#ffaa00'}});
          break;
        }
      }
    }
  },
};
