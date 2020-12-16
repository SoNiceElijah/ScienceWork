
let C = {} //constants;

function fillConstants()
{
    C = {
        
        tj : -2,
        tau : 1,

        A : (Yd) => {
            return (PlayRayleigh(C.b0*(1 + C.gammad*Yd)));
        },
        Ipre : (t) => {
            if(t > C.tj + C.tau) 
            {
                C.tj = t + (PlayPoisson(C.fin));
            }  

            if(t > C.tj && t < C.tj + C.tau)
                return 1;
            
            return 0;
        }
    }

    $('.left-bar-content input').each(function (e) {
        C[this.id] = parseFloat(this.value);
    })

    /* C = {
        gna : 120,
        gk : 36,
        gl : 0.3,

        ENa : 50,
        Ek : -77,
        El : -54.4,

        Ith : 5.7,

        thg : 0.7,
        thd : 0.7,
        thx : 0.7,

        k0 : 2,

        ax : 0.1,
        ag : 0.01,
        ad : 0.01,

        kg : 0.1,
        ai : 0.1,

        gammag : 0,
        gammad : 1,

        kd : 0.1,

        C : 100,
        kx : 0.01,
    } */

    C.fin = Math.floor((1.0 / C.fin) * 1000);
    console.log(C);
}

function DXDT(params)
{
    let x = params[1];
    let yg = params[2];
    let ipre = C.Ipre(params[0]);
    
    return -C.ax*(x - C.k0*(1 + C.gammag * yg) * H(ipre - 0.5));
}

function DYgDT(params)
{
    let yg = params[2];
    let x = params[1];

    return -C.ag*(yg - Math.pow(1 + Math.exp(-(x-C.thg)/C.kg),-1));
}

function DIepscsDT(params)
{
    let iepscs = params[3];
    let ipre = C.Ipre(params[0]);
    let yd = params[4];

    return -C.ai*(iepscs + C.A(yd) * H(ipre - 0.5));
}

function DYdDT(params)
{
    let yd = params[4];
    let x = params[1];

    return -C.ad * (yd - Math.pow((1 + Math.exp(-(x-C.thd)/C.kd)),-1));
}

function DVDT(params)
{
    let v = params[5];
    let n = params[6];
    let m = params[7];
    let h = params[8];
    let x = params[1];
    let iepscs = params[3];

    return (1/C.C)*(C.Ith - Iion(n,m,h,v) - iepscs * Math.pow(1 + Math.exp(-(x-C.thx)/C.kx),-1));
}

function Iion(n,m,h,v)
{
    let Ina = C.gna*Math.pow(m,3)*h*(v-C.ENa);
    let Ik = C.gk * Math.pow(n,4)*(v-C.Ek);
    let Il = C.gl*(v - C.El);

    return Ina + Ik + Il;
}

function DNiDT(params)
{
    let n = params[6];
    let v = params[5];

    return AlphaN(v)*(1-n)-BettaN(v)*n;
}

function DMiDT(params)
{
    let m = params[7];
    let v = params[5];

    return AlphaM(v)*(1-m)-BettaM(v)*m;
}

function DHiDT(params)
{
    let h = params[8];
    let v = params[5];

    return AlphaH(v)*(1-h) - BettaH(v)*h;
}

function AlphaN(v)
{
    return (0.01 * (v + 55)) / (1 - Math.exp(0.1 * (-55 - v)));
}

function BettaN(v)
{
    return 0.125 * Math.exp((-v-65)/80);
}

function AlphaM(v)
{
    return (0.1*(v+40))/(1 - Math.exp(0.1*(-40-v)));
}

function BettaM(v)
{
    return 4 * Math.exp((-v-65)/18);
}

function AlphaH(v)
{
    return 0.07 * Math.exp(0.05*(-v-65));
}

function BettaH(v)
{
    return Math.pow(1 + Math.exp(0.1*(-35-v)),-1);
}

function H(x)
{
    return (1 + Math.sign(x))/2;
}

let Bucket = [];
let BucketIpre = [];

function GeenratorTest()
{
    createPoisson('ch7',C.fin);
    createRayleigh('ch8',C.b0);

    let pt = [];
    let rt = [];

    for(let i = 0; i < 100000; ++i)
    {
        pt.push(PlayPoisson(C.fin));
    }

    for(let i = 0; i < 100000; ++i)
    {
        rt.push(PlayRayleigh(C.b0));
    }

    let xs = [];
    let ys = [];
    for(let i = 0; i < 26; ++i)
    {
        xs.push(i);
        ys.push(pt.reduce((acc,el) => {
            if(el == i)
                acc += 1;
            return acc;
        },0) / pt.length)
    }

    updateChart('ch7',{x:xs,y:ys},1);

    xs = [];
    ys = [];

    for(let i = 0; i < 25.01; i+=0.2)
    {
        xs.push(i);
        ys.push(rt.reduce((acc,el) => {
            if(Math.abs(i - el) < 0.1)
                acc += 1;
            return acc;
        },0) / (rt.length*0.2))
    }

    updateChart('ch8',{x:xs,y:ys},1);
}

let spikesData;
function addSpikeIntervalDot(time) {
    time = time / 1000;
    spikesData.ts.push(time);
}

function releaseSpikeIntervals()
{
    let xs = [];
    for(let t of spikesData.ts) xs.push(spikesData.pos);

    console.log("Drawn");

    addToChart('ch9',{x:xs,y:spikesData.ts},0,false);
}

function Run(scounter = false)
{
    createPoisson('ch5',C.fin);
    createRayleigh('ch6',C.b0);

    let p = [
        0.0, //0 t
        0.0, //1 X
        0.0, //2 Yg
        0.0, //3 Iepscs
        0.0, //4 Yd
        0.0, //5 V
        0.0000, //6 n
        0.0000, //7 m
        0.0000 //8 h
    ];
    let f = [
        () => 1,
        DXDT,
        DYgDT,
        DIepscsDT,
        DYdDT,
        DVDT,
        DNiDT,
        DMiDT,
        DHiDT
    ];

    console.log(C.gammad);

    const threshold = 10;
    let spike = false;
    let under = true;

    let spikec = 0;
    let prevt = 0;

    let size = 100;
    let pause = 40;
    let pack = 100;
    spikesData = { pos : C.gammad, ts : [] };
    if(scounter)
    {       
        size = 20000;
        pause = 0;
        pack = 1000;
    }

    let step = () => {

        if(!DataProccesing)
            return;

        let s = 0.001;
        for(let i = 0; i < size; ++i)
        {
            if(!scounter)
            {
                Bucket.push(p);
                BucketIpre.push(C.Ipre(p[0]));
            }
            let next = p;
            for(let j = 0; j < pack; ++j) 
            {
                next = RK4(f,next,s);
            }

            let v = next[5];
            if(v > threshold && under) { spike = true; under = false; }
            if(next[5] < p[5] && spike) 
            {
                addSpikeIntervalDot(p[0]);

                ++spikec;
                if(spikec >= 100) { releaseSpikeIntervals(); DataProccesing = false; return; };

                spike = false;
            }
            if(v < threshold && !under) under = true;
            p = next;
        }        
        
        if(Bucket.length > 1)
            DrawBucket();

        if(!scounter)
            setTimeout(step,pause);
            
    }

    if(scounter) while(spikec < 100) step();
    else step();


}

function DrawBucket()
{
    addToChart('ch1',{
        x : Bucket.map(e => (e[0] / 1000)),
        y : BucketIpre
    });

    addToChart('ch2',{
        x : Bucket.map(e => (e[0] / 1000)),
        y : Bucket.map(e => e[1])
    });

    addToChart('ch3',{
        x : Bucket.map(e => (e[0] / 1000)),
        y : Bucket.map(e => e[3])
    });

    addToChart('ch4',{
        x : Bucket.map(e => (e[0] / 1000)),
        y : Bucket.map(e => e[5])
    });

    Bucket = [];
    BucketIpre = [];
}