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

function RayleighDistribution(a,x)
{
    return (x/(a*a))*Math.exp(-((x*x)/(2*a*a)));
}

function PlayRayleigh(a)
{
    let x = Math.random();
    return Math.sqrt(-2*a*a*Math.log(1-x));
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

function createRayleigh(id,a)
{
    let xs = [];
    let ys = [];

    for(let i = 0; i < 25.01; i += 0.01)
    {
        xs.push(i);
        ys.push(RayleighDistribution(a,i));
    }

    updateChart(id,{x : xs, y : ys});
}