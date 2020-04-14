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
    // move
    return creep.moveTo(target, opts)
  },

  harvestFood: function(creep) { // TODO: remember chosen source so that we don't flip flop
    // List all sources sorted by range
    var sources = creep.room.find(FIND_SOURCES);
    sources = _.sortBy(sources, s => creep.pos.getRangeTo(s));
    // Try to harvest closest one
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
    {
      // If we can't, go to closest accessible one
      for(var source of sources)
      {
        if(this.travelTo(creep, source, {visualizePathStyle: {stroke: '#ffaa00'}}) == OK) { break; }
      }
    }
  }
};
