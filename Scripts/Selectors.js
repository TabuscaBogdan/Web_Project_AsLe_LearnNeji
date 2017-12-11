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
    var path="../Images/Simbols/Japanese/h-"+nume[1]+".gif";
    document.getElementById("current_symbol").src=path;
}