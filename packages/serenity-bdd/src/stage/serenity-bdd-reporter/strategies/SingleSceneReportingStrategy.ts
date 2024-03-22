import { ActivityFinished, ActivityStarts, DomainEvent, SceneFinished, SceneStarts } from '@serenity-js/core/lib/events';
import { ScenarioDetails } from '@serenity-js/core/lib/model';
import { match } from 'tiny-types';

import { SceneReport } from '../reports';
import { SceneReportingStrategy } from './SceneReportingStrategy';

/**
 * @package
 */
export class SingleSceneReportingStrategy extends SceneReportingStrategy {
    worksFor(anotherScenario: ScenarioDetails): boolean {
        return this.scenario.equals(anotherScenario);
    }

    handle(event: DomainEvent, report: SceneReport): SceneReport {
        return match<DomainEvent, SceneReport>(event)
            .when(SceneStarts,      (e: SceneStarts)      => report.executionStartedAt(e.timestamp))
            .when(ActivityStarts,   (e: ActivityStarts)   => report.activityStarted(e.value, e.timestamp))
            .when(ActivityFinished, (e: ActivityFinished) => report.activityFinished(e.value, e.outcome, e.timestamp))
            .when(SceneFinished,    (e: SceneFinished)    => {
                return report
                    .executionFinishedAt(e.timestamp)
                    .executionFinishedWith(e.value, e.outcome);
            })
            .else(e => super.handle(e, report));
    }
}
