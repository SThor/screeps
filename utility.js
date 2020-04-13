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
    creep.moveTo(target, opts)
  }
}

