module.exports = {
  travelTo: function(creep, target, opts) {
    // Breadcrumbs for harvesters
    if(creep.memory.role == "harvester")
    {
      // If there is no road or TODO construction site here
      if(Room.lookAt(creep.pos).filter(obj => obj.type == 'structure' && obj.structure.StructureType == STRUCTURE_ROAD) == [])
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

