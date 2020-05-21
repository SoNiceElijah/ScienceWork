

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
createChart('ch5','P(t)','t, ms');
createChart('ch6','P(A)','A, A/cm^2');


/* function createChart(id,name, min, max)
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
} */

function createChart(id,name, xAxis, max)
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
            b: 40,
            t: 10,
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


    Plotly.newPlot(document.getElementById(id),[{ x: [], y : [], mode : 'lines', line : {shape : mode}}],layout);
}

function updateChart(id,data)
{
    let div = document.getElementById(id);
    div.data[0].x = data.x;
    div.data[0].y = data.y;
    Plotly.redraw(div);
}

function addToChart(id,data)
{
    let div = document.getElementById(id);
    div.data[0].x = div.data[0].x.concat(data.x);
    div.data[0].y = div.data[0].y.concat(data.y);

    if(div.data[0].x.length > 901)
    {
        div.data[0].x = div.data[0].x.slice(1);
        div.data[0].y = div.data[0].y.slice(1);
    }

    Plotly.redraw(div);
}

function PoissonDestribution(l,x)
{
    return (Math.pow(l,x) / fuctorial(x))*Math.exp(-l);
}

function PlayPoisson(l)
{
    let k = 0;

    let left = 0;
    let right = left + PoissonDestribution(l,k);

    let x = Math.random();

    while(left > x || right < x)
    {
        ++k;
        left = right;
        right = left + PoissonDestribution(l,k);
    }

    return k;
}

function fuctorial(n)
{
    if(n == 'undefined')
        throw "OSHIBKA TUT";

    if(n == 0)
        return 1;
    
    return n * fuctorial(n-1);
}

function createPoisson(id,l)
{
    let xs = [];
    let ys = [];

    for(let i = 0; i < 26; ++i)
    {
        xs.push(i);
        ys.push(PoissonDestribution(l,i));
    }

    updateChart(id,{x : xs, y : ys});
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

updateChart('ch1',{x : [0], y : [0]});

function clearCharts()
{
    updateChart('ch1',{x : [0], y : [0]});
    updateChart('ch2',{x : [], y : []});
    updateChart('ch3',{x : [], y : []});
    updateChart('ch4',{x : [], y : []});
    updateChart('ch5',{x : [], y : []});
    updateChart('ch6',{x : [], y : []});
}