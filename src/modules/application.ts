import { IApp, IKubectlMetadata, IKubectlApp, IGithubRepository, ICronjob, IPodSize} from '../types';
import { IAddon } from './addons';

export class KubectlApp implements IKubectlApp{
    apiVersion: string;
    kind: string;
    metadata: IKubectlMetadata;
    spec: App;

    constructor(app: App) {
        this.apiVersion = "application.kubero.dev/v1alpha1";
        this.kind = "KuberoApp";
        this.metadata = {
            name: app.name,
            labels: {
                manager: 'kubero',
            }
        }
        this.spec = app;
    }
}

export class App implements IApp{
    public name: string
    public pipeline: string
    public phase: string
    public buildpack: string
    public deploymentstrategy: 'git' | 'docker';
    public gitrepo?: IGithubRepository
    public branch: string
    public autodeploy: boolean
    public domain?: string
    public podsize: IPodSize
    public autoscale: boolean
    //public envVars: {[key: string]: string} = {}
    public envVars: {}[] = []
    public cronjobs: ICronjob[] = []
    public addons: IAddon[] = []

    public web: {
        replicaCount: number
        autoscaling: {
            minReplicas: number
            maxReplicas: number
            targetCPUUtilizationPercentage?: number
            targetMemoryUtilizationPercentage?: number
        }
    }

    public worker: {
        replicaCount: number
        autoscaling: {
            minReplicas: number
            maxReplicas: number
            targetCPUUtilizationPercentage?: number
            targetMemoryUtilizationPercentage?: number
        }
    }

    private affinity: {};
    private autoscaling: {
        enabled: boolean,
    };
    private fullnameOverride: "";

    public image: {
        containerPort: number,
        pullPolicy: 'Always',
        repository: string,
        tag: string,
        fetch: {
            repository: string,
            tag: string,
            securityContext?: {
                readOnlyRootFilesystem?: boolean;
                allowPrivilegeEscalation?: boolean;
                capabilities?: {
                    drop?: string[];
                    add?: string[];
                }
            }
        }
        build: {
            repository: string,
            tag: string,
            securityContext?: {
                readOnlyRootFilesystem?: boolean;
                allowPrivilegeEscalation?: boolean;
                capabilities?: {
                    drop?: string[];
                    add?: string[];
                }
            }
        }
        run: {
            repository: string,
            tag: string,
            readOnly?: boolean,
            securityContext?: {
                readOnlyRootFilesystem?: boolean;
                allowPrivilegeEscalation?: boolean;
                capabilities?: {
                    drop?: string[];
                    add?: string[];
                }
            }
        }
    };

    private imagePullSecrets: [];
    private ingress?: {
        annotations: {},
        className: string,
        enabled: true,
        hosts: [
            {
                host: string,
                paths: [
                    {path: string, pathType: string}
                ]
            }
        ],
        tls: [],
    };
    private nameOverride: "";
    private nodeSelector: {};
    private podAnnotations: {};
    private podSecurityContext: {};
    private replicaCount: 1;
    public resources: {};
    private service: {
        port: 80,
        type: 'ClusterIP'
    };
    private serviceAccount: {
        annotations: {},
        create: true,
        name: "",
    };
    private tolerations: [];

    constructor(
        app: IApp
    ) {
        this.name = app.name
        this.pipeline = app.pipeline
        this.phase = app.phase
        this.buildpack = app.buildpack
        this.deploymentstrategy = app.deploymentstrategy
        this.gitrepo = app.gitrepo
        this.branch = app.branch
        this.autodeploy = app.autodeploy
        this.podsize = app.podsize
        this.domain = app.domain
        this.autoscale = app.autoscale // TODO: may be redundant with autoscaling.enabled

        this.envVars =  app.envVars

        this.cronjobs = app.cronjobs

        this.addons = app.addons

        this.web =  app.web
        this.worker =  app.worker

        this.affinity = {};
        this.autoscaling = {
            enabled: app.autoscale
        }
        this.fullnameOverride = "",

        this.image = {
            containerPort: app.image.containerPort,
            pullPolicy: 'Always',
            repository: app.image.repository || 'busybox',
            tag: 'latest',
            fetch: app.image.fetch,
            build: app.image.build,
            run: app.image.run,
        }

        this.imagePullSecrets = []

        if (app.domain) {
            this.ingress= {
                annotations: {},
                className: process.env.KUBERNETES_INGRESS_CLASSNAME || "",
                enabled: true,
                hosts: [
                    {
                        host: app.domain,
                        paths: [
                            {path: "/" , pathType: 'ImplementationSpecific'}
                        ]
                    }
                ],
                tls: [],
            }
        }
        this.nameOverride= "",
        this.nodeSelector= {},
        this.podAnnotations= {},
        this.podSecurityContext= {},
        this.replicaCount= 1,
        this.resources= app.podsize.resources,
        this.service= {
            port: 80,
            type: 'ClusterIP'
        },
        this.serviceAccount= {
            annotations: {},
            create: true,
            name: "",
        },
        this.tolerations= []
    }
}