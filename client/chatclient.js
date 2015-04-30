/**
* Templates
*/

var nMessageDefault = 3;

Template.stats.helpers({
  squadPoints: function() { return getStats().points; },
  cubesCompleted: function() { return getStats().cubes; },
  cubeSpeed: function() {
    var stats = getStats();

    var minutes = stats.time/(60*1000);
    var hours = minutes / 60;

    return (stats.cubes / hours).toFixed(2);
  },
  positivityRatio: function() {
    var stats = getStats();
    console.log("posi stats: ", stats);
    return (100 * stats.accuracy.tp / (stats.accuracy.tp + stats.accuracy.fp)).toFixed(0);
  },
});

Template.chatbox.helpers({
    messages: function() {
        var lim = Session.get('nMessages') || nMessageDefault;

        var squadmates = getSquadmates().map(function(squad){ return squad.username });
        var msgs = Messages.find({name: {$in: squadmates }}, { sort: { time: -1}, limit: lim }).fetch().reverse();
        var updatedMsgs = msgs.map(function (msg) {
          //msgs.timeStr = (new Date(msgs.time)).format('HH:MM:SS')
          newMsg = jsonDup(msg);
          newMsg.timeStr = moment(msg.time).format('h:mm a');
          return newMsg;
        });
        //console.log('updatedMsgs: ', updatedMsgs);
        return updatedMsgs;
    }


})

Meteor.subscribe("userStatus");

Meteor.users.find({ "status.online": true}).observe({
  added: function(id) {
    //console.log("came online: ",id);
  },
  removed: function(id) {
    //console.log("went offline: ",id);
  }
});

Template.user_list.helpers({
  squadname: function() { return decodeURIComponent(Session.get("squadname")) },
  squadmates: function() {
    //return Meteor.users.find({"status.online": true});
    return getSquadmates().map(function(squad){
      var username = squad.username;
      //console.log("squad.username: '"+ username+ "'");
      var user = Meteor.users.find({username: username}).fetch();
      squad['onlineClass'] = user && user[0] && user[0]['status'] && user[0]['status'].online ? 'online' : 'offline';
      return squad;
    });
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
