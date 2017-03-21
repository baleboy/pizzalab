import { Dough } from "./dough";

declare var firebase: any;
declare var Vue: any;

var app = new Vue({
  el: '#app',
  data: {
    dough: new Dough(),
    userId: null,
    userName: null,
    ready: false
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        this.userId = user.uid;
        this.userName = user.displayName;
        this.loadSettings();
      } else {
        this.userId = null;
        if (!this.ready) this.ready = true;
      }
    }.bind(this));
  },
  methods: {
    signIn: function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    signOut: function() {
      firebase.auth().signOut();
    },
    saveSettings: function() {
      firebase.database().ref('users/' + this.userId + '/dough').set(this.dough);
    },
    loadSettings: function()  {
      firebase.database().ref('users/' + this.userId).once('value').then(function(snapshot) {
        if (snapshot.val()) {
          if (snapshot.val().dough) {
            this.dough.fromJSON(snapshot.val().dough);
          }
        }
        if (!this.ready) this.ready = true;
      }.bind(this));
    },
    reset: function() {
      this.dough = new Dough();
    }
  }
});
