//OnlineUsers = new Meteor.Collection("online-users");

if (Meteor.isServer) {
  Meteor.users.allow({
    'insert': function (userId,doc) { return true; },
    'remove': function (userId,doc) { return true; },
    'update': function (userId,doc) { return true; }
  });

  Accounts.addAutopublishFields({
    loggedInUser: ['profile', 'username', 'status', 'emails'],
      otherUsers: ['profile', 'username', 'status']
  });

  Meteor.methods({
    onlineUsers: function () {
      var users = Meteor.users.find({"status.online": true});
      console.log("onlineUsers: ", users);
      return users;
    }
  });

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true })//, { fields: {username: 1, squadname: 0 }});
  });
  
  //Meteor.publish("online-users", function(){
  //  var users = Meteor.users.find({"status.online": true});
  //  console.log("online-users: ", users);
  //  return users;
  //})
}

if (Meteor.isClient) {
  
}

