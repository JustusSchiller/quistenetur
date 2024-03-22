import { ensure, isDefined, JSONObject } from 'tiny-types';

import { Description } from '../model';
import { DomainEvent } from './DomainEvent';

export class SceneDescriptionDetected extends DomainEvent {
    public static fromJSON(o: JSONObject) {
        return new SceneDescriptionDetected(
            Description.fromJSON(o.description as string),
        );
    }

    constructor(
        public readonly description: Description,
    ) {
        super();
        ensure('description', description, isDefined());
    }
}
