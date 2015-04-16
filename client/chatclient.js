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

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      if (Meteor.user())
        var name = Meteor.user().profile.name;
      else
        var name = 'Anonymous';
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
