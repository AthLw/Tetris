import model from './Model.js';

var graph = new Array();

var speed = 1;
var score = 0;
var needNext = false;
var datafreshId;
var renderId;
var currentShape = null;
var currentObj = null;
var preObj = null;                          //存储前一帧对象位置


init();
document.onkeydown = listener;
Run();

function init(){
    generateObj();              //首先生成对象
    for(let i = 0; i < 20; i++){                       //生成表格
        let row = document.createElement("tr");
        graph[i] = [];
        for(let j = 0; j < 15; j++){
            let cell = document.createElement("td");
            //cell.setAttribute("width","30px");
            row.appendChild(cell);
            graph[i][j]= -1;
        }
        document.getElementById("grid").appendChild(row);
    }
}

function generateObj(){
    let id = parseInt(Math.random()*7,10);
    let shape;
    switch(id){
        case 0:
            shape = model.L;
            break;
        case 1:
            shape = model.I;
            break;
        case 2:
            shape = model.J;
            break;
        case 3:
            shape = model.O;
            break;
        case 4:
            shape = model.N;
            break;
        case 5:
            shape = model.S;
            break;
        case 6:
            shape = model.T;
            break;
    }
    currentShape = shape;
    preObj = null;
    currentObj = {
        id: currentShape.getId(),
        edge: [0, 7],
        area: currentShape.getModel(),
    };
    needNext = false;
    //NormalMove('D');
    return;
}

function Next(){
    generateObj();
    NormalMove('D');
}

function Run(){
    datafreshId = setInterval(DataRefresh, 500);
    renderId = setInterval(render, 20);
}

function DataRefresh(){
    
    // if(removeRes){
    //     //preObj = currentObj;
    //     console.log("remove failed");
    // }
    if(preObj == null){
        preObj = {
            id: currentShape.getId(),
            edge: [0, 7],
            area: currentShape.getModel(),
        };
        currentObj = {
            id: currentShape.getId(),
            edge: [0, 7],
            area: currentShape.getModel(),
        };
        //debug();
        Map(currentObj, "addCurrent");
        //debug();
    }else{
        //debug();
        NormalMove('D');
        //debug();
    }
    
}

// function debug(){
//     console.log(preObj);
//     console.log(currentObj);
//     console.log(graph[0]);
//     console.log(graph[1]);
//     console.log(graph[2]);
// }

function shouldOver() {
    for(let i = 0; i < 15; i++){
        if(graph[0][i] != -1){
            return true;
        }
    }
    return false;
}

function NormalMove(direction){
    if(needNext){
        CanAddScore();
        let isOver = shouldOver();
        if(isOver){
            GameOver();
        }
        return Next();
    }
    
    if(currentObj == null){
        return;
    }
    //debug();
    let removeRes = Map(preObj, "removePre");
    //debug();
    // if(!removeRes){
    //     needNext = true;
    // }
    //debug();
    var tryResult = tryMove(direction);
    //debug();
    if(tryResult != null){
        currentObj = tryResult;
        preObj = currentObj;
        //console.log("currentObj has been changed");
    }else{
        needNext = true;
    }
    //debug();
    Map(currentObj, "addCurrent");
    //debug();
}

function listener(){
    if(currentObj == null){
        return;
    }
    let offset = '';
    let e = event;
    switch(e.keyCode){
        case 37:           //左移函数
            offset = 'L';
            NormalMove(offset);
            break;

        case 38:
            offset = 'U';
            NormalMove(offset);
            break;

        case 39:
            offset = 'R';
            NormalMove(offset);
            break;

        case 40:
            offset = 'D';
            NormalMove(offset);
            break;
    }
    
}

function Map(Obj, dest){
    
    if(Obj == null){
        return false;
    }
    let width = Obj.area[0].length;
    let globalBottom = Obj.edge[0];
    let globalTop = globalBottom - Obj.area.length + 1;
    let localTop = 0;
    if(globalTop < 0){
        localTop = -globalTop;
        globalTop = 0;
    }
    let height;
    if((globalBottom - globalTop+1) > Obj.area.length){
        height = Obj.area.length;
    }else {
        height = globalBottom - globalTop + 1;
    }
    for(let i = 0; i < height; i++){
        let localrows = Obj.area[localTop+i];
        let globalrows = graph[globalTop+i];
        for(let j = 0; j < width; j++){
            if(localrows[j] == -1){
                continue;
            }else{
                switch(dest){
                    case "removePre":
                        if(localrows[j] == globalrows[j+Obj.edge[1]]){
                            //console.log(globalrows[7]);
                            //console.log("shanchule" + globalrows[j+Obj.edge[1]]+ "cihang haiyou" + globalrows);
                            globalrows[j+Obj.edge[1]] = -1;
                            //console.log(globalrows[7]);
                            //return true;
                            //document.getElementById("grid").rows[i].cells[j].style.backgroundColor = chooseColor(-1);
                            //console.log("xianzai shi " + globalrows);
                        }else{
                            console.log("error,删除时 ["+(globalTop+i)+","+((j+Obj.edge[1])+"] 对比失败"+ globalrows[j+Obj.edge[1]])+"   "+localrows[j]);
                            return false;
                        }
                        break;
                    case "addCurrent":
                        if(globalrows[j+Obj.edge[1]] == -1){
                            globalrows[j+Obj.edge[1]] = localrows[j];
                            console.log("加入成功");
                        }else{
                            console.log("error,加入时 ["+(globalTop+i)+","+((j+Obj.edge[1])+"] 加入失败"));
                            console.log(globalrows[j+Obj.edge[1]]);
                            return false;
                        }
                        break;
                    case "try":
                        if(globalrows[j+Obj.edge[1]] != -1){
                            return false;
                        }
                        break;   
                }
            }
        }
    }
    return true;
}

function tryMove(offset){
    let temp = currentObj;
    if(temp == null){
        return null;
    }
    var obj = {};
    let res;
    switch(offset){
        case 'L':
            obj = {
                id: temp.id,
                edge: [temp.edge[0], temp.edge[1]-1],
                area: temp.area,
            }
            res = CanNext(obj);
            if(res){
                return obj;
            }else{
                return temp;
            }

        case 'R':
            obj = {
                id: temp.id,
                edge: [temp.edge[0], temp.edge[1]+1],
                area: temp.area,
            }
            res = CanNext(obj);
            if(res){
                return obj;
            }else{
                return temp;
            }

        case 'U':
            let width = temp.area.length;
            let height = temp.area[0].length;
            console.log(temp.area);
            let newarea = [];
            for(let i = 0; i < height; i++){
                newarea[i] = [];
                for(let j = 0; j < width; j++){
                    newarea[i][j] = temp.area[j][height - i -1];               //逆时针旋转
                }
            }
            console.log(newarea);
            obj = {
                id: temp.id,
                edge: temp.edge,
                area: newarea,
            }
            res = CanNext(obj);
            if(res){
                console.log(obj);
                return obj;
            }else{
                console.log("rotate failed");
                return temp;
            }

        case 'D':
            obj = {
                id: temp.id,
                edge: [temp.edge[0]+speed, temp.edge[1]],
                area: temp.area,
            }
            res = CanNext(obj);
            console.log("try result is "+res);
            if(res){
                return obj;
            }else{
                return null;
            }
    }
}

function CanNext(nextObj){
    let globalcol = nextObj.edge[1];
    let width = nextObj.area[0].length;
    if(nextObj.edge[1] < -1 || (globalcol + width) > 15){                //判断两侧是否越界
        return false;
    }
    let globalBottom = nextObj.edge[0];
    if(globalBottom > 19){                                          //判断底端是否越界
        return false;
    }
    if(globalBottom == 19){
        needNext = true;
    }
    // let globalTop = globalBottom - nextObj.area.length + 1;
    // let localTop = 0;
    // if(globalTop < 0){
    //     localTop = -globalTop;
    //     globalTop = 0;
    // }
    // let height;
    // if((globalBottom - globalTop+1) > nextObj.area.length){
    //     height = nextObj.area.length;
    // }else {
    //     height = globalBottom - globalTop + 1;
    // }
    // for(let i = 0; i < height; i++){
    //     let localrows = nextObj.area[localTop+i];
    //     let globalrows = graph[globalTop+i];
    //     for(let j = 0; j < width; j++){
    //         if(localrows[j] == -1){
    //             continue;
    //         }else if(globalrows[j+globalcol] != -1){
    //             console.log(globalrows[j+globalcol])
    //             return false;
    //         }
    //     }
    // }

    return Map(nextObj, "try");
}

function render(){                                      //根据二维数组值来渲染界面,flag代表是否移动结束
    let table = document.getElementById("grid");
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 15; j++){
            let value = graph[i][j];
            let color = chooseColor(value);
            table.rows[i].cells[j].style.backgroundColor = color;
        }
    }
    document.getElementById("score").innerHTML = score;
}

function CanAddScore(){
    console.log("addsocre has start");
    let row = 19;
    for(let i = graph.length-1; i >= 0; row--){
        if(row >= 0){
            let removeFlag = true;
            for(let j = 0; j < graph[row].length; j++){
                if(graph[row][j] == -1){
                    removeFlag = false;
                }
            }
            if(removeFlag){
                continue;
            }else{
                if(row != i){
                    graph[i] = graph[row];
                }
                i--;
            }
        }else{
            score++;
            graph[i] = Array.apply(null,Array(15)).map(function(v, i){        //返回15个0的数组
                return -1;
            });
            i--;
        }
    }
    console.log("has added score");
}

function chooseColor(value){
    switch(value){
        case -1:
            //背景色
            return "Lime";
        case 'I':
            return "Cyan";
        case 'J':
            return "Blue";
        case 'S':
            return "Green";
        case 'N':
            return "Red";
        case 'O':
            return "Yellow";
        case 'L':
            return "Orange";
        case 'T':
            return "Purple";
    }
}

function GameOver(){
    clearInterval(datafreshId);
    clearInterval(renderId);
    document.onkeydown = "";
}