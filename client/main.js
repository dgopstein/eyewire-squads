var password = '123456'

function addUserToSquad(username, squadname) {
  var user = getOrCreateUser(username)

  Session.set("squadname", squadname);
  console.log("adding user [", username, "] to squad: ", squadname)
  Squads.upsert(username, {$set: {username: username, squadname: squadname}}, function(res) {console.log('updating user with squadname: ', res)});
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}    

function getOrCreateUser(username) {
  var user = Meteor.users.findOne({userId: username});
  if (!user) {
    console.log("creating user: ",
      //Meteor.users.insert({userId: username, username: username, password: password})
      Accounts.createUser({username: username, password: password})
    )
  }
  user = Meteor.users.findOne({userId: username});
  Session.set('username', username);


  console.log("user: ", user);
 
  loginUser(username);

  return user;
}

function loginUser(username) {
  Meteor.loginWithPassword(username, password, function(x) {console.log('loginWithPassword: ', x)});
}

var squadname;

function start() {
  var ewUrl = 'https://beta.eyewire.org/'
  //var ewUrl = 'https://eyewire.org/'
  
  // Set oauth code from URL
  auth_code = getUrlParameter('code');
  if (auth_code) {
    Session.set('ew_auth_code', auth_code);
  }

  var ew_auth_code = Session.get('ew_auth_code');
  console.log('ew_auth_code: ', ew_auth_code);

  var usernameParam = getUrlParameter('username');
  squadname = getUrlParameter('squad');
  if (usernameParam) {
    getOrCreateUser(usernameParam);
    addUserToSquad(usernameParam, squadname);
  } else {
    // Send user to oauth endpoint to login
    if (typeof(ew_access_token) === 'undefined') {
      if (typeof(ew_auth_code) === 'undefined') {
        window.location = ewUrl + 'oauth2/1.0/auth?response_type=code&redirect_uri=http://eyewire-squads.herokuapp.com&client_id=4'
      }
  
      // Exchange their auth code for an access token
      $.post(ewUrl + 'oauth2/1.0/exchange', {
        auth_code: ew_auth_code,
        secret: 'M85MQeIZMyshv1PKVlFe26Eh8SKoVZhZwi5Yq12i4l3mCS2DovFE6qQRLViaJSVq4ZCPdWjlx7oJcO8S3QdKGi349ntnamDS3ZPUFnRUDJ5eZgjf0MM+QHaY+wOKBpkRpAXI8X8Tpo7VD5yqTqjt2VTL4U40UjkuNtFGoiRFdfw=',
        redirect_uri: 'http://eyewire-squads.herokuapp.com',
        client_id: 4,
        grant_type: 'authorization_code'
      }, function(response) {
        console.log("exchange response: ", response);
        ew_access_token = response.access_token;
        console.log("ew_access_token", ew_access_token);
  
        $.get(ewUrl + "2.0/account?access_token="+ew_access_token, function (response) {
          console.log("account: ", response);
          var username = response.username;
          var mUser = getOrCreateUser(username);
          addUserToSquad(username, squadname);
          console.log("meteor user: ", mUser);
        });
      })
    }
  }

  
}

Meteor.startup(start);
