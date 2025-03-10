import debug from 'debug';
debug('app:addons')
import { Kubectl } from './kubectl';
import { KubernetesListObject, KubernetesObject } from '@kubernetes/client-node'
import { PostgresCluster } from '../addons/postgresCluster';
import { RedisCluster } from '../addons/redisCluster';
import { Redis } from '../addons/redis';
//import { PerconaServerMongoDB } from '../addons/perconaServerMongoDB';
import { MongoDB } from '../addons/mongoDB';
import { Minio } from '../addons/minio';
import { IPlugin } from '../addons/plugin';


export interface AddonOptions {
    kubectl: Kubectl;
}
export interface IAddonMinimal {
    group: string;
    version: string;
    namespace: string;
    pipeline: string;
    phase: string;
    plural: string;
    id: string;
}

export interface IAddonFormFields {
    type: 'text' | 'number' |'switch',
    label: string,
    name: string,
    required: boolean,
    default: string | number | boolean,
    description?: string,
    //value?: string | number | boolean,
}

export interface IAddon {
    id: string
    operator: string,
    enabled: boolean,
    name: string,
    CRDkind: string,
    icon: string,
    version: string
    plural: string;
    description?: string,
    install: string,
    formfields: {[key: string]: IAddonFormFields},
    crd: KubernetesObject
}

interface IUniqueAddons {
    [key: string]: IAddon
}

export class Addons {
    private kubectl: Kubectl;
    private operatorsAvailable: string[] = [];
    public addonsList: IPlugin[] = []
    private operatorsList: any;

    constructor(
        options: AddonOptions
    ) {
        this.kubectl = options.kubectl
    }

    public async loadOperators(): Promise<void> {

        this.operatorsList = await this.kubectl.getOperators()

        const postgresCluster = new PostgresCluster(this.operatorsList)
        this.addonsList.push(postgresCluster)

        const redisCluster = new RedisCluster(this.operatorsList)
        this.addonsList.push(redisCluster)

        const redis = new Redis(this.operatorsList)
        this.addonsList.push(redis)

        const mongoDB = new MongoDB(this.operatorsList)
        this.addonsList.push(mongoDB)

        const minio = new Minio(this.operatorsList)
        this.addonsList.push(minio)
    }

    public async getAddonsList(): Promise<IPlugin[]> {
        return this.addonsList
    }

    public getOperatorsList(): string[] {
        return this.operatorsAvailable
    }

    public deleteAddon(addon: IAddonMinimal) {
        console.log(addon)
        //return this.kubectl.deleteResource(addon)
    }
}