import { ensure, isDefined, JSONObject } from 'tiny-types';

import { Description } from '../model';
import { DomainEvent } from './DomainEvent';

export class SceneTemplateDetected extends DomainEvent {
    public static fromJSON(o: JSONObject) {
        return new SceneTemplateDetected(
            Description.fromJSON(o.template as string),
        );
    }

    constructor(
        public readonly template: Description,
    ) {
        super();
        ensure('template', template, isDefined());
    }
}
