

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


createChart('ch1','Ipre',0,1);
createChart('ch2','X');
createChart('ch3','IEPSCs');
createChart('ch4','V');
createChart('ch5','P(t)');
createChart('ch6','P(A)');


function createChart(id,name, min, max)
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
            }
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

    if(charts[id].data.labels.length > 600)
    {
        charts[id].data.labels = charts[id].data.labels.slice(200);
        charts[id].data.datasets[0].data = charts[id].data.datasets[0].data.slice(200);
    }

    charts[id].update();
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

createPoisson(3);
function createPoisson(l)
{
    let xs = [];
    let ys = [];

    for(let i = 0; i < 26; ++i)
    {
        xs.push(i);
        ys.push(PoissonDestribution(l,i));
    }

    updateChart('ch5',{x : xs, y : ys});
}

document.getElementById('go').onclick = () => {
    
    if(!DataProccesing)
    {
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