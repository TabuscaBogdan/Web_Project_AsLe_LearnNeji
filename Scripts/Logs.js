/**
 * Created by Bogdan on 12.12.2017.
 */
function firebase_small_init() {
    var config = {
        apiKey: "AIzaSyBwlLvwiT77sfrkaoek0s8lhQ0wwqOUefA",
        authDomain: "learnneji.firebaseapp.com",
        databaseURL: "https://learnneji.firebaseio.com",
        projectId: "learnneji",
        storageBucket: "",
        messagingSenderId: "867068928861"
    };
    firebase.initializeApp(config);
}
function firebase_init() {
    var config = {
        apiKey: "AIzaSyBwlLvwiT77sfrkaoek0s8lhQ0wwqOUefA",
        authDomain: "learnneji.firebaseapp.com",
        databaseURL: "https://learnneji.firebaseio.com",
        projectId: "learnneji",
        storageBucket: "",
        messagingSenderId: "867068928861"
    };
    firebase.initializeApp(config);
    //auth change state
    firebase.auth().onAuthStateChanged(function(firebaseUser){
        if(firebaseUser)
        {
            var email = firebaseUser.email;
            localStorage.setItem("NejiLoged",email);
            window.location.replace("../Pages/MainJapanese.html")
        }
        else
        {

        }

    })


}

function logger() {
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    const promise=firebase.auth().signInWithEmailAndPassword(email, password);

}
function register() {
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(email,password);
}
function is_logged() {
    var currently_logged=localStorage.getItem("NejiLoged");
    var outer=document.getElementById("out");
    var reg=document.getElementById("reg");
    if(currently_logged!="Login")
    {
        var log=document.getElementById("using");
        log.text=currently_logged;
        log.href="../Pages/404.html";
        outer.setAttribute("hidden",false);
        reg.style.visibility="hidden";
    }
    else
    {
        //outer.setAttribute("hidden",true);
        outer.style.visibility="hidden";
        reg.style.visibility="visible";
    }

}
function loggout() {
    firebase.auth().signOut().then(function() {
        localStorage.setItem("NejiLoged","Login");
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });

    location = location;
}