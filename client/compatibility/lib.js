function jsonDup(x) {
  return JSON.parse(JSON.stringify(x));
}

function getSquadmates() {
  return Squads.find({"squadname": Session.get("squadname")}, {sort: {username: 1}});
}

function sumForevs(fArr) {
  var stats = {
    points: 0,
    cubes: 0,
    accuracy: {
      tps: 0,
      fps: 0,
      fns: 0
    }
  };
  
  console.log("forevsfArr: ", fArr);
  fArr.forEach(function (forev) {
    stats.points += parseInt(forev.points);
    stats.cubes += parseInt(forev.cubes);
    stats.accuracy.tps += parseInt(forev.accuracy.tps);
    stats.accuracy.fps += parseInt(forev.accuracy.fps);
    stats.accuracy.fns += parseInt(forev.accuracy.fns);
  });
  
  return stats;
}

function diffForevs(a, b) {
  var res = jsonDup(a);
  res.points -= parseInt(b.points);
  res.cubes  -= parseInt(b.cubes);
  res.accuracy.tps -= parseInt(b.accuracy.tps);
  res.accuracy.fps -= parseInt(b.accuracy.fps);
  res.accuracy.fns -= parseInt(b.accuracy.fns);
  
  return res;
}

function getStats() {
  var squadmates = getSquadmates();

  console.log('squadmates: ', squadmates);
  var firstForevs = sumForevs(squadmates.map(function (user) { return user.forevers[0]; }));
  var lastForevs = sumForevs(squadmates.map(function (user) { return user.forevers[user.forevers.length-1]; }));

  var stats = diffForevs(lastForevs, firstForevs);
  
  return stats;
}


