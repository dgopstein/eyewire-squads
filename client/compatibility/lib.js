function jsonDup(x) {
  return JSON.parse(JSON.stringify(x));
}

function getSquadmates() {
  return Squads.find({"squadname": Session.get("squadname")}, {
    sort: {username: 1},
    fields: {
      username: 1,
      squadname: 1,
      'forevers.points': 1,
      'forevers.cubes': 1,
      'forevers.accuracy.tp': 1,
      'forevers.accuracy.fp': 1,
      'forevers.accuracy.fn': 1,
      'forevers.time': 1,
    }
  });
}

function sanitizeAccuracy(forev) {
  var dup = jsonDup(forev);
  dup.accuracy.tp = dup.accuracy.tp || 1;
  dup.accuracy.fp = dup.accuracy.fp || 0;
  dup.accuracy.fn = dup.accuracy.fn || 0;

  return dup;
}

function sumForevs(fArr) {
  var stats = {
    points: 0,
    cubes: 0,
    accuracy: {
      tp: 1,
      fp: 0,
      fn: 0
    },
    time: 0,
  };
  
  console.log("forevsfArr: ", fArr);
  fArr.forEach(function (forev) {
    stats.points += parseInt(forev.points);
    stats.cubes += parseInt(forev.cubes);
    stats.accuracy.tp += parseInt(forev.accuracy.tp);
    stats.accuracy.fp += parseInt(forev.accuracy.fp);
    stats.accuracy.fn += parseInt(forev.accuracy.fn);
    stats.time += forev.time;
  });
  
  return stats;
}

function diffForevs(a, b) {
  console.log('a b: ', [a, b]);
  var res = jsonDup(a);
  res.points -= parseInt(b.points);
  res.cubes  -= parseInt(b.cubes);
  // take most recent accuracy
  res.accuracy.tp = parseInt(b.accuracy.tp);
  res.accuracy.fp = parseInt(b.accuracy.fp);
  res.accuracy.fn = parseInt(b.accuracy.fn);
  res.time -= b.time;
  console.log('res: ', res);
  
  return res;
}

// What has the player done since joining the squad?
function userDiff(user) {
  var firstForever = sanitizeAccuracy(user.forevers[0]);
  var lastForever = sanitizeAccuracy(user.forevers[user.forevers.length-1]);
  console.log('first last', [firstForever, lastForever]);

  var diff = diffForevs(lastForever, firstForever);

  return diff;
}

function getStats() {
  var squadmates = getSquadmates();

  console.log('squadmates: ', squadmates.fetch());
  var stats = sumForevs(squadmates.map(userDiff));
  
  return stats;
}


