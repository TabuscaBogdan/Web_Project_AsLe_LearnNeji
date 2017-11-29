



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
    for( var linie=0;linie<c_height;linie++)
    {
        for(var j=0;j<c_width;j++)
        {
            var pixel = canvas_context.getImageData(linie, j, 1, 1);
            if(found==0)
            {
                if(pixel.data[0]==0)
                {
                    found=1;
                    a=j;
                }
            }
            else
            {
                if(pixel.data[0]==255)
                {
                    found=0;
                    b=j;
                    var x={line:linie,st:a,end:b}
                    intervale.push(x);
                }
            }
        }
    }
    return intervale;
}

function compare_intervals(inta,intb)
{
    if(inta["st"]>=intb["st"])
    {
        if(inta["end"]<=intb["end"])
        {
            return {line:0,st:0,end:0}
        }
        else
            if(inta["st"]<=intb["st"])
                return {line:inta["line"],st:intb["end"],end:inta["end"]}
            else
                return inta;
    }
    else
    {
        if(inta["end"]<=intb["st"])
        {
            return inta;
        }
        else
        {
            if(inta["end"]>intb["end"])
                return intb;
            else
                return {line:inta["line"],st:inta["st"],end:intb["st"]}
        }
    }
}

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
        if(r_interval["line"]!=0)
            bad.push(r_interval);
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

function compare_pictures()
{
    var info=prepare();
    var drawing=get_line_intervals(info[0],info[2],info[3]);//intervalele de pixeli de la canvas
    var simbol=get_line_intervals(info[1],info[2],info[3]);//intervalele de pixeli de la simbol

    var si_len=simbol.length;
    var dr_len=drawing.length;
    var chunk;

    var bad_intervales=[];
    for(var linie=simbol[0]["line"];linie<=si_len;linie++)
    {
        chunk=get_interval_chunks(drawing,simbol,dr_len,si_len,linie);
        linie=linie+chunk[0].length;
        bad_intervales.push.apply(bad_intervales,bad_intervals(chunk));
    }
    return bad_intervales;
}

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

    var m_errors=errors.length;
    var linie=0;
    var j=0;

    fcv.fillStyle="red";
    for (i=0;i<m_errors;i++)
    {
        linie=errors[i]["line"];
        fcv.fillRect(linie,errors[i]["st"],1,errors[i]["end"]-errors[i]["st"]);
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
}

function test()
{
    var t=compare_pictures();
    var x=0;

}