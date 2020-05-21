let C = {} //constants;

function fillConstants()
{
    C = {
        
        tj : -1,
        tau : -1,

        A : (t) => {
            return 0.16;
        },
        Ipre : (t) => {
            if(t > C.tj + C.tau) 
            {
                C.tj = t + PlayPoisson(C.fin);
                C.tau = PlayPoisson(C.fin);
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

    return -C.ai*(iepscs + C.A() * H(ipre - 0.5));
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

function Run()
{
    createPoisson('ch5',C.fin);
    createPoisson('ch6',C.b0);

    p = [0.0,0,0.1,0.0001,0.1,-190,0.0001,0.0001,0.0001];
    f = [
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

    let step = () => {

        if(!DataProccesing)
            return;

        Bucket.push(p);
        BucketIpre.push(C.Ipre(p[0]));
        p = RK4(f,p,0.5);
        
        
        if(Bucket.length > 1)
            DrawBucket();

        setTimeout(step,5);

    }

    step();
}

function DrawBucket()
{
    addToChart('ch1',{
        x : Bucket.map(e => (e[0]/1000)),
        y : BucketIpre
    });

    addToChart('ch2',{
        x : Bucket.map(e => (e[0]/1000)),
        y : Bucket.map(e => e[1])
    });

    addToChart('ch3',{
        x : Bucket.map(e => (e[0]/1000)),
        y : Bucket.map(e => e[3])
    });

    addToChart('ch4',{
        x : Bucket.map(e => (e[0]/1000)),
        y : Bucket.map(e => e[5])
    });

    Bucket = [];
}