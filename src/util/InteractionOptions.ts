import type { CacheType, CommandInteractionOption, Interaction } from "discord.js";

export class InteractionOptions {

    private options: CommandInteractionOption<CacheType>[] | undefined;

    constructor(private i: Interaction) {
        this.options = (i as any).options != undefined ? ((i as any).options as any).data : undefined;
    }

    public get(name: string): any | null {
        if (this.options == undefined) return null;

        for (let o of this.options) {
            if(o == undefined) continue;
            /*if (o.type == 1)
                for (const o2 of o.options) if (o2.name == option) return o2.value;*/

            if (o.name == name) return o.value;
        }

        return null;
    }
}