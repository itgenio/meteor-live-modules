type ImportOptions = {
  importTimeout?: number;
};

export interface ILiveModules {
  getModulesWithTagsOrNames(tagsOrNames: string[]): Record<string, DBLiveModule>;

  /*
   * Is subscription ready?
   */
  subReady(): Promise<void>;

  /*
   * Import module by name or tag
   */
  importModule(tagOrName: string, opts?: ImportOptions): Promise<any>;

  /*
   * Import modules by names or tags
   */
  importModules(tagsOrNames?: string[], opts?: ImportOptions): Promise<void>;

  subscribe(): void;

  markAsReady(): void;

  require(tagOrName: string): any | undefined;
}

export type DBLiveModule = {
  _id: string;
  enabled: boolean;
  tags?: string[];
  v: number;
  url?: string;
  source?: string;
  name: string;
  required?: boolean;
};

export type ILiveModulesConfig = {
  collName: string,
  subName: string,
  logging: boolean,
  importTimeout: number,
  subOnStartup: boolean,
  jsMarker: string,
};
