export default class Model{
    constructor(id){
        this.id = id;
        switch(id){
            case 'I':
                this.model = [
                    [id],
                    [id],
                    [id],
                    [id],
                ];
                break;
            case 'J':
                this.model = [
                    [-1, id],
                    [-1, id],
                    [id, id],
                ];
                break;
            case 'L':
                this.model = [
                    [id, -1],
                    [id, -1],
                    [id, id],
                ];
                break;
            case 'O':
                this.model = [
                    [id, id],
                    [id, id],
                ];
                break;
            case 'N':
                this.model = [
                    [-1, id],
                    [id, id],
                    [id, -1],
                ];
                break;
            case 'S':
                this.model = [
                    [id, -1],
                    [id, id],
                    [-1, id],
                ];
                break;
            case 'T':
                this.model = [
                    [id, id, id],
                    [-1, id, -1],
                ];
                break;
        }
    }
    getId(){
        return this.id;
    }
    getModel(){
        return this.model;
    }

}

Model.L = new Model('L');
Model.I = new Model('I');
Model.J = new Model('J');
Model.O = new Model('O');
Model.N = new Model('N');
Model.S = new Model('S');
Model.T = new Model('T');

Object.freeze(Model);
