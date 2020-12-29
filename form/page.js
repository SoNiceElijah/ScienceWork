

let bwl = '1';
let bwr = '3';

let DataProccesing = false;

Chart.defaults.global.animation.duration = 100;
Chart.defaults.global.animation.easing = 'linear';

let charts = {};

$('.swb').click(e => {
    let cid = e.currentTarget.id.substring(2);

    if(cid == bwl || cid == bwr)
        return;

    if(cid == '1' || cid == '2')
    {
        $('#sw'+ cid).attr('selected','selected');
        $('#sw'+ bwl).removeAttr('selected');

        bwl = cid;    
        
        $('.left-bar-content .container').removeClass('visible');
    }
    else
    {
        $('#sw'+ cid).attr('selected','selected');
        $('#sw'+ bwr).removeAttr('selected');

        bwr = cid;

        $('.right-bar-content .container').removeClass('visible');
    }

    $('#c' + cid).addClass('visible');
})


createChart('ch1','Ipre',null,true);
createChart('ch2','X');
createChart('ch3','IEPSCs');
createChart('ch4','V');
createChart('ch5','P(t)','t, ms', null,'bar');
createChart('ch6','P(A)','A, 1e^-6 A/cm^2');

createChart('ch7','Poisson','x', null,'bar','teoretical');
createChart('ch8','Rayleigh ','x',null,'lines','teoretical');

createChart('ch9','Analysis','Yg|Yd',null,'scatter',"",'markers');
createChart('ch10','Analysis','Yg|Yd',null,'scatter',"",'markers');
createChart('ch11','Analysis','Yg|Yd',null,'scatter',"",'lines+markers');


createChartData('ch7','bar','experemental');
createChartData('ch8','lines','experemental');
createChartData('ch9','scatter',null,'markers','rgba(255,0,0,1)')
createChartData('ch10','scatter',null,'markers','rgba(255,0,0,1)')
createChartData('ch11','lines',null,'lines+markers','rgba(255,0,0,1)');


//createChartData('ch9','scatter','analysis');

document.getElementById('c4').classList.remove('visible');
document.getElementById('c5').classList.remove('visible');

let test_b = `function createChart(id,name, min, max)
{
    let options = {
        elements: {
            point:{
                radius: 0
            }
        },
    };

    if(min || max)
    {
        options =  {
            ...options,
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: min,
                        suggestedMax: max
                    }
                }]
            },
            animation: false
        }
    };

    document.getElementById(id).height = document.getElementById(id).clientHeight + 'px';
    let ctx = document.getElementById(id).getContext('2d');    

    charts[id] = new Chart(ctx, {
        type : 'line',
        data : {
            datasets : [{
                label : name,
                lineTension: 0,
                borderColor : '#5953d4',
                fill: false
            }]
        },
        options
    });
} 

function updateChart(id,data)
{
    charts[id].data.labels = data.x;
    charts[id].data.datasets[0].data = data.y;

    charts[id].update();
}

function addToChart(id, data)
{
    charts[id].data.labels.push( ...(data.x));
    charts[id].data.datasets[0].data.push(...(data.y));

    if(charts[id].data.labels.length > 302)
    {
        charts[id].data.labels = charts[id].data.labels.slice(2);
        charts[id].data.datasets[0].data = charts[id].data.datasets[0].data.slice(2);
    }

    charts[id].update();
} `;

function createChart(id,name, xAxis, max, type, dataName = "",smode="lines")
{
    let mode = 'linear'
    if(max)
    {
        mode = 'hv';
    }
    if(!xAxis)
    {
        xAxis = "t, seconds";
    }

    console.log(document.getElementById(id).clientHeight);
    const layout = {
        autosize: false,
        width: document.getElementById(id).clientWidth,
        height: document.getElementById(id).clientHeight,
        paper_bgcolor: '#e9e9e9',
        plot_bgcolor: '#e9e9e9',
        margin: {
            l: 70,
            r: 30,
            b: 50,
            t: 50,
            pad: 4
          },
        xaxis: {
            title: {
                text: xAxis,
            }
        },
        yaxis: {
            title: {
                text: name,
            }
        }
    }

    let data = {
        x: [], y : [], mode : smode, line : {shape : mode},
        name : dataName,
        marker: {
            symbol: 'circle',
            size: 1
        }
    }
    if(type)
        data['type'] = type;
    else
        data['type'] = 'lines';

    Plotly.newPlot(document.getElementById(id),[data],layout);
}

function createChartData(id,mode, name="",smode = "lines",color)
{
    let div = document.getElementById(id);

    let data = {
        x: [], y : [], mode : smode,type : mode, name : name,
        marker: {
            symbol: 'circle',
            size: 2,
            color : color
        }
        
    }

    div.data.push(data)
    Plotly.redraw(div);
}

function updateChart(id,data,layer=0)
{
    let div = document.getElementById(id);
    div.data[layer].x = data.x;
    div.data[layer].y = data.y;
    Plotly.redraw(div);
}

function addToChart(id,data,layer=0,check=true)
{
    let div = document.getElementById(id);
    div.data[layer].x = div.data[layer].x.concat(data.x);
    div.data[layer].y = div.data[layer].y.concat(data.y);

    if(check)
    {
        let n = div.data[layer].x.length;
        while((div.data[layer].x[n-1] - div.data[layer].x[0]) > 1)
        {
            div.data[layer].x.shift();
            div.data[layer].y.shift();

            n = div.data[layer].x.length;
        }
    }

    Plotly.redraw(div);
}

function fuctorial(n)
{
    if(n == 'undefined')
        throw "FACTORIAL SLOMALSIA";

    if(n == 0)
        return 1;
    
    return n * fuctorial(n-1);
}

document.getElementById('go').onclick = () => {

    if(!DataProccesing)
    {
        clearCharts();
        DataProccesing = true;
        fillConstants();
        Run();
        
        document.getElementById('go').innerHTML = 'stop';
    }
    else
    {
        DataProccesing = false;
        document.getElementById('go').innerHTML = 'go';

    }
}

document.getElementById('analitics').onclick = () => {
    if(!DataProccesing)
    {
        document.getElementById('analitics').innerHTML = 'stop';

        document.getElementById('gammad').value = '0.0';

        for(let yg = -2.0; yg <= 0.0; yg += 0.1)
        {
            DataProccesing = true;
            document.getElementById('gammag').value = yg + '';
            fillConstants();
            Run(true,0);
        }
        document.getElementById('gammag').value = '0.0';
        for(let yd = 0; yd <= 5.05; yd += 0.1)
        {
            DataProccesing = true;
            document.getElementById('gammad').value = yd + '';
            fillConstants();
            Run(true,1);
        }
      
        document.getElementById('analitics').innerHTML = 'produce';
    }
    else
    {
        DataProccesing = false;
        document.getElementById('analitics').innerHTML = 'produce';
    }
}

document.getElementById('gen').onclick = () => {
    clearCharts(1);

    fillConstants();
    GeenratorTest();
}

updateChart('ch1',{x : [0], y : [0]});

function clearCharts(page = 0)
{

    if(page == 0)
    {
        updateChart('ch1',{x : [0], y : [0]});
        updateChart('ch2',{x : [], y : []});
        updateChart('ch3',{x : [], y : []});
        updateChart('ch4',{x : [], y : []});
        updateChart('ch5',{x : [], y : []});
        updateChart('ch6',{x : [], y : []});
    }

    if(page == 1)
    {
        updateChart('ch7',{x : [], y : []},0);
        updateChart('ch8',{x : [], y : []},0);

        updateChart('ch7',{x : [], y : []},1);
        updateChart('ch8',{x : [], y : []},1);
    }

    if(page == 2)
    {
        updateChart('ch9',{x : [], y : []},0);
        updateChart('ch9',{x : [], y : []},1);
        updateChart('ch10',{x : [], y : []},0);
        updateChart('ch10',{x : [], y : []},1);
    }
}