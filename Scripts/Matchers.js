



//prepare preia elementele necesare pt procesare de imagine
function prepare()
{
    var painted=document.getElementById("can");
    var painted_context=painted.getContext("2d");
    var p_height=painted.height;
    var p_width=painted.width;


    //punem simbolul curent intrun canvas
    var simbol=document.getElementById("current_symbol");
    var c_simbol=document.createElement("canvas");
    c_simbol.width=p_width;
    c_simbol.height=p_height;
    c_simbol.getContext('2d').drawImage(simbol,0,0,c_simbol.width,c_simbol.height);
    var p_simbol=c_simbol.getContext('2d');

    //itemele procesate
    var information=[painted_context,p_simbol,p_width,p_height];
    return information;
}

//returneaza intervalele de pixeli negri de pe linie
function get_line_intervals(canvas_context,c_height,c_width)
{
    var found=0;
    var a,b;
    var intervale=[];

    var pixels = canvas_context.getImageData(0, 0, c_width, c_height);
    var blueComponent;

    console.time('someFunction');
    for( var linie=0;linie<c_height;linie++)
    {
        for(var j=0;j<c_width;j++)
        {
            // var pixel = canvas_context.getImageData(linie, j, 1, 1);
            blueComponent = pixels.data[((linie * (pixels.width * 4)) + (j * 4)) ];

            if(found==0)
            {
                if(blueComponent==0)
                {
                    found=1;
                    a=j;
                }
            }
            else
            {
                if(blueComponent==255)
                {
                    found=0;
                    b=j;
                    var x={line:linie,st:a,end:b}
                    intervale.push(x);
                }
            }
        }
    }

    console.timeEnd('someFunction');

    console.log(intervale)
    return intervale;
}

function compare_intervals(inta,intb)
{
    if(inta["st"]>intb["st"])
    {
        if(inta["end"]<intb["end"])
        {
            return [{line:inta["line"],st:intb["st"],end:inta["st"]},{line:inta["line"],st:inta["end"],end:intb["end"]}]
        }
        else
            if(inta["st"]<=intb["end"])
                return [{line:inta["line"],st:intb["end"],end:inta["end"]}]
            else
                return [inta];
    }
    else
    {
        if(inta["end"]<=intb["st"])
        {
            return [inta];
        }
        else
        {
            if(inta["end"]>intb["end"])
                return [{line:inta["line"],st:inta["st"],end:intb["st"]},{line:inta["line"],st:intb["end"],end:inta["end"]}]
            else
                return [{line:inta["line"],st:inta["st"],end:intb["st"]}]
        }
    }

}

//pt gasirea intervalelor de pe aceeasi linie
function get_interval_chunks(draw,simb,numberDr,numberSi,start)
{
    var i=start;
    var j=0;
    var dr=[];
    var si=[];
    var lino=simb[start]["line"];
    while (i<numberSi&&simb[i]["line"]==lino)
    {
        si.push(simb[i]);
        i++;
    }
    for(j=0;j<numberDr;j++)
    {
        if(draw[j]["line"]==lino)
        {
            while (j<numberDr&&draw[j]["line"]==lino)
            {
                dr.push(draw[j]);
                j++;
            }
            j=numberDr;
        }

    }
    return [si,dr]
}

//pt compararea efectiva de intervale
//returneaza intervalele care vor fi colorate in rosu (DE PE LINIA DATA)
function bad_intervals(chunks)
{
    var i=0,j=0;
    var si_len=chunks[0].length;
    var dr_len=chunks[1].length;
    var r_interval;
    var bad=[];
    while (i<si_len&&j<dr_len)
    {
        r_interval=compare_intervals(chunks[1][j],chunks[0][i]);
        if(r_interval[0]["line"]!=0)
            bad.push.apply(bad,r_interval);
        i++;
        j++;
    }
    if (i<si_len)
    {
        while(i<si_len)
        {
            bad.push(chunks[0][i]);
            i++;
        }
    }
    if (j<dr_len)
    {
        while(j<dr_len)
        {
            bad.push(chunks[1][j]);
            j++;
        }
    }
    return bad;

}

// returneaza toate intervalele ce trebuie colorate cu rosu
function compare_pictures()
{
    var info=prepare();
    var drawing=get_line_intervals(info[0],info[2],info[3]);//intervalele de pixeli de la canvas
    var simbol=get_line_intervals(info[1],info[2],info[3]);//intervalele de pixeli de la simbol

    var si_len=simbol.length;
    var dr_len=drawing.length;
    var chunk;

    var bad_intervales=[];
    for(var linie=simbol[0]["line"];linie<si_len;linie++)
    {
        chunk=get_interval_chunks(drawing,simbol,dr_len,si_len,linie);
        linie=linie+chunk[0].length;
        bad_intervales.push.apply(bad_intervales,bad_intervals(chunk));
    }

    //resturile
    var j=0;
    while (drawing[j]["line"]<simbol[0]["line"]&& j<dr_len)
    {
        bad_intervales.push(drawing[j])
        j++;
    }
    j=dr_len-1;
    si_len--;
    while(drawing[j]["line"]>simbol[si_len]["line"]&&j>0)
    {
        bad_intervales.push(drawing[j])
        j--;
    }
    //pt statistica
    var good_nr=0;
    var err_nr=0;
    for(var i=0;i<si_len;i++)
    {
        good_nr=good_nr+(simbol[i]["end"]-simbol[i]["st"]);
    }
    var err_len=bad_intervales.length;
    for(var i=0;i<err_len;i++)
    {
        err_nr=err_nr+(bad_intervales[i]["end"]-bad_intervales[i]["st"]);
    }

    return [bad_intervales,good_nr,err_nr];
}

//compararea efectiva a imaginilor
function expose_errors() {
     //WIP
    var cv=document.getElementById("can");



    document.getElementById("canvasimg").style.border = "2px solid";
    var cvimg=document.getElementById("canvasimg");
    cvimg.style.border="2px solid";
    //var dataURL = canvas.toDataURL();
    //document.getElementById("canvasimg").src = dataURL;

    var finale=document.createElement("canvas");

    finale.width=cv.width;
    finale.height=cv.height;

    cvimg.width=cv.width;
    cvimg.height=cv.height;

    var fcv=finale.getContext("2d");
    fcv.drawImage(cv,0,0,finale.width,finale.height);

    var errors=compare_pictures();

    var m_errors=errors[0].length;
    var linie=0;
    var j=0;

    fcv.fillStyle="red";
    for (i=0;i<m_errors;i++)
    {
        linie=errors[0][i]["line"];
        fcv.fillRect(errors[0][i]["st"],linie,errors[0][i]["end"]-errors[0][i]["st"],1);
        /*for(j=errors[i]["st"];j<=errors[i]["end"];j++)
        {
            pix=fcv.getImageData(linie, j, 1, 1);

            pix.data[0]=100;
            pix.data[1]=100;
            pix.data[2]=100;
            pix.data[3]=255;

        }*/

    }
    document.getElementById("canvasimg").src = finale.toDataURL("image/png");
    document.getElementById("canvasimg").style.display = "inline";

    if(errors[2]>errors[1])
    {
        errors[2]=-errors[2];
    }
    var precent_good=(100.0*errors[2])/errors[1];
    window.alert(precent_good+'%');
}

//for testing pourpouses
function test()
{
    var t=compare_pictures();
    var x=0;

}