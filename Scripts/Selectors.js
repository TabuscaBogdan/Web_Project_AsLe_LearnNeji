function get_selected_lang(language)
{
    var nume=language.text;
    var path="../Images/Simbols/"+nume;
    //nu poti itera prin foldere...
    //need more info
}


function get_selected_symbol(simbol)
{
    var nume=simbol.text.split("-");
    //window.alert(nume[1]);
    //trebuie adaugat si pt limbi
    var path="../Images/Simbols/Japanese/hiragana-"+nume[1]+".png";
    document.getElementById("current_symbol").src=path;
}

function hover(element) {
    //window.alert(element.src)
    var nume=element.src.split("-");
    var tname=nume[1].split(".");
    element.src="../Images/Simbols/Japanese/h-"+tname[0]+".gif";
    //element.setAttribute('src', "LearnNeji/Simbols/Images/Simbols/Japanse/h-"+tname[0]+".gif");
    //window.alert(element.src)
}
function unhover(element) {
    var nume=element.src.split("-");
    var tname=nume[1].split(".");
    element.setAttribute('src', "../Images/Simbols/Japanese/hiragana-"+tname[0]+".png");
}