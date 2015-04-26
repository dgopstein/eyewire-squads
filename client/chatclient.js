/**
* Templates
*/

var nMessageDefault = 3;

Template.chatbox.helpers({
    messages: function() {
        var lim = Session.get('nMessages') || nMessageDefault;
        var msgs = Messages.find({}, { sort: { time: -1}, limit: lim }).fetch().reverse();
        return msgs;
    }


})

Meteor.subscribe("userStatus");

Meteor.users.find({ "status.online": true}).observe({
  added: function(id) {
    console.log("came online: ",id);
  },
  removed: function(id) {
    console.log("went offline: ",id);
  }
});

Template.user_list.helpers({
  squadmates: function() {
    //return Meteor.users.find({"status.online": true});
    return Squads.find({"squadname": Session.get("squadname")});
  }
});

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var name = Session.get('username') || 'Anonymous Neuron'
      var message = document.getElementById('message');

      if (message.value != '') {
        Session.set('nMessages', (Session.get('nMessages') || nMessageDefault) + 1); // set the number of messages to display

        Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
        });

        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
}
