export class Category {
    static BETA = new Category("beta", 10);
 
    constructor(public readonly id: string, public readonly permlvl: number = 0) {}
}
