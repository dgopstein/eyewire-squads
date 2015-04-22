
if (Meteor.isServer) {
  Meteor.users.allow({
    'insert': function (userId,doc) { return true; },
    'remove': function (userId,doc) { return true; }
  });
}

if (Meteor.isClient) {
  
}

