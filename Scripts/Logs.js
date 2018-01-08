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
            var uid=firebaseUser.uid;
            localStorage.setItem("NejiLoged",email);
            localStorage.setItem("NejiID",uid);
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
        //**change for symbol completion page**//
        log.href="../Pages/ScorePage.html";
        //---------------------------//
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
        localStorage.setItem("NejiID",null);
        var symbol_vector_jpn=["ha","ma","na","ra","wa","yu"];
        var symbol_vector_kor=["a","ae","ya"];
        var jpn_len=symbol_vector_jpn.length;
        var kor_len=symbol_vector_kor.length;
        var symbol;
        for(var i=0;i<jpn_len;i++)
        {
            symbol=symbol_vector_jpn[i];
            localStorage.setItem(symbol,0);
        }
        for(var i=0;i<kor_len;i++)
        {
            symbol=symbol_vector_kor[i];
            localStorage.setItem(symbol,0);
        }
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });

    location = location;
}

//------------Database Functions-----------------
function send_scores() {
    var symbol_vector_jpn=["ha","ma","na","ra","wa","yu"];
    var symbol_vector_kor=["a","ae","ya"];
    var user=localStorage.getItem("NejiID");
    if(user!=null)
    {
        //-----------------------------------------------
        //Inainte de a seta trebuie facut un get la score pt a nu suprascrie high-score
        var obj_w_simbols=firebase.database().ref('users/' + user);
        var high_scores;
        obj_w_simbols.on('value', function(snapshot) {
            var scores = snapshot.val();
            high_scores=scores;
            //-----------------------------------------------
            var database = firebase.database();
            var jpn_len=symbol_vector_jpn.length;
            var kor_len=symbol_vector_kor.length;
            obj={};
            var symbol;
            for(var i=0;i<jpn_len;i++)
            {
                symbol=symbol_vector_jpn[i];
                score=localStorage.getItem(symbol);
                if(score==null)
                {
                    score=0;
                }
                var key = symbol;
                if(high_scores!=null) {
                    if (high_scores.hasOwnProperty(key)) {
                        if (high_scores[key] > score) {

                            score = high_scores[key];
                        }
                    }
                }
                obj[key] =score;
            }
            for(var i=0;i<kor_len;i++)
            {
                symbol=symbol_vector_kor[i];
                score=localStorage.getItem(symbol);
                if(score==null)
                {
                    score=0;
                }
                var key = symbol;
                obj[key] =score;
            }

            firebase.database().ref('users/' + user).set(obj);
        });

    }
}

function get_scores()
{
    var user=localStorage.getItem("NejiID");
    if(user!=null)
    {
        var onpage_sy=document.getElementsByClassName("enlarging_image");
        var node_number=onpage_sy.length;
        var obj_w_simbols=firebase.database().ref('users/' + user);
        obj_w_simbols.on('value', function(snapshot) {
            var scores=snapshot.val();
            var ddiv =document.createElement("div");
            //**********************************
            // Beautify this
            // ddiv.classList.add('MyClass');
            //**********************************
            //delete style once you make class
            ddiv.style.width = "auto";
            ddiv.style.height = "auto";
            for (var key in scores) {
                if (scores.hasOwnProperty(key)) {
                    //console.log(key + " -> " + scores[key]);
                    for(var i=0;i<node_number;i++)
                    {
                        var im_src=onpage_sy[i].attributes.src.value;
                        var im_name=im_src.split("-");
                        var sym_name=im_name[1].split(".");
                        if(sym_name[0]==key)
                        {
                            var para = document.createElement("p");
                            var node = document.createTextNode("Score: "+scores[key]+"%");
                            para.appendChild(node);
                            ddiv.appendChild(para);
                            ddiv.appendChild(onpage_sy[i]);

                            i=node_number;
                        }
                    }
                }
            }
            document.getElementById("main").appendChild(ddiv);
        });
    }
}