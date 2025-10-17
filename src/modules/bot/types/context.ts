import { SceneContext, SceneSessionData } from 'telegraf/scenes';

export interface MySessionData extends SceneSessionData {
  name?: string;
  contact?: string;
}

export interface MyContext extends SceneContext<MySessionData> {}
